---
name: test-flow
description: Manual-style, AI-controlled test workflow. Use when generating, executing, or summarizing folder-based test cases written in markdown. The test-case.md is a notebook of intent + awareness items, NOT a runnable script. The tester agent executes ONE action at a time, observes the environment between actions, and judges whether the system is behaving correctly — like a human QA engineer doing exploratory testing.
---

# Test Flow Skill

Folder-based, markdown-driven test workflow for systems whose behavior is partly LLM-driven and partly stateful — orchestrators, agent runtimes, sandbox provisioners, end-to-end flows where a unit-test framework can't capture the full behavior.

## Core Philosophy — Manual, Not Scripted

**The test-case.md is a notebook, not a script.** It describes intent, single-action steps, and awareness items. It is NOT a sequence of bash blocks to be executed top-to-bottom.

**The tester agent is a human-substitute QA engineer.** It:
1. Reads the notebook
2. Performs ONE action at a time
3. Observes what happened — stdout, file state, side effects
4. Checks the environment for unexpected weirdness (warnings, unrelated errors, drift)
5. Judges whether the step's intent was satisfied
6. Decides whether to continue, retry, or abort
7. Records each observation in the result file

**No multi-step bash blocks.** A step like `cd X && command1 && command2 | jq '.foo'` is BANNED. Split into separate actions: "Run command1; observe output; then run command2; observe output." This forces the agent to look at the intermediate state.

**Awareness is mandatory.** Every test must call out what to watch for *besides* the step's primary observation — log lines that suggest drift, files that shouldn't exist, processes that shouldn't be running, env vars that may have changed. The agent reports on these proactively.

## When to Use

- Generating a new test case for a behavior whose verification needs exploratory observation
- Executing a test folder against a live system one step at a time
- Summarizing observations across many test runs for a release-readiness report
- Replaying a previously-failed test against a new build, with fresh eyes

## Folder Layout

```
{tests_root}/
├── README.md                       # optional index of tests
├── {test-id-1}/
│   ├── test-case.md                # the notebook (one per folder)
│   ├── test-2026-05-15.md          # observation log from run on this date
│   └── test-2026-05-16.md          # another run; latest wins for summary
├── {test-id-2}/
│   ├── test-case.md
│   └── test-2026-05-15.md
└── ...
```

`{tests_root}` defaults to `.dev/test-flow/` but commands accept any path.

`{test-id}` is kebab-case, terse, unique within the folder.

## Metadata Frontmatter

### test-case.md frontmatter

```yaml
---
id: manager-creates-team
title: Manager creates team and Leader bootstraps under it
tier: live                       # live | deterministic | smoke | regression
component: orchestrator
target: builder
prerequisites:
  - "<each item must be checkable by a single command or file probe>"
expected_duration_secs: 60
tags: [manager, team-creation]
priority: high                   # high | medium | low
created: 2026-05-15
author: senior-qa
---
```

### test-<date>.md frontmatter

```yaml
---
test_id: manager-creates-team
run_date: 2026-05-15
run_time_utc: "16:38:12Z"
runner: agent-name-or-human
sandbox_or_env: "<URL or env tag>"
duration_secs: 26.6
result: pass                      # pass | fail | partial | skip
exit_reason: ""                   # one-line if non-pass
related_commit: "abc123def"
---
```

## test-case.md Body Structure (Notebook Format)

Section headers are mandatory and verbatim — the tester parses by header.

### `## Objective`
One sentence. What behavior does this test verify?

### `## Preconditions`
Bullet list. Each item MUST be checkable by a SINGLE command or file probe — no compound checks.

Good:
- `chat-cli --version` returns a version string
- `${WORKSPACE_BASE}/.memory/` exists

Bad:
- ~~"system is ready"~~ (un-checkable)
- ~~"create workspace, wait for ready, pin config"~~ (compound — split into 3 preconditions)

