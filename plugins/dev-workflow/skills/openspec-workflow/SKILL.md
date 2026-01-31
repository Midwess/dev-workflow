---
name: openspec-workflow
description: OpenSpec-style spec-driven development workflow. Use when working with .dev/ folder, specifications, change proposals, delta notation, or requirement scenarios. Helps with proposal creation, spec formatting, task management, and change archiving.
---

# OpenSpec Workflow Skill

Guide for spec-driven development using the dev-workflow plugin.

## When to Use

Use this skill when:
- Creating or reviewing change proposals
- Writing or modifying specifications
- Using delta notation (ADDED/MODIFIED/REMOVED)
- Writing requirement scenarios (WHEN/THEN)
- Managing the `.dev/` folder structure

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

## Commands

| Command | Purpose |
|---------|---------|
| `/dev-workflow:init` | Initialize `.dev/` structure |
| `/dev-workflow:proposal` | Create change proposal |
| `/dev-workflow:apply` | Implement proposal tasks |
| `/dev-workflow:archive` | Archive and merge completed change |
| `/dev-workflow:code-review` | Run automated code review |
| `/dev-workflow:pr-submit` | Create PR with review |

## Workflow Overview

```
1. /dev-workflow:init          # First time setup
2. /dev-workflow:proposal      # Create change proposal
3. Review and refine proposal  # Human review
4. /dev-workflow:apply         # Implement tasks
5. /dev-workflow:code-review   # Automated review
6. /dev-workflow:archive       # Finalize and merge specs
7. /dev-workflow:pr-submit     # Create pull request
```
