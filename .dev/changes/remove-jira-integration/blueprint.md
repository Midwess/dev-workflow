# Architecture Blueprint: Remove Jira Integration

Generated: 2026-01-24

## Design Summary

Remove Jira integration via "soft deprecation" - removing Jira documentation and command references while keeping the underlying `atlassian` MCP server intact for Confluence users.

## Design Decisions

| Decision | Chosen Approach | Rationale |
|----------|-----------------|-----------|
| Atlassian MCP server | Keep for Confluence | Server provides both Jira and Confluence |
| import-issue command | Remove Jira option only | Preserve GitHub and Confluence |
| Version strategy | Minor (dev-workflow), Patch (mcp-servers) | Feature removal vs description update |
| Documentation | Remove all references cleanly | No confusing deprecation notes |

## Component Design

### import-issue.md Command (Modified)

**Before**: Supports 3 sources - GitHub, JIRA, Confluence
**After**: Supports 2 sources - GitHub, Confluence

Key changes:
- Remove `jira <ticket-id>` from arguments
- Remove "JIRA Ticket" fetch section
- Remove JIRA patterns from conversion tables
- Update interactive menu to 2 options

### atlassian MCP Server (Description Update)

**Before**: `"Atlassian cloud services"`
**After**: `"Confluence integration"`

Keep all configuration - only update description to clarify purpose.

## Files to Modify

| File | Changes | Phase |
|------|---------|-------|
| `plugins/dev-workflow/commands/import-issue.md` | Remove Jira sections | 1 |
| `plugins/dev-workflow/README.md` | Remove Jira references | 1 |
| `README.md` | Remove Jira mentions | 1 |
| `CLAUDE.md` | Remove Jira references | 1 |
| `CONTRIBUTING.md` | Update mcp-servers description | 1 |
| `plugins/agentic-ai-workflow/README.md` | Update atlassian description | 1 |
| `.dev/project.md` | Update dependencies | 1 |
| `plugins/mcp-servers/.mcp.json` | Update description | 2 |
| `plugins/dev-workflow/.claude-plugin/plugin.json` | 1.0.0 -> 1.1.0 | 3 |
| `plugins/mcp-servers/.claude-plugin/plugin.json` | 1.0.0 -> 1.0.1 | 3 |

## Implementation Phases

### Phase 1: Documentation Updates
Remove all Jira references from markdown files.

### Phase 2: Configuration Updates
Update MCP server description.

### Phase 3: Version Bumps
Update plugin versions to reflect changes.

### Phase 4: Verification
Search for remaining references, test functionality.

## Interface Changes

### import-issue Arguments

**Before**:
```
$ARGUMENTS:
- github <issue-number>
- jira <ticket-id>
- confluence <page-id>
```

**After**:
```
$ARGUMENTS:
- github <issue-number>
- confluence <page-id>
```

### Interactive Menu

**Before**: 3 options (GitHub, JIRA, Confluence)
**After**: 2 options (GitHub, Confluence)

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Confluence breaks | Keep atlassian server intact |
| Hidden references | Grep search in verification |
| Plugin conflicts | Test reinstall before committing |
