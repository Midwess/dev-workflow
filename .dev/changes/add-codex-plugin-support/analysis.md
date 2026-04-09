# Analysis: add-codex-plugin-support

## Summary

Manual analysis based on the current repository structure and active worktree changes.

## Current Codebase State

- `plugins/dev-workflow/` is the established Claude Code plugin root with commands, agents, hooks, skills, and a `.claude-plugin/plugin.json` manifest.
- `.claude-plugin/marketplace.json` already registers `dev-workflow` for Claude Code from `./plugins/dev-workflow`.
- The active worktree introduces `.agents/plugins/marketplace.json`, which registers a local Codex plugin rooted at `./plugins/dev-workflow-codex`.
- `plugins/dev-workflow-codex/` already exists as a parallel package with Codex-specific commands, agents, skills, README, and `.codex-plugin/plugin.json`.
- Root documentation is being revised from a single-plugin/single-runtime framing to a dual-runtime plugin suite model.
- `.dev/specs/` is currently empty, so this proposal adds initial requirements as a delta-only spec for the new distribution behavior.

## Reusable Patterns

- The Claude plugin root is the strongest reference implementation for naming, workflow coverage, and file organization.
- Marketplace configuration is already runtime-specific on the Claude side, so Codex should follow the same separation instead of sharing one manifest.
- Existing docs prefer explicit path references for manifests, commands, and plugin directories; the same style should be used for runtime-specific guidance.
- Hook automation is isolated under `plugins/dev-workflow/hooks/`, which reinforces that Claude-only behavior should remain clearly scoped.

## Relevant Files

- `.agents/plugins/marketplace.json`
- `.claude-plugin/marketplace.json`
- `plugins/dev-workflow/.claude-plugin/plugin.json`
- `plugins/dev-workflow/README.md`
- `plugins/dev-workflow-codex/.codex-plugin/plugin.json`
- `plugins/dev-workflow-codex/README.md`
- `README.md`
- `CONTRIBUTING.md`
- `CLAUDE.md`

## Constraints And Conventions

- Keep the plugin name `dev-workflow` stable across runtimes so the workflow identity stays consistent.
- Use separate runtime roots instead of conditional behavior inside a single plugin package.
- Preserve the current dirty worktree; proposal generation should describe the change without rewriting in-progress product files.
- Treat Claude Code and Codex manifests as separate release surfaces with their own metadata updates.

## OpenSpec Impact

- Introduce a new delta spec domain: `plugin-distribution`
- Capture requirements for separate runtime plugin roots, separate marketplace manifests, and runtime-aware documentation
