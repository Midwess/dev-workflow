---
id: REPLACE-ME-kebab-case
title: REPLACE ME — what aspect does this audit protect? (one sentence)
aspect: REPLACE-ME                 # security | error-handling | concurrency | perf | data-integrity | api-contract | ...
scope:
  - "REPLACE — subsystem / module / path-glob in scope (GENERAL — never pinned file:line)"
severity_focus: high               # the severity threshold that matters most for this aspect
created: REPLACE-ME-YYYY-MM-DD
author: audit-scout
status: active                     # active | retired
last_run: ""                       # set by auditor after the first run
---

## Aspect

REPLACE ME — one sentence on the aspect of the codebase this audit protects.

## Why It Matters

REPLACE ME — the risk being guarded against and why the user wants this re-checked over time.

## Scope

> **Charter discipline**: general references only — subsystems, modules, directory roles, call-site families. NEVER pin `file:line`; the auditor finds concrete locations fresh each run.

- REPLACE — area of the codebase relevant to this aspect
- REPLACE — another relevant area / pattern

## Focus Areas

Each item: **what to look at** + **what healthy looks like**.

- REPLACE — inspect `<thing>`; healthy means `<property>`
- REPLACE — inspect `<thing>`; healthy means `<property>`

## Invariants

Checkable properties that MUST hold. The auditor reports `holds` | `violated` per invariant each run.

1. REPLACE — e.g. "No `logger.*` call ever receives a raw token, password, or secret value."
2. REPLACE — another invariant.

## Risk Patterns

Anti-patterns to actively hunt for. Each: pattern → why dangerous → where it tends to appear.

- REPLACE — `<grep-able shape>` → `<why it's a risk>` → `<where it shows up>`

## Audit Checklist

General questions the auditor answers in prose each run (survive refactors).

- [ ] REPLACE — e.g. "Are error paths covered, not just the happy path?"
- [ ] REPLACE — another question.

## Out of Scope

What NOT to flag (keeps the verdict signal high).

- REPLACE — pre-existing accepted risk / other aspect owned by a different audit / style nit
