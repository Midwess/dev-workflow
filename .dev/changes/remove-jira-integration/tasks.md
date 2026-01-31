# Tasks: remove-jira-integration

## Progress: [11/11]

## 1. Documentation Updates - Core Files

- [x] 1.1 Remove Jira sections from import-issue.md command
  - Remove `jira <ticket-id>` from arguments
  - Remove JIRA from interactive menu
  - Remove "JIRA Ticket" fetch section (Step 2)
  - Remove JIRA patterns from conversion tables
  - Remove JIRA requirement notes

- [x] 1.2 Update dev-workflow/README.md
  - Remove JIRA from import-issue description
  - Remove `jira PROJ-123` examples
  - Remove JIRA from supported sources table
  - Remove JIRA requirements section

- [x] 1.3 Update main README.md
  - Remove JIRA from feature list
  - Remove JIRA from dev-workflow description
  - Remove JIRA from import-issue examples
  - Update atlassian description to Confluence-only

- [x] 1.4 Update CLAUDE.md
  - Remove JIRA from import-issue description
  - Remove JIRA from workflow documentation
  - Update atlassian MCP description

- [x] 1.5 Update CONTRIBUTING.md
  - Update mcp-servers description (remove "atlassian/jira")

- [x] 1.6 Update agentic-ai-workflow/README.md
  - Update atlassian MCP description to Confluence-only

- [x] 1.7 Update .dev/project.md
  - Update Atlassian API note to reflect Confluence-only

## 2. Configuration Updates

- [x] 2.1 Update plugins/mcp-servers/.mcp.json
  - Change atlassian description from "Atlassian cloud services" to "Confluence integration"

## 3. Version Bumps

- [x] 3.1 Bump dev-workflow version
  - Update plugins/dev-workflow/.claude-plugin/plugin.json: 1.0.0 -> 1.1.0

- [x] 3.2 Bump mcp-servers version
  - Update plugins/mcp-servers/.claude-plugin/plugin.json: 1.0.0 -> 1.0.1

## 4. Verification

- [x] 4.1 Search codebase for remaining Jira references
  - Run grep for jira|JIRA|Jira
  - Verify no references remain in modified files

---

## Notes

Implementation completed 2026-01-24.

### Changes Made
- Removed all Jira-specific sections from import-issue.md command
- Updated all README files and documentation
- Updated MCP server description to "Confluence integration"
- Bumped plugin versions (dev-workflow 1.1.0, mcp-servers 1.0.1)
- Verified no Jira references remain in source files

### Key Constraints Followed
- Kept atlassian MCP server (needed for Confluence)
- Preserved GitHub and Confluence import functionality
- Clean removal (no deprecation notices)
