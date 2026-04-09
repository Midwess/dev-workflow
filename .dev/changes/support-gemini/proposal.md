# Proposal: Support Gemini Runtime

**Status**: draft

## Summary

Add first-class Gemini support for `dev-workflow` by formalizing the existing Gemini-specific asset footprint, defining the required runtime metadata and hooks, and documenting how Gemini fits alongside Claude Code and Codex.

## Motivation

The current worktree already contains a partial Gemini-specific hook surface under `plugins/dev-workflow/.gemini-plugin/`, but the repository does not yet describe Gemini as a supported runtime or explain how those files should be completed, installed, or maintained. Without an explicit proposal, Gemini support risks becoming an undocumented side path that drifts from the established workflow.

This proposal assumes Gemini support should be delivered from the existing `plugins/dev-workflow/.gemini-plugin/` footprint unless implementation confirms Gemini requires a separate top-level package.

## Scope

### In Scope

- Define the repository packaging approach for Gemini support
- Complete the Gemini-specific metadata, hook configuration, and prompt assets needed for the supported workflow surface
- Document Gemini installation, runtime boundaries, and maintainer guidance
- Align Gemini support language with the existing Claude Code and Codex runtime model

### Out of Scope

- Replacing the existing Claude Code or Codex runtime packages
- Guaranteeing complete feature parity with every Claude Code or Codex capability on the first Gemini release
- Reworking unrelated workflow commands, agents, or specs beyond what Gemini support requires
- Publishing or releasing the Gemini package outside the repository-local workflow

## Affected Areas

| Area | Impact |
|------|--------|
| `plugins/dev-workflow/.gemini-plugin/` | Define the Gemini runtime asset layout and fill in missing metadata/configuration |
| `plugins/dev-workflow/hooks/` | Use the Claude hook surface as the baseline for Gemini parity decisions |
| `README.md` | Add Gemini support and setup guidance at the repo level |
| `plugins/dev-workflow/README.md` | Describe Gemini-specific files, usage expectations, and boundaries |
| `CONTRIBUTING.md`, `CLAUDE.md` | Document maintainer expectations for Gemini updates, testing, and versioning |
| `.dev/project.md` | Record the expanded runtime-support model if implementation is approved |

## Dependencies

- The existing Claude Code plugin structure and hook behavior as the reference implementation
- The active Codex packaging work as the precedent for runtime-specific documentation and boundaries
- Gemini runtime/plugin conventions, to be confirmed during implementation before finalizing packaging details

## Risks

| Risk | Mitigation |
|------|------------|
| Gemini packaging assumptions are wrong | Confirm the Gemini runtime contract before implementation and adjust the package shape early |
| Gemini support drifts from the core workflow semantics | Use Claude hook behavior and shared docs as the baseline for supported behavior |
| Documentation creates false expectations about parity | Call out supported Gemini surfaces and limitations explicitly |
| Dirty worktree Gemini files get overwritten accidentally | Treat the current `.gemini-plugin/` files as input to analyze, not content to replace blindly |
