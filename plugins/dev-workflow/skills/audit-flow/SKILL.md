---
name: audit-flow
description: Re-runnable, AI-driven code audit workflow. Use when generating or running folder-based audits written in markdown. The case.md is a DURABLE audit charter (intent + focus areas + invariants), NOT pinned to line numbers. The auditor agent re-reads the current code each run and writes a dated result-<date>.md verdict, so the same concern can be re-audited as the code evolves.
---

# Audit Flow Skill

Folder-based, markdown-driven **code audit** workflow. A user saves *what they care about* — an aspect of the project they want to keep healthy (auth, error handling, concurrency safety, a specific invariant) — and the auditor agent re-reviews the current code against that charter on demand.

## Core Philosophy — Durable Charter, Dated Verdicts

**`case.md` is a charter, not a snapshot.** It describes the aspect under audit, why it matters, which subsystems/patterns to inspect, and the invariants that must hold. It MUST stay general — referencing roles, modules, and patterns, **never** pinned `file:line` numbers, because those drift between runs.

**The auditor re-derives evidence every run.** Each `/dev-workflow:trigger-audit` run reads the *current* code, locates concrete `file:line` evidence fresh, judges against the charter, and writes a new `result-<YYYY-MM-DD>.md`. Old results are never deleted — the trail of verdicts shows whether the aspect is staying healthy over time.

**Separation of intent and observation:**
- `case.md` — WHAT to audit and what "healthy" means (written once, edited rarely)
- `result-<date>.md` — WHAT was found this run (one per run, frozen)

**Auditors never fix.** An audit reports findings and recommendations. It does not patch code. Fixes go through the normal `/dev-workflow:proposal` → `/dev-workflow:apply` flow.

## When to Use

- Capturing a recurring concern ("make sure we never log secrets", "all DB writes stay inside a transaction") so it can be re-checked after future changes
- Re-auditing an aspect after a refactor, before a release, or on a schedule
- Producing an evidence-backed verdict (pass / concerns / fail) a human can act on

## Folder Layout

```
{audits_root}/
├── README.md                          # optional index of audits
├── {audit-title}/
│   ├── case.md                        # the durable charter (one per folder)
│   ├── result-2026-05-31.md           # verdict from run on this date
│   └── result-2026-06-15.md           # later run; latest wins for "current health"
├── {another-audit-title}/
│   ├── case.md
│   └── result-2026-05-31.md
└── ...
```

`{audits_root}` defaults to `.dev/audits/` but commands accept any path (e.g. `test/`).

`{audit-title}` is kebab-case, terse, unique within the root.

## Metadata Frontmatter

### case.md frontmatter

```yaml
---
id: no-secrets-in-logs
title: Verify no secrets, tokens, or PII reach application logs
aspect: security                  # short tag: security | error-handling | concurrency | perf | data-integrity | api-contract | ...
scope:
  - "<subsystem / module / path-glob in scope — general, not pinned lines>"
severity_focus: high              # the severity threshold that matters most for this aspect
created: 2026-05-31
author: audit-scout
status: active                    # active | retired
last_run: ""                      # date of most recent result file; "" until first run
---
```

### result-<date>.md frontmatter

```yaml
---
audit_id: no-secrets-in-logs
run_date: 2026-05-31
run_time_utc: "16:38:12Z"
auditor: auditor
commit: "abc123def"               # HEAD sha at audit time
verdict: pass                     # pass | concerns | fail
findings_count: 0
highest_severity: none            # none | low | medium | high | critical
---
```

## case.md Body Structure (Charter Format)

Section headers are mandatory and verbatim — the auditor parses by header.

### `## Aspect`
One sentence. What aspect of the codebase does this audit protect?

### `## Why It Matters`
The risk being guarded against and the user's motivation. Why is it worth re-checking?

### `## Scope`
Which areas of the codebase are relevant. **General, durable references only** — subsystems, modules, directory roles, naming patterns. Examples:

Good:
- "Anything under `src/api/**` that constructs a log line"
- "All call sites of the `logger.*` family"
- "Functions that touch the `User` or `Session` models"

Bad:
- ~~`src/api/user.ts:142`~~ (line numbers drift — the auditor finds these fresh each run)

### `## Focus Areas`
Bullet list of concrete things to inspect each run. Each item: **what to look at** + **what healthy looks like**. Durable phrasing.

### `## Invariants`
Properties that MUST hold for this aspect to be healthy. These are the heart of the audit — the auditor reports per-invariant whether it `holds` or is `violated` each run. State them as checkable assertions about the code's behavior, not line references.

### `## Risk Patterns`
Anti-patterns / known failure modes the auditor should actively hunt for (grep-able shapes, dangerous idioms). Each: pattern → why it's dangerous → where it tends to appear.

