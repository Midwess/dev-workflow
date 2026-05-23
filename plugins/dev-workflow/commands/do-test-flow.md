---
description: Execute test cases under a path. Delegates to the tester agent (sonnet) which runs ONE Action at a time, observes the environment between Steps, and writes a dated observation log. Auto-invokes the investigator (opus) on failure.
argument-hint: <path> [--filter <glob>] [--dry-run] [--continue-on-fail] [--no-investigate]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Task(tester), Task(investigator)
---

Execute test cases under a path. For each `test-case.md` found, the `tester` agent (sonnet) reads the notebook, runs ONE Action per Step, observes the environment between actions, judges per Step, and writes a `test-<YYYY-MM-DD>.md` observation log. On `fail` or `partial`, the `investigator` (opus) appends a Root Cause Analysis.

Use the `test-flow` skill (`plugins/dev-workflow/skills/test-flow/SKILL.md`) as the format authority. The skill's Core Philosophy — manual, not scripted — applies in full.

Pass `--no-investigate` to skip automatic root-cause analysis on failure.

## Input

`$ARGUMENTS`:
- `<path>` — Required. Either a single test folder (containing `test-case.md`) OR a tests root (containing many test folders). The command auto-detects which.
- `--filter <glob>` — Only run tests whose id matches the glob (e.g. `manager-*`)
- `--dry-run` — Parse and validate test-case.md files, print the plan, but do not run.
- `--continue-on-fail` — Don't stop on first failure in a batch.
- `--tier <name>` — Only tests with this `tier` frontmatter field.
- `--component <name>` — Only tests with this `component` frontmatter field.

## Steps

### 1. Load the test-flow skill

Read `plugins/dev-workflow/skills/test-flow/SKILL.md`. The Core Philosophy section ("Manual, Not Scripted") is mandatory reading before delegating.

### 2. Discover test cases

If `<path>` contains a `test-case.md` directly → single-test mode.

Else recursively walk `<path>` (depth 2) and collect every `*/test-case.md`.

For each found test, parse its YAML frontmatter. Reject malformed (warn + skip). Required fields: `id`, `title`, `tier`, `component`, `target`.

Apply `--filter`, `--tier`, `--component` flags to narrow the set.

### 3. Print execution plan

```
## Execution plan
Target path: <path>
Tests to run: <N>

| id | title | tier | component | est_secs |
|----|-------|------|-----------|----------|
| ... |
```

If `--dry-run`, stop here. Otherwise ask the user to confirm before proceeding. Skip confirmation if `run_policy: auto-proceed` is set in the test's frontmatter OR if env var `CI=1`.

### 4. Pre-flight notebook validation

Before invoking the tester, scan each test-case.md for **bundled Actions** — Steps whose `Action:` line contains `&&`, `||`, `;`, multi-line heredocs, or embedded loops. If found:

- Warn the user
- Note in the run plan that the tester will split these and record under `## Deviations`

This is a tester responsibility too, but pre-flighting surfaces the friction.

### 5. Delegate execution per test

For each test in declared order, invoke the `tester` agent (sonnet) with:

```
Test folder: <path-to-folder>
Test-case.md frontmatter: {parsed YAML}
Discipline: manual — execute ONE Action per Step, observe between Steps, run Awareness checks, never bundle.
Tier/component filters already applied: yes
```

The tester owns precondition verification, single-Action step execution, Awareness checks, per-Step judgment, Expected Behavior judgment, and result-file writing.

After the tester returns, parse the result file's frontmatter `result` field.

If `result` is `fail` or `partial` AND `--no-investigate` is NOT set: invoke the `investigator` agent (opus) with:

```
Result file: <path-to-test-<date>.md>
Test-case.md sibling: <path-to-test-case.md>
```

The investigator reads the failing log + the original notebook, traces evidence into the codebase, and appends a `## Root Cause Analysis` section to the same result file. The investigator NEVER modifies application code or the test-case.md.

### 6. Print running summary

After each test:

```
[do-test-flow] <test-id>: <result> (<duration>s)
  result file: <path>
  steps: <pass>/<total>, awareness flags: <count>
  [investigation: <category> (<confidence>)]   # only when investigator ran
```

If a test fails and `--continue-on-fail` is not set, stop the batch and print the next-action hint. Investigator already ran (unless `--no-investigate`), so the result file already has RCA appended.

### 7. Final output

```
## Batch complete

Total: <N>   Pass: <p>   Fail: <f>   Partial: <r>   Skip: <s>
Investigations appended: <i>

### Result files
- {path1}  (result: pass, awareness flags: 0)
- {path2}  (result: fail, RCA: code-regression, confidence: high)

### Next steps
- Open failure result files for `## Steps Executed`, `## Environment Observations`, `## Evidence`, `## Root Cause Analysis`, `## Next Actions`.
- Aggregate with:
  ```
  /dev-workflow:summary <path>
  ```
```

## Notes

- **The tester executes ONE Action per Bash call.** It does NOT run bundled blocks. If the notebook bundles, the tester splits + records under `## Deviations`.
- **Every Step must produce an Awareness observation in the result.** Even "nothing unusual observed" is mandatory — silence is not acceptable.
- **Never modify the source test-case.md during a run unless ambiguity demands it.** Any edit must appear under `## Deviations` in the result file.
- **Real timestamps from `date -u`** — never fabricate `run_time_utc`.
- **Truncate output excerpts to ≤500 chars** to keep result files reviewable.
- **Failures are first-class.** A failing test that produces a clear `## Steps Executed` + `## Environment Observations` is more valuable than a passing test with no proof.
