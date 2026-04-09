---
name: init
description: Initialize dev-workflow in Codex. Use when the user types $dev-workflow:init, asks to create the .dev workspace, bootstrap project.md/specs/changes/archive, or set up dev-workflow for the first time.
---

# Init Skill

Use this skill to bootstrap the dev-workflow workspace in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:init`
- the repository does not have a `.dev/` folder yet
- the user asks to initialize or bootstrap dev-workflow

## Workflow

1. Read [../../commands/init.md](../../commands/init.md) and use it as the detailed workflow.
2. Create the minimal `.dev/` structure and detect the project stack.
3. Create or refresh `.dev/project.md` with the stack, conventions, and key commands.
4. If the user wants deeper analysis, delegate to `code-explorer` and use the result to improve `project.md`.

## Output

End with:
- whether `.dev/` was created or refreshed
- the files created or updated
- the recommended next step: `$dev-workflow:proposal`
