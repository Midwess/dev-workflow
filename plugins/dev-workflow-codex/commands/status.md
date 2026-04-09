---
description: Show current dev-workflow state
allowed-tools: [Read, Glob, Bash]
---

Display the current state of the dev-workflow system and active work.

## Steps

### 1. Check Initialization

Verify `.dev/` exists and is properly set up:

```bash
ls -la .dev/ 2>/dev/null
```

If not initialized:
```
## Status: Not Initialized

Run `/dev-workflow:init` to set up dev-workflow.
```

### 2. Gather Status Information

**Project info:**
- Read `.dev/project.md` for project name and stack

**Changes:**
- Count active changes in `.dev/changes/`
- Count archived changes in `.dev/archive/`
- Find any in-progress changes (tasks marked in_progress)

**Specs:**
- Count spec domains in `.dev/specs/`
- Count total requirements across specs

**Git status:**
```bash
git status --porcelain
git branch --show-current
```

### 3. Detect Current Work

Check for in-progress work:
1. Find changes with partially completed tasks
2. Check for uncommitted changes related to a proposal
3. Look for branch names matching change-ids

### 4. Format Output

```
## Dev-Workflow Status

### Project
**Name:** {from project.md or folder name}
**Stack:** {detected stack}
**Branch:** {current git branch}

### Initialization
- [x] .dev/ folder exists
- [x] project.md configured
- [x] specs/ folder ready
- [x] changes/ folder ready

### Changes

| Type | Count |
|------|-------|
| Active | {N} |
| Archived | {M} |
| In Progress | {P} |

### Current Work

{If in-progress change detected:}
**Active Change:** {change-id}
**Progress:** [{completed}/{total}]
**Next Task:** {next uncompleted task}

{If no active work:}
No change currently in progress.

### Specs

| Domain | Requirements | Last Updated |
|--------|--------------|--------------|
| auth   | 5            | 2024-12-20   |
| api    | 3            | 2024-12-18   |

**Total:** {N} requirements across {M} domains

### Git Status

{If clean:}
Working tree clean.

{If changes:}
- {N} modified files
- {M} untracked files

### Quick Actions

{Based on current state:}
- `/dev-workflow:apply {change-id}` - Continue current work
- `/dev-workflow:proposal <desc>` - Start new change
- `/dev-workflow:list` - View all changes
```

### 5. Health Checks

Run quick health checks:

```
### Health

- [x] .dev/ structure valid
- [x] No orphaned changes
- [x] Specs properly formatted
- [ ] 1 change has incomplete tasks > 7 days old
```

**Warning conditions:**
- Changes with no progress in 7+ days
- Specs with validation errors
- Changes missing required files
- Uncommitted work on archived changes

### 6. Recommendations

Based on current state, suggest next actions:

```
### Recommended Actions

1. Continue work on 'add-user-auth' (3/7 tasks remaining)
2. Run code review before archiving 'fix-login-bug'
3. Consider archiving completed change 'setup-oauth'
```

## Notes

- Provides a quick overview of entire workflow state
- Identifies blockers and stale work
- Suggests next actions based on context
- Integrates with git for branch/commit context
