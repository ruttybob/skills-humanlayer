---
name: sync-upstream
description: sync this fork with upstream humanlayer/skills while preserving local overrides; use git merge from upstream/main instead of rebase or manual cherry-picks
---

# Sync Upstream

Use this skill when the sync workflow asks to bring this fork up to date with humanlayer/skills, or when the user asks to sync the fork.

The goal is a local main that contains every upstream commit with every local override intact.

## Fork policy

- Local overrides beat upstream: every **fork decision** recorded in `FORK-DECISIONS.md` must survive the merge. `scripts/check-sync-invariants.ts` enforces the machine-checkable subset.
- Upstream content beats local intent everywhere else: README, plugin bodies, scripts and references are upstream-owned; do not improve or reword them while merging.
- Merge, never rebase: no history rewriting, no force-push.
- Do not touch `.github/**`, `LICENSE`, or `.gitignore` as part of conflict resolution.

## Workflow

### 1. Fetch and measure drift

```bash
git remote add upstream https://github.com/humanlayer/skills.git 2>/dev/null || true
git fetch upstream main
git log --oneline HEAD..upstream/main
```

Completion criterion: the incoming commit list is known. An empty list ends the run with an "up to date" report — do not open a PR.

### 2. Map the blast radius

```bash
git log HEAD..upstream/main --stat
git diff HEAD...upstream/main --name-only
```

Cross-check the changed paths against the ledger before merging; name the decisions upstream touches.

Completion criterion: you can name which incoming commits touch override files, if any.

### 3. Merge and resolve

```bash
git merge upstream/main --no-edit
```

For each unmerged path:

- Content files (README, SKILL.md bodies, scripts, references): take upstream with `git checkout --theirs`, then re-apply the override lines if the conflicting hunk touches their frontmatter.
- Paths where the fork has no intent: take upstream.
- A conflict touching a fork decision where the call is ambiguous: keep the decision and ask the user (interactive run), or keep the decision and list the open question under SKIPPED in the report (CI run). Never leave conflict markers in the tree.

Completion criterion: `git status` shows no unmerged paths.

### 4. Validate

```bash
bun scripts/check-sync-invariants.ts
```

Completion criterion: exit 0, or the final report names the exact blocker.

### 5. Push

```bash
git push origin HEAD:refs/heads/agent/sync-upstream/$(date +%m-%d)
```

Completion criterion: the pushed branch ref is printed.

### 6. Format the response

The final response becomes the PR body. Structure:

```markdown
## Upstream Sync Complete

### Summary
- Incoming commits: N
- Conflicts: kept upstream X, re-applied override Y, skipped Z
- Validation: bun scripts/check-sync-invariants.ts — PASS/FAIL

### Merged
- <short commit list or grouped description>

### Conflicts Resolved
| Path | Resolution | Risk |
|------|-----------|------|
| `path` | kept upstream / re-applied override | low/medium/high |

### Skipped (needs human)
- <path>: <reason>
```

Completion criterion: every section is present; skipped entries have reasons.

## Review Checklist

- The merge is a merge commit on top of local main, not a rebase.
- Every override from `scripts/check-sync-invariants.ts` is present in the result.
- No conflict markers anywhere in the tree.
- Validation passed or the blocker is documented.
- The report lists every conflict with its resolution.