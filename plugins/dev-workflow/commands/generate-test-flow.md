---
description: Interactive wizard to create a new folder-based test case (test-case.md) as a NOTEBOOK (not a script). Delegates authoring to the senior-qa agent (opus). The senior-qa enforces one-Action-per-Step + mandatory Awareness items.
argument-hint: "[<tests-root>] [--id <test-id>] [--from-change <change-id>]"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(date:*), Bash(ls:*), Bash(mkdir:*), Task(senior-qa)
---

Create a new test folder containing `test-case.md` following the `test-flow` skill format. The main flow loads the skill, resolves the tests root, then delegates authoring to the `senior-qa` agent.

Use the `test-flow` skill (`plugins/dev-workflow/skills/test-flow/SKILL.md`) as the format authority. Its Core Philosophy ("Manual, Not Scripted") is the governing rule — the resulting test-case.md is a notebook of single-action Steps with Awareness callouts, not a runnable script.

## Input

`$ARGUMENTS` - Options (all optional, can also be discovered interactively):
- `<tests-root>` - Directory under which the new test folder will be created (default: `.dev/test-flow/`)
- `--id <test-id>` - Override auto-generated kebab-case id
- `--from-change <change-id>` - Seed the test-case from a `.dev/changes/<change-id>/` proposal: read its `proposal.md` + delta `specs/*/spec.md` and pre-fill Objective / Steps / Expected Behavior from the WHEN/THEN scenarios
- `--tier <live|deterministic|smoke|regression>` - Skip the tier interview
- `--component <name>` - Skip the component interview
- `--non-interactive` - Use defaults; do not prompt

## Steps

### 1. Load the test-flow skill

Read `plugins/dev-workflow/skills/test-flow/SKILL.md`. Internalize the Core Philosophy. The notebook discipline is the governing rule for everything authored under this command.

### 2. Resolve tests root

- If `<tests-root>` provided in args, use it.
- Else default to `.dev/test-flow/`.
- If the dir doesn't exist, create it (`mkdir -p`) and write a stub `README.md` listing the folder's purpose.

### 3. Delegate to `senior-qa` agent

Invoke the `senior-qa` agent with:

```
Tests root: {tests-root}
Optional flags: {flags}
User invocation: {raw $ARGUMENTS}
Discipline: notebook format — one Action per Step, mandatory Awareness, behavioral expectations.
```

The senior-qa owns the interview, the seeding from change proposals (when `--from-change` is set), and the actual `test-case.md` write. The main flow's job is to validate args, ensure the folder exists, and present senior-qa's final output to the user.

Skip steps 4-7 below in delegation mode — senior-qa handles them. The manual fallback below is for when senior-qa is unavailable.

### 3a. Manual fallback (if senior-qa unavailable)

Ask the questions below, ONE AT A TIME. For each, propose your best-guess answer first. Skip questions already answered via flags.

1. **Test id?** (kebab-case, terse). If `--from-change` set, propose `<change-id>-smoke`.
2. **One-sentence title** — what behavior is verified?
3. **Tier** — live | deterministic | smoke | regression. Recommend `live` for systems running with side effects.
4. **Component** — short tag (e.g. `orchestrator`, `auth`, `payments`).
5. **Target** — which service/binary is under test.
6. **Preconditions** — bullets, each a SINGLE-PROBE check (one command or one file probe). Push back on compound checks.
7. **Inputs** — concrete values, payloads, prompts the test will use.
8. **Steps** — each Step is ONE action. Required shape per Step:
   - **Action**: ONE command, ONE prompt, ONE file read — no `&&`, no `;`, no multi-line bash
   - **Observe**: primary observation + direction of effect
   - **Awareness**: what to check besides the primary observation (mandatory; never blank)
   - **On weirdness**: abort | retry once | note-and-continue
9. **Expected Behavior** — prose bullets describing what a healthy run looks like. Direction-of-effects, on-disk shape, meaning of replies. The tester JUDGES against these. Reserve exact-match for SYSTEM-composed artifacts (path shapes, JSON schema fields, registered tool names) — NOT for LLM output content.
10. **Fail modes** — known failure patterns and diagnostic hints.

Stop once every section has a concrete answer. Don't over-grill.

### 4. Pre-fill from `--from-change` (if set)

When `--from-change <change-id>` is provided:

1. Read `.dev/changes/<change-id>/proposal.md` and `.dev/changes/<change-id>/specs/**/spec.md`.
2. Extract WHEN/THEN scenarios from the delta specs.
3. Seed:
   - **Objective** from the first ADDED requirement's name
   - **Steps** from WHEN clauses — one Step per WHEN, never bundle
   - **Expected Behavior** from THEN clauses (rephrase rigid contract terms into behavioral prose where the THEN concerns LLM output; keep exact strings only for system-composed artifacts)
   - **Tags** from the change id keywords
4. Show the seeded draft to the user and let them edit before saving.

### 5. Generate the folder

```bash
mkdir -p {tests-root}/{test-id}
```

### 6. Write `test-case.md`

Use `plugins/dev-workflow/skills/test-flow/templates/test-case.md` as the scaffold. Fill every `REPLACE` placeholder. The frontmatter MUST contain every field the skill specifies.

Body sections (verbatim headers): Objective, Preconditions, Inputs, Steps, Expected Behavior, Fail Modes, Cleanup.

Each Step MUST be a notebook entry per the template:

```markdown
### Step N: <name>

**Action**: <ONE command>

**Observe**:
- <primary>
- <direction of effect>

**Awareness**:
- <one or more items>

**On weirdness**: <abort | retry once | note-and-continue>
```

### 7. Update tests-root index (optional)

If `{tests-root}/README.md` exists, append a row to its test inventory table:

```markdown
| <test-id> | <title> | <tier> | <component> | <created> |
```

Create the table on first test if README has no table yet.

### 8. Output

Print to user:

```
## Test case created

**Location**: {tests-root}/{test-id}/test-case.md

### Frontmatter
{paste the YAML block}

### Steps (one Action each)
1. <name> — <Action one-liner>
2. <name> — <Action one-liner>
...

### Next steps
- Edit the file if any Step bundles actions or lacks an Awareness item.
- Run the test with:
  ```
  /dev-workflow:do-test-flow {tests-root}/{test-id}/
  ```
- Or batch-run all tests under {tests-root}:
  ```
  /dev-workflow:do-test-flow {tests-root}/
  ```
```

## Notes

- **Never write a Step whose Action contains `&&`, `||`, `;`, multi-line heredocs, or embedded loops.** Split. Polling is a Step the tester runs N times.
- **Every Step needs an `Awareness:` item.** If you can't think of one, ask: what would a paranoid QA engineer double-check? That's the Awareness item.
- **NEVER write a test-case.md without complete frontmatter** — the runner depends on every field.
- **Behavioral expectations, not brittle assertions.** Reserve exact-match for system-composed artifacts only.
- **If `--from-change` references a non-existent change**, fail with a clear error before creating any folder.
- **One folder, one test.** Split "test all the things" into separate folders.
