#!/usr/bin/env node

/**
 * The design-eg MCP server.
 *
 * Lets an assistant ask what is in the library instead of guessing from
 * training data: which components exist, what a component's source actually
 * is, what a brand's tokens resolve to, and the command that copies any of it
 * into a project.
 *
 * Runs over stdio, which is how an MCP client starts a local server:
 *
 * ```json
 * { "mcpServers": { "design-eg": { "command": "npx", "args": ["-y", "@design-eg/mcp"] } } }
 * ```
 */
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { serve } from "./server";

export { handle, serve, PROTOCOL_VERSION } from "./server";
export type { JsonRpcRequest, JsonRpcResponse, Transport } from "./server";
export { TOOLS, TOOLS_BY_NAME, toolManifest } from "./tools";
export type { ToolDefinition } from "./tools";
export * from "./catalogue";

/**
 * True only when this file is the process entry point.
 *
 * Without it, importing the module — which is what the tests do — would attach
 * a stdin listener and the test run would never exit.
 */
function isEntryPoint(): boolean {
  const argv = process.argv[1];
  if (!argv) return false;
  try {
    return realpathSync(argv) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  serve({ input: process.stdin, output: process.stdout });
}
