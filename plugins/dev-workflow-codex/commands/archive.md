---
description: Archive a completed change and merge specs
argument-hint: <change-id> [--dry-run] [--force]
allowed-tools: [Read, Write, Edit, Glob, Bash]
---

Archive a completed change proposal and merge its delta specs into the source of truth.

## Input

`$ARGUMENTS` - Options:
- `<change-id>` - The change ID to archive (e.g., "add-user-auth")
- `--dry-run` - Preview merge without making changes
- `--force` - Skip task completion check

If no argument provided, list available changes in `.dev/changes/` and ask user to select one.

## Steps

### 1. Validate change exists

Check if `.dev/changes/{change-id}/` exists:
- If not, list available changes and ask user to select

### 2. Check task completion

Parse `.dev/changes/{change-id}/tasks.md`:
- Count completed vs total tasks
- If incomplete, warn user:

```
Warning: {X} of {Y} tasks are incomplete

Incomplete tasks:
- [ ] 2.3 - {description}
- [ ] 3.1 - {description}

Options:
1. Continue anyway (tasks will remain incomplete in archive)
2. Cancel and complete tasks first

Proceed with archive?
```

Wait for user confirmation before proceeding.

### 3. Validate delta specs

For each delta spec in `.dev/changes/{change-id}/specs/`:

**Format validation:**
- Has valid section headers (ADDED, MODIFIED, REMOVED)
- Each requirement has `### Requirement:` header
- Each requirement has at least one scenario
- Scenarios have WHEN and THEN clauses
- REMOVED requirements have reasons

**Conflict detection:**
- ADDED requirements don't duplicate existing spec names
- MODIFIED requirements reference existing requirements
- REMOVED requirements exist in main specs

If validation fails:
```
Spec validation failed:

Errors:
- {domain}/spec.md: ADDED requirement "User Login" already exists in main spec
- {domain}/spec.md: Scenario missing THEN clause at line 45

Fix these issues before archiving.
```

### 4. Dry-run Mode (if --dry-run)

If `--dry-run` flag is provided, show preview without making changes:

```
## Archive Preview (Dry Run)

### Change: {change-id}

### Task Status
{X}/{Y} tasks complete
{If incomplete: "Would warn about incomplete tasks"}

### Spec Validation
{Validation results}

### Merge Preview

#### .dev/specs/auth/spec.md
**ADDED:**
- Requirement: Two-Factor Authentication
- Requirement: OAuth Support

**MODIFIED:**
- Requirement: User Login (updated scenarios)

**REMOVED:**
- Requirement: Basic Auth

#### .dev/specs/api/spec.md
**ADDED:**
- Requirement: Rate Limiting v2

### Archive Location (would be)
.dev/archive/{YYYY-MM-DD}-{change-id}/

---
This is a dry run. No changes were made.
Run without --dry-run to execute.
```

Stop here if dry-run mode.

### 5. Merge deltas into main specs

For each delta spec file, apply changes to `.dev/specs/{domain}/spec.md`:

**Order of operations:**
1. Process REMOVED first (delete from main spec)
2. Process MODIFIED second (replace in main spec)
3. Process ADDED last (append to main spec)

**REMOVED Requirements:**
- Find `### Requirement: {name}` in main spec
- Find the end of that requirement (next `###` or end of file)
- Delete the entire block
- Add to "Removed Requirements" section at bottom:
  ```markdown
  ### Requirement: {Name}
  Removed: {today's date}
  Reason: {reason from delta}
  Original Change: {change-id}
  ```

**MODIFIED Requirements:**
- Find `### Requirement: {name}` in main spec
- Replace entire block with new content from delta
- If not found, treat as ADDED (with warning)

**ADDED Requirements:**
- Append to end of Requirements section (before Removed Requirements section)
- If domain spec doesn't exist, create it with proper structure

**If main spec doesn't exist:**
Create `.dev/specs/{domain}/spec.md`:
```markdown
# {Domain} Specification

## Purpose

{Infer from requirements or use placeholder}

## Requirements

{ADDED requirements go here}

---

## Removed Requirements

{Empty section for future use}
```

### 5. Create archive entry

Generate date prefix and move change:

```bash
# Get today's date
DATE=$(date +%Y-%m-%d)

# Create archive directory if needed
mkdir -p .dev/archive

# Move change to archive
mv .dev/changes/{change-id} .dev/archive/${DATE}-{change-id}
```

### 6. Output summary

```
## Change Archived: {change-id}

### Specs Merged

| Domain | Added | Modified | Removed |
|--------|-------|----------|---------|
| auth   | 2     | 1        | 0       |
| api    | 1     | 0        | 1       |

### Archive Location
.dev/archive/{YYYY-MM-DD}-{change-id}/

### Task Summary
Completed: {X}/{Y}
{Skipped: Z (if any)}

### Files Updated
- .dev/specs/auth/spec.md
- .dev/specs/api/spec.md

### Next Steps
- Specs are now the source of truth
- Run /dev-workflow:code-review for final review
- Run /dev-workflow:pr-submit to create a pull request
```

## Merge Algorithm Details

### Finding Requirement Blocks

A requirement block starts with `### Requirement: {name}` and ends at:
- The next `### Requirement:` line
- The next `## ` section header
- The `---` separator before Removed Requirements
- End of file

### Handling Edge Cases

**Requirement not found for MODIFIED:**
- Log warning: "Requirement '{name}' not found, treating as ADDED"
- Append as if it were ADDED

**Requirement not found for REMOVED:**
- Log warning: "Requirement '{name}' not found, skipping removal"
- Continue with other operations

**Domain spec doesn't exist:**
- Create new spec file
- All ADDED requirements go into new file
- MODIFIED/REMOVED will warn (no existing spec to modify)

**Empty delta sections:**
- Skip empty sections (e.g., if no REMOVED requirements)
- Only process sections that have content

## Notes

- Use `--dry-run` to preview changes before committing
- Archive can be undone with `/dev-workflow:undo-archive`
- Always verify specs look correct after archiving
- The archive preserves the full change for future reference
- Consider git committing after archive for clean history
