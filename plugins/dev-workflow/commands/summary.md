---
description: Aggregate the latest test result per test folder under a path into a release-readiness summary
argument-hint: <path> [--since <YYYY-MM-DD>] [--group-by component|tier|result] [--output <file>]
allowed-tools: Read, Write, Glob, Grep, Bash(date:*), Bash(git:*)
---

Walk a tests root, locate every `test-case.md` + its newest `test-<date>.md`, and produce an aggregate summary. Use the `test-flow` skill (`plugins/dev-workflow/skills/test-flow/SKILL.md`) as the format authority for parsing frontmatter.

## Input

`$ARGUMENTS`:
- `<path>` — Required. Tests root or single test folder.
- `--since <YYYY-MM-DD>` — Only consider result files dated on or after this. Defaults to no filter (every result).
- `--group-by <component|tier|result>` — Subgroup the summary table. Default: `component`.
- `--output <file>` — Write the summary to this markdown file in addition to printing. Suggested name: `summary-<YYYY-MM-DD>.md` inside the tests root.
- `--include-skipped` — Include `skip` results in the headline counts (default: excluded, listed separately).

## Steps

### 1. Load the test-flow skill

Read `plugins/dev-workflow/skills/test-flow/SKILL.md`. Use its frontmatter shape and section names when parsing.

### 2. Discover tests + latest result

Walk `<path>` (depth 2). For each folder containing a `test-case.md`:
1. Parse the test-case.md frontmatter (`id`, `title`, `tier`, `component`, `priority`, `tags`).
2. List every sibling `test-*.md` file. Sort by `run_date` from the frontmatter (or by filename `test-YYYY-MM-DD.md` if frontmatter missing — warn).
3. The newest result is "the current status" of this test. Earlier results are "history".

If `--since` is set, ignore any result whose `run_date < since`. A test whose newest in-range result is missing is reported as `untested-in-range`.

### 3. Build counts

For each test, classify by its `result` field:
- `pass`
- `fail`
- `partial`
- `skip` (counted separately by default)
- `untested` (no result file at all)
- `untested-in-range` (results exist but none within `--since` window)

### 4. Write summary

#### Header

```markdown
# Test Flow Summary

**Generated**: <UTC timestamp>
**Tests root**: <path>
**Filter**: --since=<value> | --group-by=<value>
**Git head**: <git rev-parse HEAD if available>

## Headline

| Bucket | Count |
|--------|------:|
| ✅ Pass | <n> |
| ❌ Fail | <n> |
| ⚠️ Partial | <n> |
| ⏭️ Skip | <n> |
| ❓ Untested | <n> |
| **Total tests** | <n> |

Pass rate (excluding untested): <X%>
```

#### Group-by section

For the `--group-by` field, list tests bucketed:

```markdown
## By <group-by>

### <group value>
| id | title | result | last_run | duration_secs |
|----|-------|--------|----------|--------------:|
| ... |

### <next group value>
...
```

Sort each table by `result` (fail → partial → pass → skip → untested), then by `priority` (high → low).

#### Failures section

```markdown
## Failures requiring attention

### <test-id>
- **title**: <title>
- **last_run**: <YYYY-MM-DD>
- **exit_reason**: <reason from frontmatter>
- **evidence path**: <relative path to result file>
- **excerpt of Summary section**: <first 300 chars from result body>

### <next failing test>
...
```

Only include `fail` and `partial`. Empty section if all green.

#### Untested section

```markdown
## Untested tests

| id | title | tier | component | created |
```

Lists tests with NO matching result (and `untested-in-range` if `--since` used).

#### Trend (optional)

If `--since` includes ≥ 2 distinct dates of results, add a one-line trend per test:

```markdown
## Trend (within window)

| id | timeline (oldest → newest) |
|----|----------------------------|
| <id> | ✅ → ❌ → ✅ |
```

Use one emoji per dated result, capped at 8 most recent.

### 5. Output

Print the summary to the conversation.

If `--output <file>` is set, write to that file. Create parent dirs if needed.

If no `--output` is set and `<path>/summary-<YYYY-MM-DD>.md` does not exist, offer to write there.

### 6. Suggested next actions

End with a short actionable list:

```markdown
## Next actions

- Re-run failing tests:
  ```
  /dev-workflow:do-test-flow <path>/<failing-test-id>/
  ```
- Investigate first failure: open `<evidence_path>`
- Fill untested coverage: `/dev-workflow:generate-test-flow <path>`
```

## Notes

- Never modify test-case.md or test-<date>.md files. This command is read-only against test artifacts.
- A test with multiple results on the SAME date (`test-<date>.md`, `test-<date>-2.md`, ...) is treated as one test; the highest-suffixed file is the latest.
- If a result file's frontmatter is malformed, fall back to filename date and log a warning in the summary footer.
- Pass-rate excludes `skip` and `untested` from the denominator by default. Use `--include-skipped` to count skips as fails (strict mode).
- Keep the summary itself reviewable: ≤2000 lines total. Truncate long tables with "(+N more, see file)" if needed.
