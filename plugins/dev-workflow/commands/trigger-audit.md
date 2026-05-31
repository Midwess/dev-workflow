---
description: Run a saved audit charter against the CURRENT code. Delegates to the opus auditor, which reads case.md, inspects live code, judges every invariant, and writes a dated result-<date>.md verdict (pass | concerns | fail) in the same folder. Re-runnable any time — old verdicts are kept as history.
argument-hint: <path> [--filter <glob>] [--since-last] [--update-last-run]
allowed-tools: Read, Glob, Grep, Bash(ls:*), Bash(find:*), Bash(date:*), Bash(git:*), Edit, Task(auditor)
---

Run one or more saved audit charters against the **current** code. For each `case.md` found, the `auditor` agent (opus) reads the charter, inspects the live codebase, judges each invariant, cites fresh `file:line` evidence, and writes a `result-<YYYY-MM-DD>.md` verdict in the same folder.

Use the `audit-flow` skill (`plugins/dev-workflow/skills/audit-flow/SKILL.md`) as the format authority. The auditor re-derives all evidence this run — the charter is durable, the verdict is dated.

## Input

`$ARGUMENTS`:
- `<path>` — Required. Either a single audit folder (containing `case.md`) OR an audits root (containing many audit folders). Auto-detected.
- `--filter <glob>` — Only run audits whose id/folder matches the glob (e.g. `security-*`).
- `--since-last` — Tell the auditor to emphasize the `## Diff Since Last Run` section (what changed in scoped areas since the prior result).
- `--update-last-run` — After a successful run, update the `last_run` frontmatter field in `case.md` to today's date. (The auditor never touches `case.md`; this command does it.)

## Steps

### 1. Load the audit-flow skill

Read `plugins/dev-workflow/skills/audit-flow/SKILL.md`. The charter/verdict separation and "auditors recommend, never patch" rule are mandatory.

### 2. Discover audit charters

If `<path>` contains a `case.md` directly → single-audit mode.

Else recursively walk `<path>` (depth 2) and collect every `*/case.md`.

For each, parse its YAML frontmatter. Reject malformed (warn + skip). Required fields: `id`, `title`, `aspect`, `scope`. Apply `--filter` to narrow the set.

### 3. Print the run plan

```
## Audit run plan
Target path: <path>
Audits to run: <N>

| id | aspect | severity_focus | last_run |
|----|--------|----------------|----------|
| ... |
```

For a batch (>1), ask the user to confirm before proceeding. Single-audit mode proceeds directly.

### 4. Delegate execution per audit

For each charter, invoke the `auditor` agent (opus) with:

```
Audit folder: <path-to-folder>
case.md frontmatter: {parsed YAML}
Emphasis: {"diff since last run" if --since-last, else "full audit"}
Discipline: read case.md, inspect CURRENT code, judge every invariant, cite fresh file:line evidence, reach verdict (pass|concerns|fail), write result-<date>.md. NEVER edit code. NEVER overwrite a prior result. NEVER edit case.md.
```

The auditor owns code inspection, invariant judgment, evidence collection, verdict, and the result-file write.

After the auditor returns, parse the result file's `verdict` frontmatter.

### 5. Update `last_run` (only if `--update-last-run`)

If `--update-last-run` is set and the run produced a result, use Edit to set `last_run: <today>` in that folder's `case.md`. Change ONLY that field — never the body. Without the flag, leave `case.md` untouched.

### 6. Running summary

After each audit:

```
[trigger-audit] <audit-id>: <verdict>
  result file: <path>
  invariants: <held>/<total> hold
  findings: <count> (highest: <severity>)
```

### 7. Final output

```
## Audit run complete

Total: <N>   Pass: <p>   Concerns: <c>   Fail: <f>

### Result files
- {path1}  (verdict: pass, invariants 4/4)
- {path2}  (verdict: fail, highest: high — 2 findings)

### Next steps
- Open any `concerns`/`fail` result for `## Findings`, `## Invariant Checks`, and `## Recommendations`.
- Route fixes through:
  /dev-workflow:proposal <fix description>
- Re-run this audit after changes with the same command.
```

## Notes

- **The auditor recommends, never patches.** Fixes go through `/dev-workflow:proposal` → `/dev-workflow:apply`.
- **Never overwrite a prior result.** Each run writes a new dated file; if one exists for today, the auditor suffixes `-2`, `-3`, … The verdict trail is the value.
- **Fresh evidence every run.** `file:line` references are re-derived against the current code — they may differ from earlier runs (the charter is general by design).
- **Real timestamps + commit.** The auditor stamps `run_time_utc` from `date -u` and `commit` from `git rev-parse --short HEAD`.
- **A `fail` is first-class.** A clear fail with evidence is more useful than a hand-wavy pass.
