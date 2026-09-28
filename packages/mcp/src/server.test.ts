import { PassThrough } from "node:stream";
import { describe, expect, it } from "vitest";
import { handle, serve, PROTOCOL_VERSION } from "./server";
import { TOOLS, TOOLS_BY_NAME, toolManifest } from "./tools";
import { getItem, ITEMS, resolveDependencies, search } from "./catalogue";

function call(name: string, args: Record<string, unknown> = {}): string {
  const response = handle({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: { name, arguments: args },
  });

  const result = response?.result as { content: { text: string }[]; isError?: boolean };
  expect(result.isError, `${name} returned an error: ${result?.content?.[0]?.text}`).toBeFalsy();
  return result.content[0]!.text;
}

describe("catalogue", () => {
  it("snapshots every registry item with its source", () => {
    expect(ITEMS.length).toBeGreaterThan(50);
    for (const item of ITEMS) {
      expect(item.name, `${item.name} has no title`).toBeTruthy();
      expect(item.files.length, `${item.name} has no files`).toBeGreaterThan(0);
      for (const file of item.files) {
        expect(file.content.length, `${item.name}/${file.path} is empty`).toBeGreaterThan(0);
      }
    }
  });

  it("rewrites imports to the consumer's aliases, not the workspace's", () => {
    const button = getItem("button");
    // The source an assistant is handed has to be the source that compiles in
    // the reader's project, which is what the registry rewrite is for.
    expect(button?.files[0]?.content).toContain("@/lib/utils");
    expect(button?.files[0]?.content).not.toContain("../lib/cn");
  });

  it("resolves registry dependencies transitively", () => {
    const deps = resolveDependencies(["data-table"]);
    // data-table composes pagination, which itself needs button.
    expect(deps).toContain("pagination");
    expect(deps).toContain("button");
    // The items asked for are not listed as their own dependencies.
    expect(deps).not.toContain("data-table");
  });

  it("ranks an exact name above a description mention", () => {
    const hits = search("dialog");
    expect(hits[0]?.name).toBe("dialog");
  });

  it("returns nothing for an empty query rather than everything", () => {
    expect(search("   ")).toEqual([]);
  });

  /**
   * Registry names are hyphenated and questions are not. Without normalising
   * both sides, "sign in" matched nothing at all while `login-split` sat in
   * the catalogue describing itself as a sign-in page.
   */
  it("matches a hyphenated name from a query typed as words", () => {
    expect(search("sign in").map((i) => i.name)).toContain("login-split");
    expect(search("data table").map((i) => i.name)).toContain("data-table");
  });
});

