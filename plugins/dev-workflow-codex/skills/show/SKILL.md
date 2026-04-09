---
name: show
description: Show details for one dev-workflow change in Codex. Use when the user types $dev-workflow:show, asks to inspect a change proposal, or wants to review proposal/tasks/spec files for a specific change id.
---

# Show Skill

Use this skill to inspect a specific dev-workflow change in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:show`
- the user wants to inspect one change in detail
- the user wants proposal, task, or spec context for a specific change id

## Workflow

1. Read [../../commands/show.md](../../commands/show.md) and use it as the detailed workflow.
2. Read the change files for the selected change id.
3. Summarize proposal status, progress, affected domains, and key files.

## Output

End with:
- proposal status
- task progress
- affected domains or specs
- the next recommended skill, such as `$dev-workflow:apply`
