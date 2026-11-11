# Agent Memory: Upstream Sync

Standing feedback for future `Agent: Upstream Sync` runs.

## Guidance

- The fork's only intended delta is the `disable-model-invocation: true` flags listed in `scripts/check-sync-invariants.ts`. When a conflict touches those frontmatter blocks, keep upstream content and re-add the flags on top.
- Prefer `git checkout --theirs` for content conflicts; do not hand-merge upstream prose line by line.
- If `bun scripts/check-sync-invariants.ts` fails after the merge, restore the flags. Never weaken the script to make it pass.
- When upstream renames or deletes a plugin the fork carries, note it in the report as SKIPPED for human review; do not resurrect deleted paths.
- Branch naming: `agent/sync-upstream/MM-DD`. One open PR at a time, labeled `agent-sync-upstream`.
- Upstream remote is added per-run (`git remote add upstream ... || true`); CI checkouts never carry it.