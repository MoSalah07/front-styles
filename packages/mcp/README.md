# @design-eg/mcp

An [MCP](https://modelcontextprotocol.io) server for the design-eg catalogue.
It lets an assistant ask what is in the library instead of guessing from
training data: which components exist, what a component's source actually is,
what a brand's tokens resolve to, and the command that copies any of it into a
project.

## Setup

Point an MCP client at it. No install step — `npx` fetches it on first run.

```json
{
  "mcpServers": {
    "design-eg": {
      "command": "npx",
      "args": ["-y", "@design-eg/mcp"]
    }
  }
}
```

That file is `claude_desktop_config.json` for Claude Desktop, `.mcp.json` for
Claude Code, and the equivalent MCP block for any other client.

## Tools

| Tool               | Answers                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| `list_items`       | Everything in the registry, optionally filtered to one category              |
| `search_items`     | "Is there a component for X?" — ranked by name, then title, then description |
| `get_item`         | One item: description, dependencies, install command and its full source     |
| `get_install_plan` | What a set of items pulls in transitively, and the npm packages they need    |
| `list_brands`      | The compiled brands, with seed colour, radius and font stacks                |
| `get_tokens`       | Every semantic token for one brand and colour mode, as `var()` and as hex    |

## How it answers

The registry and the compiled tokens are **baked into the package at build
time**, not read from a workspace or fetched from the site. That is deliberate:
it is installed with `npx` on a machine where neither exists, an assistant
asking for a component should not wait on a network round trip, and an answer
that changes under the caller between two questions is worse than one that is
merely a release old. `catalogue.version` is always the version of the library
the sources came from.

Every tool returns Markdown rather than JSON. The consumer is a language model:
a fenced code block and a heading are read more reliably than a nested object,
and the source of a component is the answer to most of these questions anyway.

The source it hands back is the **rewritten** source — the one with `@/lib/utils`
rather than `../lib/cn` — so it compiles in the reader's project rather than
only in this repo.

## Protocol

MCP is JSON-RPC 2.0 over newline-delimited stdio, and a read-only tool server
needs three methods of it. This package implements them directly rather than
taking the official SDK, which would add a dependency tree to a package whose
whole job is handing back strings it already has on disk.

Implemented: `initialize`, `ping`, `tools/list`, `tools/call`, and the
`notifications/initialized` acknowledgement. Not implemented, and not
advertised in `capabilities`: resources, prompts, sampling.

## Development

```bash
pnpm --filter @design-eg/mcp build   # snapshot the registry, then bundle
pnpm --filter @design-eg/mcp test
```

The build runs `scripts/snapshot-registry.mjs` first, which needs the registry
to exist — run `pnpm --filter @design-eg/registry build` before it, or just
`pnpm build` from the root, which orders them for you.

The snapshot is committed and carries no timestamp, so it has to exist for
`tsc` on a fresh clone and a rebuild that changed nothing leaves no diff.
