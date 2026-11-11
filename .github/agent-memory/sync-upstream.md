# Agent Memory: Upstream Sync

Standing feedback for future `Agent: Upstream Sync` runs.

## Guidance

- Every local delta on upstream-owned paths is a **fork decision** recorded in `FORK-DECISIONS.md`; the flags in `scripts/check-sync-invariants.ts` are its enforced subset. When a conflict touches a decision, keep upstream content and re-apply the decision on top.
- Prefer `git checkout --theirs` for content conflicts; do not hand-merge upstream prose line by line.
- If `bun scripts/check-sync-invariants.ts` fails after the merge, restore the decisions it checks. Never weaken the script to make it pass.
- When upstream renames or deletes a plugin the fork carries, note it in the report as SKIPPED for human review; do not resurrect deleted paths.
- Branch naming: `agent/sync-upstream/MM-DD`. One open PR at a time, labeled `agent-sync-upstream`.
- Upstream remote is added per-run (`git remote add upstream ... || true`); CI checkouts never carry it.