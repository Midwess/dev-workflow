---
description: List active and archived changes
argument-hint: [--all] [--archived]
allowed-tools: Read, Glob, Bash(ls:*), Bash(find:*)
---

List all change proposals in the dev-workflow system.

## Input

`$ARGUMENTS` - Optional flags:
- `--all` - Show both active and archived changes
- `--archived` - Show only archived changes
- (default) - Show only active changes

## Steps

### 1. Validate `.dev/` exists

Check if `.dev/` folder exists:
- If not: "Run `/dev-workflow:init` first to initialize."

### 2. List Active Changes

Scan `.dev/changes/` for active proposals:

```bash
ls -1 .dev/changes/ 2>/dev/null | grep -v '^archive$'
```

For each change, read summary info:
- Read `proposal.md` for title
- Read `tasks.md` for progress
- Check `specs/` for affected domains

### 3. List Archived Changes (if --all or --archived)

Scan `.dev/archive/` for completed changes:

```bash
ls -1 .dev/archive/ 2>/dev/null
```

Extract date from folder name (YYYY-MM-DD-{id}).

### 4. Format Output

**Active Changes:**
```
## Active Changes

| ID | Title | Progress | Domains |
|----|-------|----------|---------|
| add-user-auth | Add user authentication | [3/7] | auth, api |
| fix-login-bug | Fix login validation | [0/4] | auth |

Total: 2 active changes
```

**Archived Changes:**
```
## Archived Changes

| Date | ID | Title | Tasks |
|------|-----|-------|-------|
| 2024-12-20 | setup-oauth | Setup OAuth integration | 8/8 |
| 2024-12-15 | add-logging | Add structured logging | 5/5 |

Total: 2 archived changes
```

**Empty State:**
```
## Changes

No active changes found.

Run `/dev-workflow:proposal <description>` to create one.
```

### 5. Summary

```
## Summary

- Active: {N} changes
- Archived: {M} changes

Use `/dev-workflow:show <change-id>` for details.
```

## Notes

- Progress is calculated from tasks.md checkboxes
- Domains are extracted from specs/ folder names
- Archived changes show completion date from folder prefix
