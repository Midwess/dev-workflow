---
id: REPLACE-ME-kebab-case
title: REPLACE ME — what behavior does this verify?
tier: live
component: REPLACE-ME
target: REPLACE-ME
prerequisites:
  - "FRESH WORKSPACE REQUIRED — every live test MUST run against a freshly-created workspace (do NOT reuse a previously-tested one). Prior state on disk contaminates observations."
  - "REPLACE — each prereq must be checkable by a SINGLE command or file probe (not a compound check)"
expected_duration_secs: 60
tags: []
priority: medium
created: REPLACE-ME-YYYY-MM-DD
author: REPLACE-ME
---

## Objective

REPLACE ME — one sentence on what behavior this notebook verifies.

## Preconditions

- REPLACE ME — single-command-checkable
- REPLACE ME — single-file-probe-checkable

## Inputs

```text
REPLACE ME — concrete values, payloads, prompts (data only; not commands to run)
```

## Steps

> **Notebook discipline**: Each Step is ONE action. The tester runs it, observes, judges, then moves to the next. No `&&`, `;`, multi-line shells, or for-loops inside a Step's Action. Polling = a Step the tester runs N times.

### Step 1: REPLACE-ME-short-name

**Action**: `REPLACE — ONE command, ONE prompt, or ONE file read`

**Observe**:
- REPLACE — primary observation (what to look for in the immediate output)
- REPLACE — direction of effect (what should change about the system)

**Awareness**:
- REPLACE — what else to check that ISN'T the primary observation (e.g., unexpected warning, file shouldn't exist, env var drift)

**On weirdness**: REPLACE — what to do if something looks off (abort | retry once | note-and-continue)

### Step 2: REPLACE-ME-short-name

**Action**: `REPLACE`

**Observe**:
- REPLACE

**Awareness**:
- REPLACE

**On weirdness**: REPLACE

## Expected Behavior

REPLACE ME — prose bullets describing what a human reviewer would expect to see if the system is healthy. The tester JUDGES against these — not regex-matches.

- The system should DO `<behavior>` (e.g., "Manager hands off to Leader, Leader produces some scaffolding"). Exact wording / file count / ordering can vary.
- On-disk state should LOOK LIKE `<shape>` (e.g., "a numeric-id team folder under `teams/`, a TEAM.md and per-agent dirs under `.memory/teams/{id}/`"). Don't hard-code exact paths the LLM creates.
- The user-facing reply should CONVEY `<meaning>` (e.g., "paraphrase, not fabricate"). Don't grep for a phrase.

Reserve exact-match for things the SYSTEM composes: protocol-mandated paths, JSON schema field names, registered tool names.

## Fail Modes

- **REPLACE ME failure pattern** — suspected cause — next check to run

## Cleanup

REPLACE ME — single-action steps to undo state. Same constraints as Steps. Or "none required".
