# Fork decisions

One entry per local change to an upstream-owned path (`plugins/**`). Add the entry before the change lands; update it when the decision changes. An entry names the paths, the delta, why, and the sync policy — what a sync must do when upstream touches the same lines.

## Entries

### `disable-model-invocation: true` on user-invoked skills

- **Paths**: `plugins/build-iterated-agentic-loop`, `plugins/design-control-loop`, `plugins/rpi`, `plugins/visual-pr` — each at `skills/<name>/SKILL.md`.
- **Delta**: one frontmatter line per file.
- **Why**: the flag removes the skill from the model entirely; a description-only hint would still ride in context on every turn.
- **Sync policy**: the flag must survive every merge. When a conflict touches those frontmatter blocks, take upstream content and re-add the flag. `scripts/check-sync-invariants.ts` fails without it.

`show-me` carries the same flag from upstream itself — no local delta, nothing to re-apply.

### pi-compatible frontmatter on rpi agents

- **Paths**: `plugins/rpi/agents/` — all five `*.md` agent definitions.
- **Delta**: `tools` lists renamed to the pi tool set (`read, grep, find, bash`, plus `edit, write` for the implementer); `Skill` and `TodoWrite` dropped (no pi equivalents in child sessions); `model:` lines removed so children inherit the session default. `web-search-researcher` also carries `mcp:brave-search` (the user-level `~/.pi/agent/mcp.json` server) for web search; an agent with `mcp:` tools must launch as a background child (async).
- **Why**: these files are symlinked into `~/.pi/agent/agents/` and loaded by pi-subagents, which validates tools and models in pi terms.
- **Sync policy**: keep pi tool names when upstream touches those lines; when upstream adds a tool to an agent, re-map it to the pi name instead of taking the line verbatim. Accepted trade-off: the Claude Code `agents/` loader now sees pi tool names — pi is the primary harness for this fork.

Fork-only paths (`.github/**`, `.agents/**`, `scripts/check-sync-invariants.ts`) have no upstream counterpart and are not decisions — upstream cannot conflict with them.