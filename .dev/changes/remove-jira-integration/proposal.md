# Proposal: Remove Jira Integration

**Status**: approved

## Summary

Remove Jira integration from the dev-workflow plugin while preserving Confluence functionality. This involves removing Jira-specific documentation, command options, and examples across all files.

## Motivation

Simplify the toolkit by removing the Jira integration, likely due to:
- Low adoption of Jira import feature
- Preference for GitHub-first workflows
- Reduced maintenance burden

The Atlassian MCP server will remain available for Confluence integration, which is still actively used.

## Scope

### In Scope

- Remove `jira <ticket-id>` option from `/dev-workflow:import-issue` command
- Remove all Jira references from documentation (READMEs, CLAUDE.md)
- Update Atlassian MCP server description to "Confluence integration"
- Bump plugin versions (dev-workflow 1.1.0, mcp-servers 1.0.1)

### Out of Scope

- Removing the Atlassian MCP server (needed for Confluence)
- Adding alternative issue tracking integrations
- Changes to GitHub or Confluence import functionality

## Affected Areas

| Area | Impact |
|------|--------|
| `plugins/dev-workflow/commands/import-issue.md` | Remove Jira sections, update arguments |
| `plugins/dev-workflow/README.md` | Remove Jira references and examples |
| `plugins/mcp-servers/.mcp.json` | Update atlassian description |
| `README.md` | Remove Jira mentions throughout |
| `CLAUDE.md` | Remove Jira references |
| `CONTRIBUTING.md` | Update mcp-servers description |
| `plugins/agentic-ai-workflow/README.md` | Update atlassian description |
| `.dev/project.md` | Update dependencies note |
| Plugin version files | Bump versions |

## Dependencies

- None - this is a removal operation

## Risks

| Risk | Mitigation |
|------|------------|
| Breaking Confluence integration | Keep atlassian MCP server intact, only update description |
| Hidden Jira references remain | Comprehensive grep search during verification |
| Users confused by missing feature | Clean removal in docs, no deprecation warnings |
