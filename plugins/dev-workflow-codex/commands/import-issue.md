---
description: Create a change proposal from a GitHub issue or Confluence PRD
argument-hint: <source> <identifier>
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash, WebFetch]
---

Create a complete change proposal by importing from external sources: GitHub issues or Confluence PRD documents.

## Input

`$ARGUMENTS` - Options:
- `github <issue-number>` - Import from GitHub issue (e.g., `github 123` or `github #123`)
- `confluence <page-id-or-url>` - Import from Confluence PRD page
- No arguments - Interactive mode to select source

## Steps

### 1. Determine Source

If no arguments provided, ask user:

```
Import proposal from which source?

Options:
1. GitHub Issue - Import from GitHub issue number
2. Confluence PRD - Import from Confluence page
```

### 2. Fetch Source Content

#### GitHub Issue

```bash
gh issue view {number} --json number,title,body,labels,assignees,milestone,comments,url
```

#### Confluence PRD

Use WebFetch or MCP Confluence tools to fetch page:
- Get page title and content
- Parse structured sections (Requirements, User Stories, Acceptance Criteria)
- Extract tables and lists

Extract from Confluence PRD:
| PRD Section | Proposal Field |
|-------------|----------------|
| Title | Proposal title |
| Overview/Summary | Summary |
| Problem Statement | Motivation |
| Requirements | Specs (ADDED) |
| User Stories | Requirements with scenarios |
| Acceptance Criteria | WHEN/THEN scenarios |
| Out of Scope | Out of Scope section |
| Technical Approach | design.md content |

### 3. Parse Content to Proposal Format

#### Convert Requirements to Specs

**From Confluence PRD:**
```
## Requirements
- REQ-001: System shall support OAuth authentication
- REQ-002: System shall log all authentication attempts
```

**To Spec:**
```markdown
### Requirement: OAuth Authentication
The system SHALL support OAuth authentication.

### Requirement: Authentication Logging
The system SHALL log all authentication attempts.
```

### 4. Generate Proposal Structure

Create change folder with all standard files:

```
.dev/changes/{change-id}/
├── proposal.md          # Status: draft
├── analysis.md          # From code-explorer (if invoked)
├── blueprint.md         # From code-architect (if invoked)
├── tasks.md             # Generated from source
├── design.md            # If technical approach in source
└── specs/
    └── {domain}/
        └── spec.md      # Delta specifications
```

### 5. Generate proposal.md

```markdown
# Proposal: {title}

**Status**: draft

## Source

- **Type**: {GitHub Issue | Confluence PRD}
- **Reference**: {URL or ID}
- **Imported**: {timestamp}

## Summary

{Extracted summary from source}

## Motivation

{Problem statement or background from source}

## Scope

### In Scope

{Extracted from source}

### Out of Scope

{Extracted from source, or "See source document"}

## Affected Areas

| Area | Impact |
|------|--------|
| {component} | {change type} |

## Requirements Summary

{List of requirements extracted}

## Dependencies

{From source if available}

## Risks

| Risk | Mitigation |
|------|------------|
| {risk} | {mitigation} |
```

### 6. Generate tasks.md

Extract tasks from:
- GitHub checkboxes
- Confluence task lists
- Infer from acceptance criteria

```markdown
# Tasks: {change-id}

## Progress: [0/N]

## 1. Setup

- [ ] 1.1 {setup task}

## 2. Implementation

- [ ] 2.1 {implementation task from source}
- [ ] 2.2 {another task}

## 3. Testing

- [ ] 3.1 {test task based on acceptance criteria}

## 4. Documentation

- [ ] 4.1 Update relevant documentation

---

## Notes

Imported from: {source type} {reference}
```

### 7. Invoke Planning Agents (Optional)

After import, optionally invoke:
- **code-explorer**: Analyze codebase for the imported requirements
- **code-architect**: Design implementation for the requirements

Ask user:
```
Run AI analysis on imported requirements?

Options:
1. Yes - Run code-explorer and code-architect
2. No - Skip, I'll review first
```

If yes:
- Invoke code-explorer → Save to analysis.md
- Invoke code-architect → Save to blueprint.md
- Update project.md with latest analysis

### 8. Output Summary

```
## Proposal Imported

### Source
- Type: {GitHub Issue | Confluence PRD}
- Reference: {identifier}
- URL: {url}

### Created Files
- .dev/changes/{change-id}/proposal.md (Status: draft)
- .dev/changes/{change-id}/tasks.md
- .dev/changes/{change-id}/specs/{domain}/spec.md
{If AI analysis ran:}
- .dev/changes/{change-id}/analysis.md
- .dev/changes/{change-id}/blueprint.md

### Extracted
- Requirements: {N}
- Scenarios: {M}
- Tasks: {P}

### Review Required

Please review the imported proposal:
- [ ] Verify requirements match source intent
- [ ] Check scenario coverage
- [ ] Adjust task breakdown if needed
- [ ] Approve in proposal.md when ready

### Next Steps
1. Review: /dev-workflow:show {change-id}
2. Approve: Change Status to 'approved' in proposal.md
3. Implement: /dev-workflow:apply {change-id}
```

## Source-Specific Parsing

### GitHub Issue Patterns

| Pattern | Extraction |
|---------|------------|
| `- [ ] item` | Task item |
| `## Acceptance Criteria` | Requirements section |
| `As a ... I want ... So that` | User story format |
| `Given/When/Then` | Scenario format |

### Confluence PRD Patterns

| Section Header | Extraction |
|----------------|------------|
| Overview, Summary, Introduction | Summary |
| Problem Statement, Background | Motivation |
| Requirements, Functional Requirements | Specs |
| Non-Functional Requirements | Constraints |
| User Stories | Requirements with scenarios |
| Acceptance Criteria | WHEN/THEN scenarios |
| Out of Scope, Exclusions | Out of Scope |
| Technical Approach, Architecture | design.md |
| Risks, Concerns | Risks section |
| Timeline, Milestones | (informational only) |

## Domain Mapping

Map source labels/components to spec domains:

| Source Label | Spec Domain |
|--------------|-------------|
| auth, authentication, security | auth |
| api, backend, service | api |
| ui, frontend, web | ui |
| database, db, data | db |
| docs, documentation | docs |
| infra, infrastructure, devops | infra |
| test, testing, qa | tests |

## Notes

- **GitHub**: Requires `gh` CLI authenticated
- **Confluence**: Requires MCP Confluence server or accessible URL
- Always review generated specs for accuracy
- Source reference is preserved for traceability
- Status starts as 'draft' - approve before /apply
