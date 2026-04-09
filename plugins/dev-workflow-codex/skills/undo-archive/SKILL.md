---
name: undo-archive
description: Restore an archived dev-workflow change in Codex. Use when the user types $dev-workflow:undo-archive, asks to move an archived change back to active work, or wants to resume a previously archived proposal.
---

# Undo Archive Skill

Use this skill to restore an archived dev-workflow change in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:undo-archive`
- the user wants to resume a previously archived change
- the user wants an archived proposal moved back into `.dev/changes/`

## Workflow

1. Read [../../commands/undo-archive.md](../../commands/undo-archive.md) and use it as the detailed workflow.
2. Find the archived change entry.
3. Restore it to active status.
4. Preserve task state and proposal context where possible.

## Output

End with:
- the restored change id
- restored location
- the next recommended action, usually `$dev-workflow:apply`
