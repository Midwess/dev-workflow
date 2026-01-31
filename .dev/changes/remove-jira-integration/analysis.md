# Codebase Analysis: Remove Jira Integration

Generated: 2026-01-24

## Project Context

- **Tech Stack**: Markdown, JSON, Python, Node.js
- **Architecture**: Multi-plugin marketplace with modular, composable plugins
- **Relevant Directories**:
  - `plugins/mcp-servers/` - MCP server configurations
  - `plugins/dev-workflow/` - Dev-workflow plugin with import command

## Similar Features Found

### 1. External Integration Pattern
- **Location**: `plugins/mcp-servers/.mcp.json`
- **Pattern**: MCP servers configured via JSON, shared between features
- **Relevance**: Atlassian server serves both Jira AND Confluence

### 2. Multi-Source Import Command
- **Location**: `plugins/dev-workflow/commands/import-issue.md`
- **Pattern**: Single command supports 3 sources (GitHub, JIRA, Confluence)
- **Relevance**: Must preserve GitHub and Confluence when removing Jira

## Files with Jira References

Search results for `jira|JIRA|Jira`:

| File | Context |
|------|---------|
| `CLAUDE.md` | Import-issue description, MCP server docs |
| `README.md` | Feature list, examples, command reference |
| `CONTRIBUTING.md` | MCP-servers description |
| `plugins/dev-workflow/commands/import-issue.md` | Full Jira import implementation |
| `plugins/dev-workflow/README.md` | Examples, requirements, supported sources |
| `plugins/agentic-ai-workflow/README.md` | Atlassian MCP description |

## Architecture Layers

| Layer | Impact |
|-------|--------|
| MCP Configuration | Update atlassian description (keep server) |
| Commands | Remove Jira option from import-issue |
| Documentation | Remove Jira references from all READMEs |
| Plugin Metadata | Version bumps |

## Critical Finding: Atlassian MCP Server Dependency

The `atlassian` MCP server provides **both** Jira and Confluence integration via the same endpoint:
```json
"atlassian": {
  "command": "npx",
  "args": ["-y", "mcp-remote", "https://mcp.atlassian.com/v1/sse"]
}
```

**Decision**: Keep the server for Confluence, update description to clarify Confluence-only purpose.

## Conventions to Follow

| Category | Convention |
|----------|------------|
| Version bumps | Minor for feature removal (1.1.0), Patch for docs (1.0.1) |
| Documentation | Remove cleanly, no deprecation notices |
| Testing | Manual `/plugin reinstall` verification |

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Break Confluence | Low | High | Keep atlassian server |
| Missed references | Medium | Low | Comprehensive search |
| User confusion | Medium | Low | Clean removal |
