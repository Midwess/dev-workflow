---
name: archive
description: Archive a completed dev-workflow change in Codex. Use when the user types $dev-workflow:archive, asks to merge delta specs into .dev/specs, finalize a change, or move it into .dev/archive.
---

# Archive Skill

Use this skill to finalize a completed dev-workflow change in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:archive`
- the user wants to merge a completed change into the main specs
- the user wants a dry run of the archive operation
- the user wants to force archive despite incomplete tasks

## Workflow

1. Read [../../commands/archive.md](../../commands/archive.md) and use it as the detailed workflow.
2. Validate the change exists and inspect task completion.
3. Validate delta specs before merging.
4. Support dry-run preview when requested.
5. Apply REMOVED, MODIFIED, then ADDED requirements to `.dev/specs/`.
6. Move the change directory into `.dev/archive/YYYY-MM-DD-<change-id>/`.

## Output

End with:
- merged domains and requirement counts
- archive location
- task completion summary
- next recommended action, usually review or PR submission
