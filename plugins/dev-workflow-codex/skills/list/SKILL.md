---
name: list
description: List dev-workflow changes in Codex. Use when the user types $dev-workflow:list, asks to see active or archived changes, or wants a quick inventory of proposals in the .dev workspace.
---

# List Skill

Use this skill to list active and archived dev-workflow changes in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:list`
- the user wants to see active changes
- the user wants to see archived changes or all changes

## Workflow

1. Read [../../commands/list.md](../../commands/list.md) and use it as the detailed workflow.
2. Enumerate active and archived change directories.
3. Respect flags such as `--all` and `--archived` when the user includes them.

## Output

End with:
- the matching change ids
- their status or archive date
- a suggestion for the next useful skill, such as `$dev-workflow:show` or `$dev-workflow:apply`
