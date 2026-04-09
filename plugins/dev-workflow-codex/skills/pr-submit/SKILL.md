---
name: pr-submit
description: Create a pull request from a dev-workflow change in Codex. Use when the user types $dev-workflow:pr-submit, asks to run review then open a PR, or wants a generated PR title and body from the current branch and proposal context.
---

# PR Submit Skill

Use this skill to run the PR submission workflow in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:pr-submit`
- the user wants a PR created from the current branch
- the user wants code review run before PR creation
- the user wants a generated PR title and description

## Workflow

1. Read [../../commands/pr-submit.md](../../commands/pr-submit.md) and use it as the detailed workflow.
2. Validate branch state and working tree status.
3. Determine the base branch.
4. Run `$dev-workflow:code-review` logic unless the user explicitly skips it.
5. Generate the PR title and body from commit history, diff, and linked proposal context.
6. Push the branch if needed and create the PR with `gh pr create`.

## Output

End with:
- branch and base branch
- PR number and URL
- whether code review was run
- any follow-up actions
