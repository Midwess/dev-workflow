# Analysis: support-gemini

## Summary

Manual analysis based on the current repository structure and active worktree changes.

## Similar Features

- `add-codex-plugin-support` already establishes the repository pattern of treating each runtime explicitly in docs, manifests, and maintainer guidance.
- `plugins/dev-workflow/hooks/hooks.json` defines the canonical Claude hook behaviors that Gemini support will likely need to mirror or adapt.

## Current Codebase State

- `plugins/dev-workflow/` remains the main plugin root for the established Claude Code integration.
- `plugins/dev-workflow/.gemini-plugin/` already exists in the worktree and currently contains hook prompt/script files only.
- There is no visible Gemini manifest or runtime registration file yet, so the packaging contract is incomplete.
- Root docs and maintainer guidance currently describe Claude Code and Codex, but not Gemini.
- `.dev/specs/` is still empty, so this proposal adds a delta-only spec for the new runtime support behavior.

## Affected Files

- `plugins/dev-workflow/.gemini-plugin/hooks/scout-block.js`
- `plugins/dev-workflow/.gemini-plugin/hooks/task-progress.md`
- `plugins/dev-workflow/.gemini-plugin/hooks/validate-spec.md`
- `plugins/dev-workflow/.gemini-plugin/hooks/session-summary.md`
- `plugins/dev-workflow/.gemini-plugin/hooks/post-pr-review.md`
- `plugins/dev-workflow/hooks/hooks.json`
- `plugins/dev-workflow/README.md`
- `README.md`
- `CONTRIBUTING.md`
- `CLAUDE.md`

## Architecture Notes

- The repository is already moving toward explicit runtime boundaries instead of a single package pretending to serve all environments identically.
- Gemini support likely belongs in a runtime-specific layer, but the current worktree suggests that layer may live under `plugins/dev-workflow/.gemini-plugin/` rather than a new top-level plugin root.
- Claude-only and Gemini-specific automation should remain isolated so changes for one runtime do not silently alter another runtime's behavior.

## Conventions To Follow

- Keep runtime-specific files and docs explicit; do not hide Gemini behavior inside Claude-only guidance.
- Follow the existing markdown-plus-frontmatter conventions for plugin assets where applicable.
- Preserve the dirty worktree and treat current Gemini files as user-authored work that must be reconciled carefully.
- Keep naming in kebab-case and use exact file/path references in docs.

## Risks And Dependencies

- Gemini runtime conventions may require metadata files or registration steps that are not yet represented in the repo.
- Hook parity may be partial if Gemini does not support the same event model as Claude Code.
- This proposal overlaps conceptually with `add-codex-plugin-support` in the broader `plugin-distribution` domain, so any future archive should reconcile the runtime model across proposals.

## OpenSpec Impact

- Add a delta spec under `plugin-distribution`
- Capture requirements for Gemini-specific runtime assets and runtime-aware documentation