describe("tools", () => {
  it("lists every tool with a schema", () => {
    const manifest = toolManifest();
    expect(manifest.length).toBe(TOOLS.length);
    for (const tool of manifest) {
      expect(tool.name).toMatch(/^[a-z_]+$/);
      expect(tool.description.length).toBeGreaterThan(20);
      expect(tool.inputSchema).toHaveProperty("type", "object");
    }
  });

  it("filters list_items by category", () => {
    const templates = call("list_items", { category: "template" });
    expect(templates).toContain("login-split");
    expect(templates).not.toContain("`button`");
  });

  it("returns a component with its source", () => {
    const text = call("get_item", { name: "button" });
    expect(text).toContain("# Button (`button`)");
    expect(text).toContain("@design-eg/cli add button");
    expect(text).toContain("```tsx");
  });

  it("can omit the source", () => {
    const text = call("get_item", { name: "button", includeSource: false });
    expect(text).not.toContain("```tsx");
  });

  it("suggests near matches for an unknown name", () => {
    const text = call("get_item", { name: "buton" });
    expect(text).toContain("No registry item");
  });

  it("builds an install plan covering transitive items", () => {
    const text = call("get_install_plan", { names: ["data-table"], packageManager: "npm" });
    expect(text).toContain("npx @design-eg/cli add data-table");
    expect(text).toContain("pagination");
  });

  it("resolves tokens for a brand and mode", () => {
    const dark = call("get_tokens", { brand: "crimson", mode: "dark" });
    expect(dark).toContain("--primary:");
    const light = call("get_tokens", { brand: "crimson", mode: "light" });
    expect(light).not.toBe(dark);
  });

  /**
   * A compiled token is `{ css, oklch, hex }`, not a string. Rendering it
   * straight into a template produced `--background: [object Object];`, which
   * is exactly the kind of answer this server exists to stop a model giving.
   */
  it("renders both the var() form and the resolved hex", () => {
    const text = call("get_tokens", { brand: "crimson", mode: "dark" });
    expect(text).not.toContain("[object Object]");
    expect(text).toMatch(/--primary: var\(--brand-600\); \/\* #[0-9a-f]{6} \*\//i);
  });

  it("names the known brands when asked for one that does not exist", () => {
    const text = call("get_tokens", { brand: "chartreuse" });
    expect(text).toContain("No brand called");
    expect(text).toContain("crimson");
  });
});

describe("protocol", () => {
  it("answers initialize with the protocol version and tool capability", () => {
    const result = handle({ jsonrpc: "2.0", id: 1, method: "initialize" })?.result as {
      protocolVersion: string;
      capabilities: Record<string, unknown>;
    };
    expect(result.protocolVersion).toBe(PROTOCOL_VERSION);
    expect(result.capabilities).toHaveProperty("tools");
  });

  it("does not reply to a notification", () => {
    expect(handle({ jsonrpc: "2.0", method: "notifications/initialized" })).toBeNull();
  });

  it("reports an unknown method rather than throwing", () => {
    const response = handle({ jsonrpc: "2.0", id: 7, method: "resources/list" });
    expect(response?.error?.code).toBe(-32601);
    expect(response?.id).toBe(7);
  });

  it("rejects tools/call without a name", () => {
    const response = handle({ jsonrpc: "2.0", id: 8, method: "tools/call", params: {} });
    expect(response?.error?.code).toBe(-32602);
  });

  it("returns a handler failure as a tool error, not a transport error", () => {
    const original = TOOLS_BY_NAME.get("list_brands")!.handler;
    TOOLS_BY_NAME.get("list_brands")!.handler = () => {
      throw new Error("boom");
    };
    try {
      const result = handle({
        jsonrpc: "2.0",
        id: 9,
        method: "tools/call",
        params: { name: "list_brands" },
      })?.result as { isError: boolean; content: { text: string }[] };
      expect(result.isError).toBe(true);
      expect(result.content[0]!.text).toContain("boom");
    } finally {
      TOOLS_BY_NAME.get("list_brands")!.handler = original;
    }
  });
});

describe("transport", () => {
  /** Drives the real stdio loop, which is where the framing lives. */
  async function exchange(lines: string[]): Promise<string[]> {
    const input = new PassThrough();
    const output = new PassThrough();
    const received: string[] = [];

    output.on("data", (chunk: Buffer) => received.push(chunk.toString()));
    serve({ input, output });

    for (const line of lines) input.write(line);
    await new Promise((resolve) => setImmediate(resolve));

    return received.join("").trim().split("\n").filter(Boolean);
  }

  it("reads newline-delimited requests and writes one reply each", async () => {
    const replies = await exchange([
      `${JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize" })}\n`,
      `${JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" })}\n`,
    ]);

    expect(replies).toHaveLength(2);
    expect(JSON.parse(replies[1]!).result.tools.length).toBe(TOOLS.length);
  });

  it("reassembles a request split across chunks", async () => {
    const request = JSON.stringify({ jsonrpc: "2.0", id: 3, method: "ping" });
    const replies = await exchange([request.slice(0, 12), `${request.slice(12)}\n`]);

    expect(replies).toHaveLength(1);
    expect(JSON.parse(replies[0]!).id).toBe(3);
  });

  it("answers malformed JSON with an error instead of dying", async () => {
    const replies = await exchange(["{ not json\n"]);
    expect(JSON.parse(replies[0]!).error.code).toBe(-32603);
  });
});
