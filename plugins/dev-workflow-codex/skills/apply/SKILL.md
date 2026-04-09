---
name: apply
description: Apply an approved dev-workflow change in Codex. Use when the user types $dev-workflow:apply, asks to implement tasks from .dev/changes/<change-id>/tasks.md, resume work, continue from a task, or execute a specific task.
---

# Apply Skill

Use this skill to implement an approved dev-workflow change proposal in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:apply`
- the user wants to continue implementing an approved change
- the user wants to resume from the next incomplete task
- the user wants to run `--from`, `--only`, or `--reset` style task control

## Workflow

1. Read [../../commands/apply.md](../../commands/apply.md) and use it as the detailed workflow.
2. Validate that the target proposal exists and is approved.
3. Read `proposal.md`, `analysis.md`, `blueprint.md`, `tasks.md`, and relevant delta specs.
4. Implement tasks in order unless the user requested a narrower scope.
5. Update `tasks.md` immediately after each completed task and keep the progress header accurate.
6. Run validation and tests when appropriate.

## Output

End with:
- the change id
- tasks completed in this run
- current progress from `tasks.md`
- blockers or next task
