---
name: proposal-wizard
description: Create a proposal through a guided flow in Codex. Use when the user types $dev-workflow:proposal-wizard, wants interactive proposal creation, or needs help shaping scope, motivation, domains, files, and task structure before writing a proposal.
---

# Proposal Wizard Skill

Use this skill to guide proposal creation step by step in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:proposal-wizard`
- the user wants guided proposal creation instead of a one-line proposal request
- the user needs help clarifying title, scope, domains, and requirements

## Workflow

1. Read [../../commands/proposal-wizard.md](../../commands/proposal-wizard.md) and use it as the detailed workflow.
2. Ask one concise question at a time to gather the proposal inputs.
3. Delegate to `code-explorer` and `code-architect` when the context is clear enough.
4. Generate the same proposal artifacts as `$dev-workflow:proposal`.

## Output

End with:
- the generated change id
- files created or updated
- any assumptions made during the wizard
