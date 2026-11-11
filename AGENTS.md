# AGENTS.md

This repo is a fork of humanlayer/skills. Upstream owns the content of `plugins/**`; this fork owns a small, recorded delta on top.

## Fork decisions

Every change this fork makes to an upstream-owned path is a **fork decision**: record it in [FORK-DECISIONS.md](FORK-DECISIONS.md) — paths, delta, why, sync policy. A delta with no entry is a bug: the next sync will revert it.

Machine-enforced decisions live in `scripts/check-sync-invariants.ts`; keep the script and the ledger consistent — one decision, two views.

## Syncing

Syncing runs through the `sync-upstream` skill. Consult the ledger before merging. When upstream touches a recorded decision, keep the decision unless the user picks upstream. A genuinely ambiguous call is a question: ask the user in an interactive run, or leave it as a SKIPPED entry with the question spelled out in the sync PR body when running in CI.