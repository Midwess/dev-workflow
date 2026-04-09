---
name: status
description: Show dev-workflow status in Codex. Use when the user types $dev-workflow:status, asks what is in progress, wants an overview of active changes/specs, or wants recommended next actions from the current .dev workspace.
---

# Status Skill

Use this skill to inspect the current dev-workflow state in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:status`
- the user asks what change is active
- the user wants a summary of `.dev/` health, specs, changes, and git state

## Workflow

1. Read [../../commands/status.md](../../commands/status.md) and use it as the detailed workflow.
2. Inspect `.dev/project.md`, `.dev/changes/`, `.dev/archive/`, `.dev/specs/`, and git status.
3. Identify active work and the next recommended action.

## Output

End with:
- current active change, if any
- progress and next task
- repo health warnings
- recommended next actions
