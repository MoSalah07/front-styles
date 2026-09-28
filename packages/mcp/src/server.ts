import { TOOLS_BY_NAME, toolManifest } from "./tools";
import { VERSION } from "./catalogue";

/**
 * The Model Context Protocol, spoken directly.
 *
 * MCP is JSON-RPC 2.0 over newline-delimited stdio, and the part of it a
 * read-only tool server needs is three methods. Implementing those is a few
 * dozen lines; taking the official SDK would add a dependency tree to a
 * package whose entire job is to hand back strings it already has on disk.
 *
 * Protocol reference: https://modelcontextprotocol.io/specification
 */

/** The spec revision this server implements. */
export const PROTOCOL_VERSION = "2024-11-05";

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  /** Absent on a notification, which must not be answered. */
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string };
}

/** JSON-RPC reserved codes. */
const METHOD_NOT_FOUND = -32601;
const INVALID_PARAMS = -32602;
const INTERNAL_ERROR = -32603;

function ok(id: JsonRpcRequest["id"], result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function err(id: JsonRpcRequest["id"], code: number, message: string): JsonRpcResponse {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

/**
 * Answers one request, or returns `null` for a notification.
 *
 * Pure: no stdio, no process state. The transport below is what makes it a
 * server, and the tests call this directly.
 */
export function handle(request: JsonRpcRequest): JsonRpcResponse | null {
  // A notification has no id and, per JSON-RPC, must receive no reply at all.
  const isNotification = request.id === undefined;

  switch (request.method) {
    case "initialize":
      return ok(request.id, {
        protocolVersion: PROTOCOL_VERSION,
        // Tools only: this server has no resources to subscribe to and no
        // prompts, and announcing capabilities it does not have would make a
        // client call methods that are not there.
        capabilities: { tools: {} },
        serverInfo: { name: "design-eg", version: VERSION },
      });

    case "notifications/initialized":
    case "initialized":
      return null;

    case "ping":
      return ok(request.id, {});

    case "tools/list":
      return ok(request.id, { tools: toolManifest() });

    case "tools/call": {
      const name = request.params?.name;
      if (typeof name !== "string") {
        return err(request.id, INVALID_PARAMS, "`name` is required and must be a string");
      }

      const tool = TOOLS_BY_NAME.get(name);
      if (!tool) {
        return err(request.id, INVALID_PARAMS, `Unknown tool "${name}"`);
      }

      const args = (request.params?.arguments ?? {}) as Record<string, unknown>;

      try {
        return ok(request.id, {
          content: [{ type: "text", text: tool.handler(args) }],
        });
      } catch (cause) {
        // A thrown handler is a bug here, not a caller error — but it comes
        // back as a tool result rather than a transport error, so the model
        // can see what happened and try something else.
        const message = cause instanceof Error ? cause.message : String(cause);
        return ok(request.id, {
          content: [{ type: "text", text: `Tool "${name}" failed: ${message}` }],
          isError: true,
        });
      }
    }

    default:
      if (isNotification) return null;
      return err(request.id, METHOD_NOT_FOUND, `Unknown method "${request.method}"`);
  }
}

export interface Transport {
  /** Newline-delimited JSON in. */
  input: NodeJS.ReadableStream;
  /** Newline-delimited JSON out. */
  output: NodeJS.WritableStream;
}

/**
 * Reads requests off a stream and writes replies back.
 *
 * Buffers to the newline rather than assuming one chunk is one message: a
 * 500 KB source file in a reply is several chunks, and so is a large request.
 */
export function serve({ input, output }: Transport): void {
  let buffer = "";

  input.setEncoding?.("utf8");

  input.on("data", (chunk: string) => {
    buffer += chunk;

    let newline = buffer.indexOf("\n");
    while (newline !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf("\n");

      if (!line) continue;

      let response: JsonRpcResponse | null;
      try {
        response = handle(JSON.parse(line) as JsonRpcRequest);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : String(cause);
        response = err(null, INTERNAL_ERROR, `Malformed request: ${message}`);
      }

      if (response) output.write(`${JSON.stringify(response)}\n`);
    }
  });
}
