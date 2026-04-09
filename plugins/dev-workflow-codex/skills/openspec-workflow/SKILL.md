---
name: openspec-workflow
description: OpenSpec-style spec-driven development workflow for Codex. Use when working with the .dev folder, specifications, change proposals, delta notation, requirement scenarios, or dev-workflow skills such as $dev-workflow:proposal. Helps with proposal creation, spec formatting, task management, and change archiving.
---

# OpenSpec Workflow Skill

Guide for spec-driven development using the dev-workflow Codex plugin.

## When to Use

Use this skill when:
- Creating or reviewing change proposals
- Writing or modifying specifications
- Using delta notation (ADDED/MODIFIED/REMOVED)
- Writing requirement scenarios (WHEN/THEN)
- Managing the `.dev/` folder structure
- Running dev-workflow skills in Codex such as `$dev-workflow:proposal`

When a request is substantial or ambiguous, prefer delegating focused analysis to the plugin agents such as `code-explorer`, `code-architect`, or the review agents, then integrate the results back into the main workflow.

## Key Concepts

### Two-Folder Model

```
.dev/
├── specs/       # Current truth - what the system does NOW
├── changes/     # Proposed changes - what we want to change
├── archive/     # Completed changes (YYYY-MM-DD-{id})
└── project.md   # Project context and conventions
```

- `specs/` is the source of truth for current requirements
- `changes/` contains proposals that will modify specs
- After implementation, deltas merge into specs via archive

### Change Proposal Structure

```
.dev/changes/{change-id}/
├── proposal.md          # Why and what (summary, motivation, scope)
├── tasks.md             # Implementation checklist with progress
├── design.md            # Technical decisions (optional, for complex changes)
└── specs/
    └── {domain}/
        └── spec.md      # Delta specification
```

### Delta Notation

Deltas describe HOW specs change:

- **ADDED** - New requirements being introduced
- **MODIFIED** - Changed requirements (include complete updated text)
- **REMOVED** - Deprecated requirements (include reason)

### Requirement Format

```markdown
### Requirement: {Unique Name}
The system SHALL/MUST {behavior description}.

#### Scenario: {Scenario Name}
- GIVEN {precondition} (optional)
- WHEN {condition or action}
- THEN {expected result}
- AND {additional result} (optional)
```

### Task Tracking

Tasks use markdown checkboxes:
- `- [ ]` Pending task
- `- [x]` Completed task

Progress header: `## Progress: [X/Y]`

## Reference Files

For detailed format specifications:
- [spec-format.md](spec-format.md) - Full spec format reference
- [delta-format.md](delta-format.md) - Delta notation guide
- [templates/](templates/) - Ready-to-use templates

## Suggested Entry Skills

- `$dev-workflow:init` - Bootstrap the `.dev/` workspace
- `$dev-workflow:proposal` - Create a new change proposal and supporting files
- `$dev-workflow:proposal-wizard` - Create a proposal through a guided flow
- `$dev-workflow:apply` - Implement tasks for an approved proposal
- `$dev-workflow:code-review` - Run the multi-agent review workflow
- `$dev-workflow:archive` - Merge a completed change into the main specs
- `$dev-workflow:pr-submit` - Create a pull request from the current change
