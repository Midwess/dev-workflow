# Proposal: Change Minimax Commands and Skills to Use OpenClaude

**Status**: draft

## Summary

Rename all Minimax-branded commands and skills to use `openclaude` instead of `claude` as the CLI tool, reflecting the actual binary name used to invoke the CLI.

## Motivation

The current commands and skills reference `claude` as the CLI binary, but the actual binary name is `openclaude`. This mismatch causes failures when users follow the documented instructions without knowing to substitute the correct binary name.

## Scope

### In Scope

- Rename command files: `minimax.md` → `openclaude.md`
- Rename skill directories: `minimax/` → `openclaude/`, `minimax-codegen/` → `openclaude-codegen/`
- Update all references from `claude` to `openclaude` in command and skill markdown files
- Update README documentation in both `plugins/dev-workflow/` and `plugins/dev-workflow-codex/`
- Update any `allowed-tools` references to use `openclaude` instead of `claude`

### Out of Scope

- Changing API endpoint URLs (Minimax API remains the same)
- Modifying `MINIMAX_API_KEY` environment variable names
- Altering the functionality of any command or skill

## Affected Areas

| Area | Impact |
|------|--------|
| `plugins/dev-workflow/commands/minimax.md` | Renamed to `openclaude.md`, content updated |
| `plugins/dev-workflow/skills/minimax-codegen/SKILL.md` | Renamed directory, content updated |
| `plugins/dev-workflow/skills/video-generation/SKILL.md` | References to `claude` updated to `openclaude` |
| `plugins/dev-workflow/skills/image-generation/SKILL.md` | References to `claude` updated to `openclaude` |
| `plugins/dev-workflow/README.md` | Command table and skill references updated |
| `plugins/dev-workflow-codex/commands/minimax.md` | Renamed to `openclaude.md`, content updated |
| `plugins/dev-workflow-codex/skills/minimax-codegen/SKILL.md` | Renamed directory, content updated |
| `plugins/dev-workflow-codex/skills/minimax/SKILL.md` | Renamed directory to `openclaude/`, content updated |
| `plugins/dev-workflow-codex/skills/video-generation/SKILL.md` | References to `claude` updated to `openclaude` |
| `plugins/dev-workflow-codex/skills/image-generation/SKILL.md` | References to `claude` updated to `openclaude` |
| `plugins/dev-workflow-codex/skills/minimax/agents/openai.yaml` | Directory renamed with agent |
| `plugins/dev-workflow-codex/skills/minimax-codegen/agents/openai.yaml` | Directory renamed with agent |
| `plugins/dev-workflow-codex/README.md` | Skill references updated |
| `plugins/dev-workflow/skills/video-generation/agents/openai.yaml` | May need updating |
| `plugins/dev-workflow/skills/image-generation/agents/openai.yaml` | May need updating |

## Dependencies

- None

## Risks

| Risk | Mitigation |
|------|------------|
| Existing muscle memory for old command names | Document the rename in release notes |
| Plugin manifest references | Check `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` for any command references |
