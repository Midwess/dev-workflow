# Proposal: Keep Only dev-workflow Plugin

**Status**: approved

## Summary

Remove all plugins except dev-workflow, simplifying the toolkit to a single-plugin architecture focused on OpenSpec-style spec-driven development.

## Motivation

Streamline the toolkit by focusing on the dev-workflow plugin only, reducing complexity and maintenance burden.

## Scope

### In Scope

- Remove plugin directories: agentic-ai-workflow, code-master, frontend-pro, midwess, mcp-servers, rich-statusline
- Update marketplace.json to list only dev-workflow
- Update all documentation (README.md, CLAUDE.md, CONTRIBUTING.md)
- Update .dev/project.md
- Remove templates/ and commands/ directories (no longer needed)

### Out of Scope

- Changes to dev-workflow plugin itself
- Archive of removed plugins (they can be recovered from git history)

## Affected Areas

| Area | Impact |
|------|--------|
| `plugins/` | Remove 6 plugin directories |
| `.claude-plugin/marketplace.json` | Update to single plugin |
| `README.md` | Rewrite for single plugin |
| `CLAUDE.md` | Simplify for single plugin |
| `CONTRIBUTING.md` | Simplify for single plugin |
| `templates/` | Remove directory |
| `commands/` | Remove directory |

## Dependencies

- None

## Risks

| Risk | Mitigation |
|------|------------|
| Loss of functionality | Plugins recoverable from git history |
| Documentation inconsistency | Comprehensive grep search |
