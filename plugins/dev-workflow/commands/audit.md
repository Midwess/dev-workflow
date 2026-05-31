---
description: Create a re-runnable audit session. Records WHAT aspect of the project you want to keep healthy, then delegates to the opus audit-scout (which uses the sonnet audit-scanner to scope files) to scan related code and write a durable case.md charter under <audits-root>/<audit-title>/.
argument-hint: <aspect description> [--root <audits-root>] [--id <audit-title>]
allowed-tools: Read, Write, Glob, Grep, Bash(date:*), Bash(ls:*), Bash(mkdir:*), Task(audit-scout)
---

Create a new **audit session** — a durable, re-runnable charter capturing an aspect of the project the user wants to keep healthy. The main flow captures the request and resolves the folder; the `audit-scout` agent (opus) understands the intent, delegates file-scoping to the `audit-scanner` (sonnet), reads & validates the scoped code, and writes `case.md`.

Use the `audit-flow` skill (`plugins/dev-workflow/skills/audit-flow/SKILL.md`) as the format authority. Its "Core Philosophy — Durable Charter, Dated Verdicts" governs everything authored here: `case.md` describes *intent + invariants*, never pinned `file:line`.

## Input

`$ARGUMENTS`:
- `<aspect description>` — Required. Free-text description of what the user wants to audit (e.g. "make sure no secrets are ever written to logs", "every DB write stays inside a transaction", "auth middleware rejects expired tokens").
- `--root <audits-root>` — Directory under which the audit folder is created (default: `.dev/audits/`).
- `--id <audit-title>` — Override the auto-derived kebab-case folder name.

## Steps

### 1. Load the audit-flow skill

Read `plugins/dev-workflow/skills/audit-flow/SKILL.md`. Internalize the charter discipline — durable and general, never a code snapshot.

### 2. Capture the request

Restate the user's aspect in one sentence and confirm you understood the *concern* (what must stay true) and *why it matters*. If the description is too vague to yield a single checkable invariant, ask ONE clarifying question; otherwise proceed with your best interpretation and state the assumption in the charter.

### 3. Resolve the audit folder

- Audits root: `--root` if given, else `.dev/audits/`.
- Audit title: `--id` if given, else derive a terse kebab-case slug from the aspect.
- Target folder: `{audits-root}/{audit-title}/`.
- If the root doesn't exist, `mkdir -p` it. If `{audits-root}/{audit-title}/case.md` already exists, warn the user — this would overwrite an existing charter — and ask whether to overwrite or pick a new id.

### 4. Delegate to `audit-scout`

Invoke the `audit-scout` agent (opus) with:

```
Aspect (raw request): {raw $ARGUMENTS minus flags}
Restated aspect: {your one-sentence restatement}
Concern / why it matters: {the risk}
Audit folder: {audits-root}/{audit-title}/
Charter file to write: {audits-root}/{audit-title}/case.md
Discipline: durable charter — intent + invariants, general scope, NEVER pinned file:line. Use audit-scanner (sonnet) to scope files, then read & validate yourself before writing.
```

The audit-scout owns scanner delegation, code validation, invariant derivation, and the `case.md` write. The main flow's job is to capture the request, resolve the folder, and present the scout's output.

### 4a. Manual fallback (if audit-scout unavailable)

Do it inline: derive search terms from the aspect, Grep/Glob the repo to find the relevant subsystems and call-site families, Read enough to ground the charter, then write `case.md` from `plugins/dev-workflow/skills/audit-flow/templates/audit-case.md`. Keep scope general — no pinned line numbers. Fill every section, deriving at least one checkable invariant.

### 5. Update audits-root index (optional)

If `{audits-root}/README.md` exists, append a row to its inventory table:

```markdown
| <audit-title> | <one-line aspect> | <aspect-tag> | <created> | <last_run> |
```

Create the table on the first audit if the README has none.

### 6. Output

```
## Audit session created

**Location**: {audits-root}/{audit-title}/case.md

### Aspect
{one-sentence aspect}

### Invariants ({N})
1. {invariant}
...

### Run the audit (now, or any time after future changes)
/dev-workflow:trigger-audit {audits-root}/{audit-title}/

### Re-run all audits under the root
/dev-workflow:trigger-audit {audits-root}/
```

## Notes

- **The charter is durable.** Write what must stay true, not what the code looks like today. The auditor re-derives concrete `file:line` evidence on every run.
- **No pinned line numbers in `case.md`.** Patterns, call-site families, and roles only — line numbers drift.
- **One folder, one aspect.** Split distinct concerns into separate audit folders.
- **Every charter needs ≥ 1 checkable invariant.** If you can't state one, the aspect isn't crisp enough yet.
- **Creating a charter does not run it.** Use `/dev-workflow:trigger-audit` to produce a verdict.
