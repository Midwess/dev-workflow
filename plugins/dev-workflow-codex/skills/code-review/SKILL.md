---
name: code-review
description: Run dev-workflow code review in Codex. Use when the user types $dev-workflow:code-review, asks for automated review of the current branch or PR, wants parallel review agents, or wants findings filtered by confidence.
---

# Code Review Skill

Use this skill to run the dev-workflow review workflow in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:code-review`
- the user asks for a review of the current branch or a PR
- the user wants the multi-agent review workflow
- the user wants `--quick`, `--thorough`, `--no-comment`, or threshold-based review

## Workflow

1. Read [../../commands/code-review.md](../../commands/code-review.md) and use it as the detailed workflow.
2. Gather diff, changed files, repo context, active specs, and `.dev/project.md`.
3. Delegate review in parallel to:
   - `project-guidelines-auditor`
   - `bug-detector`
   - `history-analyzer`
   - `spec-validator` when applicable
   - `test-analyzer`, `comment-analyzer`, and `code-simplifier` for thorough reviews
4. Merge findings, score them, filter by threshold, and format results.
5. If reviewing a PR and the user did not disable comments, post the review summary to GitHub.

## Output

End with:
- findings ordered by severity or confidence
- files reviewed
- agents used
- whether a PR comment was posted
