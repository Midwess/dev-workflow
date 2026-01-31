---
description: Apply a change proposal by implementing its tasks
argument-hint: <change-id> [--resume] [--from <task>] [--only <task>]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, TodoWrite
---

Implement the tasks for a change proposal, tracking progress as you go.

## Input

`$ARGUMENTS` - Options:
- `<change-id>` - The change ID to apply (e.g., "add-user-auth")
- `--resume` - Continue from the last incomplete task (default behavior)
- `--from <task>` - Start from a specific task (e.g., `--from 2.3`)
- `--only <task>` - Execute only a specific task (e.g., `--only 3.1`)
- `--reset` - Reset all tasks to incomplete and start fresh

If no argument provided, check for in-progress changes first, then list available changes.

## Steps

### 0. Check Proposal Status

Before proceeding, verify the proposal has been approved.

Read `.dev/changes/{change-id}/proposal.md` and check the **Status** field:

**If `Status: approved`:**
- Proceed to Step 1

**If `Status: draft` (or missing):**
- Display the following message and STOP:

```
⚠️  Proposal not yet approved

The proposal "{change-id}" is still in draft status.
Please review and approve before implementation.

## Files to Review

1. **proposal.md** - Scope, motivation, risks
2. **analysis.md** - Codebase analysis (from code-explorer)
3. **blueprint.md** - Architecture plan (from code-architect)
4. **tasks.md** - Implementation breakdown
5. **specs/** - Delta specifications

## To Approve

Edit proposal.md and change:
  **Status**: draft
to:
  **Status**: approved

Then run:
  /dev-workflow:apply {change-id}
```

### 1. Load change context

Read and understand the full proposal:

```
.dev/changes/{change-id}/
├── proposal.md          # Understand the why and scope
├── analysis.md          # Codebase analysis (from code-explorer)
├── blueprint.md         # Architecture plan (from code-architect)
├── tasks.md             # What needs to be done
├── design.md            # Technical decisions (if exists)
└── specs/*/spec.md      # Requirements to implement
```

Use `analysis.md` for:
- Understanding existing patterns to follow
- Dependencies to be aware of
- Conventions to maintain

Use `blueprint.md` for:
- Files to create/modify
- Implementation approach
- Component interfaces

Also read:
- `.dev/project.md` for project conventions and guidelines
- Relevant `.dev/specs/` for existing requirements

### 2. Parse task list

Extract tasks from `tasks.md`:
- Count total tasks
- Identify completed (`- [x]`) vs pending (`- [ ]`)
- Calculate current progress

If all tasks are already complete:
```
All tasks for {change-id} are already complete!
Run /dev-workflow:archive {change-id} to finalize.
```

### 2b. Handle Resume Options

**Default / --resume:**
- Find the first incomplete task
- Show summary of completed tasks
- Start from that task

```
## Resuming: {change-id}

### Already Completed
- [x] 1.1 - Set up database schema
- [x] 1.2 - Create migration files
- [x] 2.1 - Implement user model

### Continuing From
Task 2.2 - Add authentication middleware

Proceed?
```

**--from <task>:**
- Start from the specified task number
- Warn if earlier tasks are incomplete

```
Starting from task {task}

Warning: Earlier tasks are incomplete:
- [ ] 2.1 - Implement user model

Continue anyway?
```

**--only <task>:**
- Execute only the specified task
- Don't mark other tasks or update overall progress
- Useful for re-doing a specific task

```
Executing only task {task}: {description}
Other tasks will not be affected.
```

**--reset:**
- Reset all tasks to incomplete
- Clear any notes from previous attempts
- Start fresh from task 1.1

```
Resetting all tasks to incomplete.
Starting fresh from task 1.1.

Are you sure? This will clear progress notes.
```

### 3. Work through tasks

For each pending task, in order:

**Before starting a task:**
- Display: `### Working on: Task {N} - {description}`

**During implementation:**
- Follow the delta specs as requirements
- Follow project conventions from `project.md`
- Follow existing code patterns in the codebase
- Write code that satisfies the WHEN/THEN scenarios

---

### ⚠️ CRITICAL: Mark Task Complete After Each Task

**After completing EACH task, you MUST update tasks.md immediately:**

1. **Use the Edit tool** to change the checkbox from `- [ ]` to `- [x]`:
   ```
   OLD: - [ ] 1.1 Install dependencies
   NEW: - [x] 1.1 Install dependencies
   ```

2. **Update the Progress header** to reflect completion:
   ```
   OLD: ## Progress: [0/22]
   NEW: ## Progress: [1/22]
   ```

3. **Display completion message:**
   ```
   ✓ Completed: Task 1.1 - Install dependencies
   ```

**DO NOT proceed to the next task until you have updated tasks.md.**

This is essential for:
- Tracking progress accurately
- Allowing users to resume from where they left off
- Providing visibility into implementation status

---

**If a task is blocked:**
- Add a note in the Notes section of `tasks.md`
- Skip to next task if possible
- Report blocker to user

### 4. Validation checks

After completing major task groups:
- Verify implementation matches delta specs
- Check `.dev/project.md` compliance
- Run tests if the project has a test command
- Note any deviations from specs in the Notes section

### 5. Progress tracking

Show running progress throughout:

```
## Applying: {change-id}

### Progress: [3/7]

### Completed
- [x] 1.1 - Set up database schema
- [x] 1.2 - Create migration files
- [x] 2.1 - Implement user model

### In Progress
- [ ] 2.2 - Add authentication middleware

### Remaining
- [ ] 2.3 - Create login endpoint
- [ ] 3.1 - Write unit tests
- [ ] 3.2 - Write integration tests
```

### 6. Final output

When all tasks are complete (or as many as possible):

```
## Change Applied: {change-id}

### Progress: [7/7] Complete

### Summary
- Files modified: {count}
- Files created: {count}
- Tests added: {count}

### Specs Implemented
- {domain}: {N} requirements

### Notes
{Any implementation decisions or deviations}

### Next Steps
1. Run tests: {test command from project.md}
2. Run /dev-workflow:code-review for automated review
3. Run /dev-workflow:archive {change-id} when ready to finalize
```

If some tasks couldn't be completed:

```
### Incomplete Tasks
- [ ] 3.2 - {description}
  Reason: {why it couldn't be completed}

### Recommendations
{Suggestions for resolving blockers}
```

## Guidelines

### Task Implementation

- Complete tasks in order (dependencies matter)
- If a task is too large, break it into subtasks
- Commit frequently with meaningful messages referencing the change-id
- Keep implementation focused on the specs - don't over-engineer

### Spec Compliance

- Each WHEN/THEN scenario should be satisfied by the implementation
- If a spec seems wrong, note it but implement as written (fix spec later)
- If you need to deviate from spec, document why in Notes section

### Code Quality

- Follow existing code patterns in the project
- Follow `.dev/project.md` guidelines
- Add appropriate error handling
- Write code that's testable

### Progress Updates (CRITICAL)

**You MUST update tasks.md after EACH completed task:**

1. Change `- [ ]` to `- [x]` for the completed task
2. Update `## Progress: [X/Y]` header with new count
3. Do this IMMEDIATELY after completing each task - NOT in batches

**Example:**
```markdown
## Progress: [3/10]   ← Update this count

## 1. Setup
- [x] 1.1 Install dependencies    ← Change [ ] to [x]
- [x] 1.2 Configure settings
- [x] 1.3 Create database schema
- [ ] 1.4 Next task...            ← Still pending
```

This is essential for resume functionality and progress visibility.
