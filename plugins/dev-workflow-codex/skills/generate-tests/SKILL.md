---
name: generate-tests
description: Generate tests from dev-workflow specs in Codex. Use when the user types $dev-workflow:generate-tests, asks to create test stubs from a change proposal or spec domain, or wants scenarios turned into test cases.
---

# Generate Tests Skill

Use this skill to generate test stubs from dev-workflow specs in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:generate-tests`
- the user wants tests generated from a change proposal
- the user wants scenarios from a spec domain turned into tests

## Workflow

1. Read [../../commands/generate-tests.md](../../commands/generate-tests.md) and use it as the detailed workflow.
2. Read the target proposal or spec domain.
3. Convert scenarios into concrete test cases.
4. Create or preview test files depending on the user request.

## Output

End with:
- the source proposal or domain
- files created or previewed
- any gaps where the spec was too vague to generate strong tests
