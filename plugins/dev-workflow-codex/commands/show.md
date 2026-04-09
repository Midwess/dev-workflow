---
description: Show details of a specific change
argument-hint: <change-id>
allowed-tools: [Read, Glob, Bash]
---

Display detailed information about a specific change proposal.

## Input

`$ARGUMENTS` - The change ID to show (e.g., "add-user-auth")

If no argument provided, list available changes and ask user to select.

## Steps

### 1. Locate the Change

Search for the change in order:
1. `.dev/changes/{change-id}/` (active)
2. `.dev/archive/*-{change-id}/` (archived)

If not found:
```
Change '{change-id}' not found.

Available changes:
- {list from /dev-workflow:list}
```

### 2. Read Change Files

Load all available files:
- `proposal.md` - Summary and scope
- `tasks.md` - Task list and progress
- `design.md` - Technical design (if exists)
- `specs/*/spec.md` - Delta specifications

### 3. Parse Information

**From proposal.md:**
- Title (from `# Proposal:` header)
- Summary section
- Scope (in/out)
- Affected areas
- Risks

**From tasks.md:**
- Total tasks count
- Completed tasks count
- Current phase
- Blockers (if any)

**From specs/:**
- Domains affected
- Requirements: added/modified/removed counts

### 4. Format Output

```
## Change: {change-id}

### Status
{Active | Archived on YYYY-MM-DD}

### Title
{Title from proposal}

### Summary
{Summary from proposal}

### Progress
[{completed}/{total}] tasks complete

**Phases:**
- [x] 1. Setup (2/2)
- [ ] 2. Implementation (1/3)
- [ ] 3. Testing (0/2)

### Specs

| Domain | Added | Modified | Removed |
|--------|-------|----------|---------|
| auth   | 2     | 1        | 0       |
| api    | 1     | 0        | 0       |

### Files

```
.dev/changes/{change-id}/
├── proposal.md
├── tasks.md
├── design.md        # if exists
└── specs/
    ├── auth/spec.md
    └── api/spec.md
```

### Quick Actions
- `/dev-workflow:apply {change-id}` - Continue implementation
- `/dev-workflow:archive {change-id}` - Archive when complete
- `/dev-workflow:code-review` - Review changes
```

### 5. Show Blockers (if any)

If tasks.md has a Blockers section with items:

```
### Blockers

- [ ] Waiting for API credentials - @devops
- [ ] Need design review - @designer
```

### 6. Show Recent Activity (if git available)

```bash
git log --oneline -5 --grep="{change-id}"
```

```
### Recent Commits
- abc1234 feat(auth): add login endpoint
- def5678 feat(auth): create user model
```

## Notes

- Works for both active and archived changes
- Archived changes are read-only (show archival date)
- Provides quick actions for active changes
- Links commits that reference the change-id
