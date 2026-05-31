---
audit_id: REPLACE-ME
run_date: REPLACE-ME-YYYY-MM-DD
run_time_utc: "REPLACE-ME"
auditor: auditor
commit: "REPLACE-ME"               # HEAD sha at audit time
verdict: pass                      # pass | concerns | fail
findings_count: 0
highest_severity: none             # none | low | medium | high | critical
---

## Summary

REPLACE ME — one paragraph: what aspect was audited, headline verdict.

## Verdict

pass | concerns | fail — REPLACE one-line reasoning. (concerns = no hard violation, but risk worth raising.)

## Findings

For each finding (omit this block and write "No findings — all invariants hold." if clean):

### Finding 1: REPLACE-ME-short-name

- **Severity**: critical | high | medium | low
- **File**: `REPLACE-path:line` (derived THIS run)
- **Finding**: REPLACE — what's wrong
- **Evidence** (≤500 chars):
  ```
  REPLACE — code excerpt proving it
  ```
- **Recommendation**: REPLACE — what to change (do NOT write the patch)
- **Confidence**: REPLACE 0-100

## Invariant Checks

| # | Invariant (from case.md) | Result | Evidence pointer |
|---|--------------------------|--------|------------------|
| 1 | REPLACE | holds / violated | `path:line` or "n/a" |

## Coverage

Which files/areas were actually inspected this run (lets the next run spot drift).

- REPLACE — file / directory inspected

## Diff Since Last Run

REPLACE — if a prior result exists: what changed in scoped areas since then, and whether any prior finding regressed or was resolved. Else "first run — no prior result".

## Recommendations

Prioritized and actionable. Route fixes through `/dev-workflow:proposal`.

1. REPLACE

## Next Actions

- [ ] REPLACE ME — follow-up