### `## Inputs`
Concrete values, payloads, prompts the test will use. Code blocks are fine HERE for data (not for execution).

### `## Steps`

Each step describes a SINGLE action plus what to observe.

**Mandatory shape per step:**

```markdown
### Step N: <short name>

**Action**: <ONE command, ONE prompt, ONE file read — never two>

**Observe**:
- <primary observation — what to check in the immediate output>
- <secondary observation — direction of effect, state shape>

**Awareness**:
- <thing to watch for that ISN'T the primary observation>
- <e.g., unexpected warning in log, file appearing where it shouldn't, env var drift>

**On weirdness**: <what to do if something looks off — abort, retry, note-and-continue>
```

**Forbidden in `Action`:**
- `&&`, `||`, `;` chaining
- Heredocs spanning multiple commands
- For-loops or while-loops in the Action body (loops in tooling like polling MUST be a separate, named Step that's a single command at a time)
- `set -e` + multi-line scripts
- Anything that hides intermediate state from the agent's observation

**Forbidden in test-case.md as a whole:**
- A "setup" step that runs 5 commands in one bash block. Split into 5 named Steps.
- Polling loops embedded inside one Action. Make polling its own Step that the agent runs N times, observing between each iteration.

If the system genuinely needs N preparatory commands, write N preparatory Steps. Don't bundle.

### `## Expected Behavior`

Prose bullets describing what a human reviewer would expect to see if the system is healthy. The tester JUDGES against these — not a regex matcher.

Good shape:
- "Manager should reply with the leader's status, paraphrased — not fabricated"
- "On-disk team folder should look like a healthy team: TEAM.md, per-agent dirs, plan.json — exact filenames inside may vary"
- "No unexpected `error` lines should appear in the recorder JSONL for either Worker or Leader during this flow"

Bad shape (reserve for SYSTEM-composed artifacts only):
- ~~`grep -c "exact phrase" file == 3`~~ (LLM wording varies)
- ~~"stream contains `tool-input-available` AT TURN 2"~~ (ordering varies)

### `## Fail Modes`
Known failure patterns and how to diagnose each. Each entry: pattern → suspected cause → next check.

### `## Cleanup`
Optional. Single-action steps to undo state. Same constraints as `## Steps`.

## test-<date>.md Body Structure (Observation Log)

```markdown
## Summary
One paragraph: what was run, what was observed, headline judgment.

## Steps Executed

For each Step from the notebook, in run order:

### Step N: <name>

**Action run**: <verbatim command>
**Output excerpt** (≤500 chars):
```
<actual output>
```
**Primary observation**: <what was seen vs what was expected>
**Awareness check**: <what else was observed — environment state, drift, unexpected files/logs>
**Judgment**: pass | fail | partial — with one-line reasoning

## Environment Observations

Things noticed across the whole run that didn't belong to one step:
- <unexpected log line>
- <file appearing late>
- <warning that may matter>

## Evidence

File paths, log excerpts, response bodies that prove (or disprove) the outcome.

## Deviations

Anything that diverged from test-case.md. If significant, propose a notebook update under Next Actions.

## Next Actions

- [ ] Bug to file (if fail)
- [ ] Notebook update needed (if ambiguity discovered)
- [ ] Re-run when (if intermittent)
```

## Authoring Rules

- **One folder, one test.** Split multiple behaviors into separate folders.
- **One action, one step.** Never bundle commands. The agent must observe each action's output before the next.
- **Awareness sections are non-negotiable.** Every Step needs at least one Awareness item. If you can't think of one, ask: what would a human QA engineer with a slightly paranoid mindset double-check after this action? That's the Awareness item.
- **Behavioral expectations, not brittle assertions.** Reserve exact-match for SYSTEM-composed artifacts (path shapes, JSON schema field names, registered tool names) — never for LLM output.
- **Evidence required.** A pass result must include the artifacts (file paths, log excerpts, response bodies) so a reviewer can re-judge without re-running.
- **Never delete a test-<date>.md.** Failed runs are first-class history.

## Companion Commands

| Command | Purpose | Driving Agent |
|---------|---------|---------------|
| `/dev-workflow:generate-test-flow` | Interactive wizard to create a new test folder + test-case.md | `senior-qa` (opus) |
| `/dev-workflow:do-test-flow <path>` | Execute test cases under a path, one step at a time, with environment awareness | `tester` (sonnet) + on-failure `investigator` (opus) |
| `/dev-workflow:summary <path>` | Aggregate latest result per test under a path into a release-readiness summary | read-only main flow |

## Agent Roles

| Agent | Model | Owns | Constraint |
|-------|-------|------|-----------|
| `senior-qa` | opus | Writes `test-case.md` as a notebook. Interviews user, refuses to accept multi-action steps, demands Awareness items. | No code edits. Never writes result files. |
| `tester` | sonnet | Reads `test-case.md`, executes one Action at a time, observes between actions, judges per step, records observations in `test-<date>.md`. MAY edit `test-case.md` to fix ambiguity discovered during run — must record under `## Deviations`. | No code edits. Never overwrites a previous result. Never bundles actions to "save time". |
| `investigator` | opus | On `fail`/`partial`, traces evidence into the codebase and APPENDS a `## Root Cause Analysis` section to the same result file. | No code edits. No test-case.md edits. Appends only — never rewrites tester's record. |

### Collaboration flow

```
        ┌──────────────────────────────────────┐
        │   /dev-workflow:generate-test-flow   │
        └──────────────────┬───────────────────┘
                           │
                    invoke senior-qa
                           │
                           ▼
              writes test-case.md notebook
                           │
        ┌──────────────────▼───────────────────┐
        │     /dev-workflow:do-test-flow       │
        └──────────────────┬───────────────────┘
                           │
                    invoke tester
                           │
                           ▼
   step 1 action → observe → judge → step 2 action → ...
                           │
       writes test-<date>.md (frozen observation log)
                           │
                           ├─ result == pass / skip ─→ done
                           │
                           └─ result == fail / partial
                                       │
                                invoke investigator
                                       │
                                       ▼
                        appends ## Root Cause Analysis
                                       │
                                       ▼
                                     done
                           │
        ┌──────────────────▼───────────────────┐
        │       /dev-workflow:summary          │
        └──────────────────────────────────────┘
              aggregates latest result per test
```

## Templates

Ready-to-use templates live under `templates/`:

- [templates/test-case.md](templates/test-case.md) — blank notebook scaffold
- [templates/test-result.md](templates/test-result.md) — blank observation-log scaffold

Copy a template, fill the frontmatter, write the body. Agents executing tests must read both files completely before acting.

## Fresh-workspace contract (live tests)

Every `tier: live` test MUST run against a freshly-created workspace. Reuse contaminates assertions.

Each live test-case.md MUST have a `FRESH WORKSPACE REQUIRED` bullet at the top of its `prerequisites:` array. The provisioning Step (in `## Steps`, NOT in preconditions) MUST be its own named Step:

```markdown
### Step 1: Provision a fresh workspace

**Action**: `chat-cli create-workspace --update-config --prefix <test-id> --json`

**Observe**:
- Command exits 0
- stdout contains a JSON object with `status` field; verify it ends as `Ready`
- A new directory appears under `builder/data/<sandbox_id>/workspace`

**Awareness**:
- `chat-cli/.midwess-cli/config.toml` should now have a new `workspace_id`. Note the previous value in case rollback is needed.
- No prior chat-cli processes should be running (`pgrep -x chat-cli | wc -l` should be at most 1).

**On weirdness**: If `pgrep` reports >1, abort the run — concurrent chat-cli will rewrite the config mid-test.
```

Deterministic tests (`tier: deterministic`) are exempt — they run in-process against TempDir fixtures and don't have the manual-observation requirement, since their behavior is deterministic.
