---
description: Restore an archived change to active status
argument-hint: <archived-change-id>
allowed-tools: [Read, Write, Edit, Glob, Bash]
---

Restore an archived change proposal back to active status and optionally revert spec merges.

## Input

`$ARGUMENTS` - The archived change ID (e.g., "2024-12-20-add-user-auth" or just "add-user-auth")

If no argument provided, list archived changes and ask user to select.

## Steps

### 1. Find the Archived Change

Search `.dev/archive/` for the change:
```bash
ls -1 .dev/archive/ | grep "{change-id}"
```

If multiple matches (e.g., same change archived multiple times):
```
Multiple archives found:
1. 2024-12-20-add-user-auth
2. 2024-12-15-add-user-auth

Which one to restore?
```

### 2. Check Current State

Before restoring, verify:
- No active change with same ID exists in `.dev/changes/`
- If exists, warn and ask to overwrite or rename

```
Warning: Active change 'add-user-auth' already exists.

Options:
1. Overwrite active change with archived version
2. Restore as 'add-user-auth-restored'
3. Cancel

Choose:
```

### 3. Determine Restoration Mode

Ask user what to restore:

```
## Restore Options

1. **Full restore** - Move back to active and revert spec changes
2. **Partial restore** - Move back to active only (keep current specs)

Choose restoration mode:
```

### 4. Move Back to Active

Move the archived folder back to changes:

```bash
mv .dev/archive/{date}-{change-id} .dev/changes/{change-id}
```

### 5. Revert Spec Changes (Full restore only)

If full restore selected, reverse the merge:

**For ADDED requirements:**
- Find requirement in main spec
- Remove it (it was added by this change)

**For MODIFIED requirements:**
- This is complex - we need the original version
- Check git history for the spec file before archive
- Or warn that manual intervention may be needed

**For REMOVED requirements:**
- Find requirement in "Removed Requirements" section
- Move it back to main Requirements section
- Remove the "Removed:" metadata

```
## Spec Reversion

### Reverted:
- auth/spec.md: Removed 2 ADDED requirements
- auth/spec.md: Restored 1 REMOVED requirement

### Manual Review Needed:
- auth/spec.md: MODIFIED requirement 'User Login' - check git history for original
  Command: git show HEAD~1:.dev/specs/auth/spec.md
```

### 6. Update Task Status

Reset task completion if desired:

```
Tasks are currently marked complete. Options:
1. Keep as complete (continue from where you left off)
2. Reset to incomplete (start fresh)

Choose:
```

### 7. Output Summary

```
## Change Restored: {change-id}

### Location
.dev/changes/{change-id}/

### Restoration Mode
{Full restore | Partial restore}

### Specs Reverted
{If full restore:}
- auth/spec.md: 3 changes reverted
- api/spec.md: 1 change reverted

{If partial:}
Specs unchanged. Current specs may not match the change proposal.

### Task Status
{X}/{Y} tasks {complete | reset to incomplete}

### Next Steps
- Review the restored change: /dev-workflow:show {change-id}
- Continue implementation: /dev-workflow:apply {change-id}
- Re-archive when ready: /dev-workflow:archive {change-id}
```

## Limitations

### MODIFIED Requirements

When a requirement was MODIFIED, we don't have the original version stored in the delta (only the new version). To fully revert:

1. Check git history: `git log -p .dev/specs/{domain}/spec.md`
2. Manually restore the original requirement text
3. Or accept the current spec and update the delta

### Multiple Archives

If the same change was archived multiple times, each archive is independent. Restoring an older archive may conflict with changes made after it was archived.

## Notes

- Full restore attempts to revert specs but may need manual review
- Partial restore is safer but leaves specs in current state
- Always verify specs after restoration
- Consider git history for complex reversions
- The archive folder is deleted after successful restore
