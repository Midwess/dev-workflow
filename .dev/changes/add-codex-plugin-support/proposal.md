# Proposal: Add Codex Plugin Support

**Status**: draft

## Summary

Add a Codex-native `dev-workflow` plugin alongside the existing Claude Code plugin. Package runtime-specific commands, agents, skills, and marketplace metadata separately so Codex support can ship without weakening the established Claude Code integration.

## Motivation

The repository currently centers `dev-workflow` around Claude Code, while the active worktree already introduces a Codex-specific plugin root and documentation updates. The project needs a first-class Codex distribution model that keeps installation paths explicit, preserves the Claude plugin, and avoids forcing runtime-specific behavior into a single package.

## Scope

### In Scope

- Add a separate `plugins/dev-workflow-codex/` package with Codex manifest, commands, agents, skills, and README
- Register the Codex plugin in `.agents/plugins/marketplace.json`
- Update root and plugin documentation to describe Claude Code and Codex installation, marketplace files, and versioning responsibilities
- Update project metadata to reflect the dual-runtime plugin suite
- Keep runtime-specific boundaries explicit, including Claude-only hook support

### Out of Scope

- Removing or renaming the existing Claude Code plugin
- Reworking Claude hook automation for Codex
- Refactoring shared command or agent content beyond what is needed to ship Codex support
- Publishing or releasing the plugin outside the local/repo marketplace workflows

## Affected Areas

| Area | Impact |
|------|--------|
| `.agents/plugins/marketplace.json` | Add Codex marketplace registration pointing at `plugins/dev-workflow-codex/` |
| `plugins/dev-workflow-codex/` | Introduce the Codex-native plugin package surface |
| `plugins/dev-workflow/.claude-plugin/plugin.json` | Update Claude plugin metadata/versioning for suite changes |
| `README.md`, `CONTRIBUTING.md`, `CLAUDE.md` | Document dual-runtime installation, maintenance, and file ownership |
| `.dev/project.md` | Record updated architecture and conventions in Latest Analysis |

## Dependencies

- Codex plugin packaging conventions using `.codex-plugin/plugin.json`
- Runtime-specific marketplace registration via `.agents/plugins/marketplace.json`
- Existing Claude plugin structure as the baseline for Codex workflow parity

## Risks

| Risk | Mitigation |
|------|------------|
| Claude and Codex plugin roots drift functionally | Keep Codex content aligned to the existing workflow surface and review command/agent parity explicitly |
| Installation guidance becomes ambiguous | Split docs by runtime and reference exact marketplace and manifest paths |
| Users assume Claude-only hooks also work in Codex | Call out hook support boundaries in docs and project metadata |
| Versioning becomes inconsistent across runtimes | Document which manifest to update for each runtime and review both manifests during release prep |
