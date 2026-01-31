# Delta for dev-workflow

## MODIFIED Requirements

### Requirement: External Import

The system SHALL support importing proposals from GitHub issues and Confluence PRDs.

#### Scenario: GitHub Import Success

- WHEN user runs `/dev-workflow:import-issue github <number>`
- THEN the system fetches issue details via `gh` CLI
- AND creates a proposal with converted acceptance criteria

#### Scenario: Confluence Import Success

- WHEN user runs `/dev-workflow:import-issue confluence <page-id>`
- THEN the system fetches PRD via MCP Confluence tools
- AND creates a proposal with converted requirements

#### Scenario: Interactive Source Selection

- WHEN user runs `/dev-workflow:import-issue` without arguments
- THEN the system prompts with 2 options: GitHub Issue, Confluence PRD
- AND user selects desired source

#### Scenario: Invalid Source

- WHEN user specifies an unknown source type
- THEN the system displays error with valid options (github, confluence)

## REMOVED Requirements

### Requirement: JIRA Import

The system SHALL support importing proposals from JIRA tickets.

**Reason for removal**: JIRA integration deprecated in favor of GitHub-first workflow. Users requiring JIRA integration should use GitHub issues or Confluence PRDs as alternatives.

#### Removed Scenarios

- JIRA ticket import via `/dev-workflow:import-issue jira <ticket-id>`
- JIRA fields conversion (story points, components, labels)
- JIRA subtask import as sub-tasks

## MODIFIED Requirements

### Requirement: MCP Server Configuration

The mcp-servers plugin SHALL provide a Confluence integration via the atlassian MCP server.

#### Scenario: Confluence Connection

- WHEN user has atlassian MCP server configured
- THEN the system can fetch Confluence pages for import

#### Modified: Server Description

- BEFORE: "Atlassian cloud services" (implied Jira + Confluence)
- AFTER: "Confluence integration" (clarifies Confluence-only usage)