### `## Audit Checklist`
General questions the auditor answers in prose each run. Survives refactors.

### `## Out of Scope`
What NOT to flag — keeps noise down (mirrors a bug-detector IGNORE list). Pre-existing accepted risks, other aspects covered by other audits, style nits.

## result-<date>.md Body Structure (Verdict)

```markdown
## Summary
One paragraph: what aspect was audited, what the headline verdict is.

## Verdict
pass | concerns | fail — one-line reasoning. (concerns = no hard violation but risk worth raising.)

## Findings
Numbered. Each finding:
- **Severity**: critical | high | medium | low
- **File**: `path:line` (derived THIS run — may differ from prior runs)
- **Finding**: what's wrong
- **Evidence**: code excerpt (≤500 chars) proving it
- **Recommendation**: what to change (do NOT write the patch)
- **Confidence**: 0-100

If none: "No findings — all invariants hold."

## Invariant Checks
Table mapping each invariant from case.md to holds | violated + one-line evidence pointer.

## Coverage
Which files/areas were actually inspected this run (so the next run can compare and spot drift).

## Diff Since Last Run
Optional. If a prior result exists, what changed in the scoped areas since then (git), and whether any prior finding regressed or was resolved.

## Recommendations
Prioritized, actionable. Route fixes through /dev-workflow:proposal.

## Next Actions
- [ ] follow-ups
```

## Authoring Rules

- **One folder, one aspect.** Split distinct concerns into separate audit folders.
- **Charter stays general.** No pinned line numbers in `case.md`. If you're tempted to write `file:line`, write the *pattern* instead.
- **Invariants are the contract.** Every audit needs at least one checkable invariant. If you can't state one, the aspect isn't crisp enough — sharpen it with the user.
- **Evidence required in results.** Every finding cites a `file:line` + excerpt so a reviewer can re-judge without re-running.
- **Auditors recommend, never patch.** Code edits go through proposal/apply.
- **Never delete a result-<date>.md.** The verdict trail is the value — it shows the aspect staying (or not staying) healthy.

## Companion Commands

| Command | Purpose | Driving Agent |
|---------|---------|---------------|
| `/dev-workflow:audit <aspect description>` | Understand intent, scan code, write a new `case.md` charter | `audit-scout` (opus) + `audit-scanner` (sonnet) |
| `/dev-workflow:trigger-audit <path>` | Re-audit current code against a charter; write `result-<date>.md` | `auditor` (opus) |

## Agent Roles

| Agent | Model | Owns | Constraint |
|-------|-------|------|-----------|
| `audit-scout` | opus | Orchestrates charter creation: interprets the request, delegates file-scoping to `audit-scanner`, reads & validates the scoped code itself, writes `case.md` as a durable charter with invariants. | No code edits. Never writes result files. Charter stays general (no pinned lines). |
| `audit-scanner` | sonnet | Cheap file-scoping pass: sweeps the repo for an aspect and returns a ranked candidate file/pattern list. | No findings, no charter, no judgments, no writes. Scope only. |
| `auditor` | opus | Reads `case.md`, inspects the CURRENT code, judges each invariant, writes a dated `result-<date>.md` verdict with evidence. | No code edits. Never overwrites a prior result. Never edits `case.md`. Recommends fixes only. |

**Model tiering**: the cheap model (sonnet `audit-scanner`) narrows the search space; the expensive model (opus `audit-scout`) reads, validates, and judges. The scout never trusts the scanner's relevance claims without confirming them.

### Collaboration flow

```
        ┌──────────────────────────────────────┐
        │        /dev-workflow:audit           │
        └──────────────────┬───────────────────┘
                           │
                invoke audit-scout (opus)
                           │
              ┌────────────▼─────────────┐
              │ delegate scoping to      │
              │ audit-scanner (sonnet) ──┼──→ ranked candidate files
              └────────────┬─────────────┘
                           ▼
   read & validate scoped code → distill invariants → write case.md charter
                           │
        ┌──────────────────▼───────────────────┐
        │     /dev-workflow:trigger-audit      │   (run any time, repeatedly)
        └──────────────────┬───────────────────┘
                           │
                    invoke auditor (opus)
                           │
                           ▼
   read case.md → inspect CURRENT code → judge invariants → cite evidence
                           │
        writes result-<YYYY-MM-DD>.md (frozen verdict)
                           │
                           ▼
                  verdict: pass | concerns | fail
```

## Templates

Ready-to-use templates live under `templates/`:

- [templates/audit-case.md](templates/audit-case.md) — blank charter scaffold
- [templates/audit-result.md](templates/audit-result.md) — blank verdict scaffold

Copy a template, fill the frontmatter, write the body. The auditor must read `case.md` completely before inspecting code.
