---
name: import-issue
description: Import an external issue or PRD into dev-workflow in Codex. Use when the user types $dev-workflow:import-issue, asks to import a GitHub issue or Confluence PRD, or wants source material turned into a change proposal.
---

# Import Issue Skill

Use this skill to import external planning input into dev-workflow in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:import-issue`
- the user wants to import a GitHub issue
- the user wants to import a Confluence PRD or similar document

## Workflow

1. Read [../../commands/import-issue.md](../../commands/import-issue.md) and use it as the detailed workflow.
2. Fetch the source content.
3. Convert the source into a proposal, tasks, and delta specs.
4. Delegate to `code-explorer` and `code-architect` when additional codebase planning is useful.

## Output

End with:
- the source imported
- the generated change id
- the files created
- the next recommended action, usually review or apply
