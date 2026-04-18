# dev-workflow

OpenSpec-style spec-driven development workflow plugin for Claude Code with integrated code review, GitHub integration, and test generation.

## Overview

This plugin provides a structured approach to feature development:

1. **Initialize** - Set up the `.dev/` folder structure
2. **Propose** - Create change proposals with specs and tasks
3. **Implement** - Work through tasks with progress tracking
4. **Review** - Automated code review with confidence scoring
5. **Archive** - Merge specs and finalize changes
6. **Submit** - Create PR with generated description

## Installation

Install this plugin in Claude Code. The Codex companion plugin now lives in `plugins/dev-workflow-codex/`.

**Prerequisites:**
- GitHub CLI (`gh`) authenticated via `gh auth login`

### Claude Code

```bash
/plugin marketplace add midwess/.ai
/plugin install dev-workflow@midwess
```

For Codex, use the separate plugin root:

- `plugins/dev-workflow-codex/.codex-plugin/plugin.json`
- `.agents/plugins/marketplace.json`

## Commands

### Core Workflow

| Command | Description |
|---------|-------------|
| `/dev-workflow:init` | Initialize `.dev/` folder structure |
| `/dev-workflow:proposal <description>` | Create a change proposal |
| `/dev-workflow:proposal-wizard` | Interactive wizard for creating proposals |
| `/dev-workflow:apply <change-id>` | Implement tasks from a proposal |
| `/dev-workflow:archive <change-id>` | Archive and merge completed change |
| `/dev-workflow:undo-archive <change-id>` | Restore archived change to active |

### Review & PR

| Command | Description |
|---------|-------------|
| `/dev-workflow:code-review [PR]` | Run automated code review |
| `/dev-workflow:pr-submit` | Create PR with review |

### Utilities

| Command | Description |
|---------|-------------|
| `/dev-workflow:list` | List active and archived changes |
| `/dev-workflow:show <change-id>` | View change details |
| `/dev-workflow:status` | Show workflow state overview |

### External Import

| Command | Description |
|---------|-------------|
| `/dev-workflow:import-issue <source> <id>` | Import from GitHub or Confluence |

### Test Generation

| Command | Description |
|---------|-------------|
| `/dev-workflow:generate-tests <change-id>` | Generate test stubs from specs |

### Image Generation

| Command | Description |
|---------|-------------|
| `/dev-workflow:image-generation <prompt>` | Generate images with the Minimax image API |

### Minimax Text

| Command | Description |
|---------|-------------|
| `/dev-workflow:minimax <request>` | Send a text request through the local `claude` CLI using Minimax |

## Folder Structure

After running `/dev-workflow:init`:

```
.dev/
├── specs/              # Source of truth specifications
│   └── {domain}/
│       └── spec.md
├── changes/            # Active change proposals
│   └── {change-id}/
│       ├── proposal.md     # Scope, risks (Status: draft/approved)
│       ├── analysis.md     # Codebase analysis (from code-explorer)
│       ├── blueprint.md    # Architecture plan (from code-architect)
│       ├── tasks.md        # Implementation checklist
│       ├── design.md       # Optional technical decisions
│       └── specs/
│           └── {domain}/
│               └── spec.md  # Delta
├── archive/            # Completed changes
│   └── YYYY-MM-DD-{change-id}/
└── project.md          # Project context (+ Latest Analysis section)
```

## Quick Start

### Basic Workflow

```bash
# 1. Initialize (first time)
/dev-workflow:init

# 2. Create proposal (choose one)
/dev-workflow:proposal Add user authentication
/dev-workflow:proposal-wizard  # Interactive guided creation
/dev-workflow:import-issue 123  # From GitHub issue

# 3. Implement
/dev-workflow:apply add-user-authentication

# 4. Review
/dev-workflow:code-review

# 5. Archive and PR
/dev-workflow:archive add-user-authentication
/dev-workflow:pr-submit
```

### Managing Changes

```bash
# Check workflow status
/dev-workflow:status

# List all changes (active and archived)
/dev-workflow:list
/dev-workflow:list --all
/dev-workflow:list --archived

# View change details
/dev-workflow:show add-user-authentication
```

### Resuming Work

```bash
# Resume from last incomplete task (default)
/dev-workflow:apply add-user-authentication

# Start from a specific task
/dev-workflow:apply add-user-authentication --from 2.3

# Re-run only one task
/dev-workflow:apply add-user-authentication --only 3.1

# Reset and start fresh
/dev-workflow:apply add-user-authentication --reset
```

### Archive Operations

```bash
# Preview archive without making changes
/dev-workflow:archive add-user-authentication --dry-run

# Archive even if tasks incomplete
/dev-workflow:archive add-user-authentication --force

# Restore archived change to active
/dev-workflow:undo-archive add-user-authentication
```

### External Import

```bash
# Import from GitHub issue
/dev-workflow:import-issue github 123

# Import from Confluence PRD
/dev-workflow:import-issue confluence <page-id-or-url>

# Interactive mode (select source)
/dev-workflow:import-issue
```

### Test Generation

```bash
# Generate tests from change proposal specs
/dev-workflow:generate-tests add-user-authentication

# Generate tests from a main spec domain
/dev-workflow:generate-tests auth

# Preview without creating files
/dev-workflow:generate-tests auth --dry-run
```

### Image Generation

```bash
# Generate three image URLs with the default settings
/dev-workflow:image-generation A man in a white t-shirt, full-body, standing front view, outdoors, with the Venice Beach sign in the background, Los Angeles. Fashion photography in 90s documentary style, film grain, photorealistic.

# Override aspect ratio and image count
/dev-workflow:image-generation Editorial portrait in Tokyo at night, reflective pavement, cinematic lighting --aspect-ratio 1:1 --count 1
```

### Minimax Text

```bash
# Send a text request through the local claude CLI using Minimax
/dev-workflow:minimax Summarize the architecture of this repository in five bullets.
```

## Code Review

### Review Modes

```bash
/dev-workflow:code-review              # Standard (4 agents)
/dev-workflow:code-review --quick      # Fast (4 agents, lower threshold)
/dev-workflow:code-review --thorough   # Deep (7 agents)
```

### Review Agents

**Core Agents (all modes):**
- **claude-md-auditor** - CLAUDE.md guideline compliance
- **bug-detector** - Logic errors, null handling, security
- **history-analyzer** - Git history conflicts
- **spec-validator** - Spec format validation

**Extended Agents (--thorough):**
- **test-analyzer** - Test coverage gaps
- **comment-analyzer** - Comment accuracy
- **code-simplifier** - Code clarity improvements

### Confidence Scoring

| Score | Meaning |
|-------|---------|
| 90-100 | Critical issue, must fix |
| 80-89 | High confidence, should fix |
| < 80 | Filtered out (too uncertain) |

## AI-Assisted Planning

The plugin includes intelligent agents that enhance the planning phase:

### Planning Agents

**code-explorer** - Analyzes your codebase before creating proposals:
- Discovers existing patterns and conventions
- Maps architecture layers and dependencies
- Finds similar features for reference
- Identifies affected files and domains
- **Output saved to**: `analysis.md`

**code-architect** - Designs implementation architecture:
- Creates file blueprints (create/modify/review)
- Designs component interfaces
- Plans implementation phases
- Generates task breakdowns
- **Output saved to**: `blueprint.md`

### When Agents Are Invoked

| Command | code-explorer | code-architect |
|---------|---------------|----------------|
| `/dev-workflow:init` | Optional (Deep mode) | - |
| `/dev-workflow:proposal` | Auto | Auto |
| `/dev-workflow:proposal-wizard` | Auto (after Step 6) | Auto (after Step 7) |

### Deep Analysis on Init

```bash
# Basic initialization (default)
/dev-workflow:init
# → Quick tech stack detection

# With deep codebase analysis
/dev-workflow:init
# → Select "Deep" when prompted
# → Enhanced project.md with architecture and patterns
```

### AI-Assisted Proposal Creation

When running `/dev-workflow:proposal` or `/dev-workflow:proposal-wizard`:

1. **code-explorer** analyzes the codebase:
   - Similar features found
   - Architecture layers
   - Conventions to follow
   - Dependencies
   - **Saved to**: `.dev/changes/{id}/analysis.md`
   - **Also updates**: `.dev/project.md` (Latest Analysis section)

2. **code-architect** designs the implementation:
   - Files to create/modify
   - Implementation phases
   - Task breakdown
   - Risk assessment
   - **Saved to**: `.dev/changes/{id}/blueprint.md`

3. Results feed directly into:
   - `proposal.md` - Affected areas, risks (Status: draft)
   - `tasks.md` - Ordered implementation tasks
   - `specs/` - Delta structure recommendations

## Approval Workflow

Proposals require approval before implementation:

### Workflow

```
/proposal → Creates files (Status: draft)
     ↓
User reviews analysis.md, blueprint.md, tasks.md, specs/
     ↓
User changes Status: draft → approved in proposal.md
     ↓
/apply → Checks status, proceeds if approved
```

### Status Values

| Status | Meaning |
|--------|---------|
| `draft` | Proposal created, needs review |
| `approved` | Reviewed and ready for implementation |

### Approving a Proposal

1. Review the generated documents:
   - `analysis.md` - Is the codebase analysis accurate?
   - `blueprint.md` - Is the architecture approach correct?
   - `tasks.md` - Are the tasks complete?
   - `specs/` - Are the requirements correct?

2. Make adjustments as needed

3. Edit `proposal.md` and change:
   ```markdown
   **Status**: approved
   ```

4. Run `/dev-workflow:apply {change-id}`

### Why Approval?

- Ensures AI-generated plans are reviewed before implementation
- Allows adjustment of architecture, tasks, or specs
- Creates a checkpoint for complex changes
- Documents human oversight in the process

## Command Options

### apply
```bash
/dev-workflow:apply <change-id>           # Resume from last task
/dev-workflow:apply <change-id> --from 2.3  # Start from task 2.3
/dev-workflow:apply <change-id> --only 3.1  # Run only task 3.1
/dev-workflow:apply <change-id> --reset     # Reset and start fresh
```

### archive
```bash
/dev-workflow:archive <change-id>           # Archive and merge
/dev-workflow:archive <change-id> --dry-run # Preview without changes
/dev-workflow:archive <change-id> --force   # Skip completion check
```

### code-review
```bash
/dev-workflow:code-review                   # Current branch
/dev-workflow:code-review 123               # Specific PR
/dev-workflow:code-review --thorough        # All 7 agents
/dev-workflow:code-review --no-comment      # Console only
/dev-workflow:code-review --threshold 70    # Custom threshold
```

## Automation Hooks

The plugin includes hooks that trigger automatically:

- **Scout block** - Blocks access to redundant directories and sensitive files
- **Spec validation** - Validates format when writing spec files
- **PR creation** - Offers follow-up actions after `gh pr create`
- **Task progress** - Shows completion notifications
- **Session summary** - Summarizes dev-workflow activity at session end

### Scout Block (Token Savings & Security)

Automatically blocks Claude from accessing:

**Redundant Directories (saves tokens):**
| Language | Blocked Patterns |
|----------|-----------------|
| JavaScript/TypeScript | `node_modules/`, `dist/`, `build/`, `.next/`, `.nuxt/` |
| Rust | `target/` |
| Go | `vendor/` |
| Python | `__pycache__/`, `venv/`, `.venv/`, `site-packages/` |
| General | `.git/`, `.cache/`, `coverage/` |

**Sensitive Files (security):**
| Category | Blocked Patterns |
|----------|-----------------|
| Environment | `.env`, `.env.*` |
| Credentials | `credentials*`, `secrets*` |
| Keys | `*.pem`, `*.key`, `*.p12`, `*.pfx` |
| Auth | `.netrc`, `.npmrc` |

**Applies to tools:** Read, Glob, Grep

**Bypass:** If you need to access a blocked path intentionally, ask Claude to confirm the access is safe.

## External Import

Import proposals from external sources:

### Supported Sources

```bash
# GitHub Issue
/dev-workflow:import-issue github 123

# Confluence PRD
/dev-workflow:import-issue confluence <page-id-or-url>

# Interactive mode (select source)
/dev-workflow:import-issue
```

### Features

- Extracts requirements from source documents
- Converts acceptance criteria to WHEN/THEN specs
- Maps labels/components to spec domains
- Generates task breakdown from checkboxes/task lists
- Optionally runs code-explorer and code-architect
- Preserves source reference for traceability

### Requirements

| Source | Requirement |
|--------|-------------|
| GitHub | `gh` CLI authenticated |
| Confluence | MCP Confluence server or accessible URL |

## Test Generation

Generate test stubs from your specs:

```bash
/dev-workflow:generate-tests add-user-auth    # From change
/dev-workflow:generate-tests auth             # From domain
/dev-workflow:generate-tests auth --dry-run   # Preview
```

Supports: Jest, Vitest, Pytest, Go, RSpec

Converts WHEN/THEN scenarios to test cases:
```
#### Scenario: Successful login
- WHEN user submits valid credentials
- THEN system issues JWT token
```
↓
```javascript
it('should issue JWT token when user submits valid credentials', () => {
  // Arrange: setup
  // Act: submit valid credentials
  // Assert: JWT token issued
});
```

## Spec Format

### Main Specs

```markdown
# Auth Specification

## Purpose
Handles user authentication and session management.

## Requirements

### Requirement: User Login
The system SHALL authenticate users via email and password.

#### Scenario: Successful login
- WHEN the user submits valid credentials
- THEN the system issues a JWT token
```

### Delta Specs

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: OAuth Support
The system SHALL support OAuth 2.0 authentication.

#### Scenario: OAuth login
- WHEN the user clicks "Login with Google"
- THEN the system redirects to OAuth provider

## MODIFIED Requirements

### Requirement: User Login
The system SHALL authenticate users via email, password, or OAuth.

## REMOVED Requirements

### Requirement: Basic Auth
Reason: Deprecated in favor of OAuth
```

## Tips

- Use `/dev-workflow:proposal-wizard` for complex proposals
- Run `--dry-run` before archive to preview changes
- Use `--thorough` review for important PRs
- Link GitHub issues for traceability
- Generate tests to validate spec coverage
- Keep proposals focused - one feature per proposal

## File Summary

### Commands (15 files)

| Command | Purpose |
|---------|---------|
| `init` | Initialize `.dev/` structure |
| `proposal` | Create change proposal |
| `proposal-wizard` | Interactive proposal creation |
| `apply` | Implement tasks (+ resume options) |
| `archive` | Archive change (+ dry-run) |
| `undo-archive` | Restore archived change |
| `code-review` | Review (+ thoroughness modes) |
| `pr-submit` | Create PR with review |
| `list` | List changes |
| `show` | View change details |
| `status` | Workflow state overview |
| `import-issue` | Import from GitHub/Confluence |
| `generate-tests` | Generate test stubs from specs |
| `image-generation` | Generate images with the Minimax image API |
| `minimax` | Send a text request through the local `claude` CLI using Minimax |

### Agents (9 files)

| Agent | Purpose | Model |
|-------|---------|-------|
| `code-explorer` | Codebase pattern & architecture analysis | sonnet |
| `code-architect` | Implementation blueprint design | opus |
| `claude-md-auditor` | CLAUDE.md compliance | sonnet |
| `bug-detector` | Bug detection | sonnet |
| `history-analyzer` | Git history analysis | sonnet |
| `spec-validator` | Spec format validation | haiku |
| `test-analyzer` | Test coverage gaps | sonnet |
| `comment-analyzer` | Comment accuracy | sonnet |
| `code-simplifier` | Code simplifications | opus |

### Hooks (6 files)

| Hook | Trigger |
|------|---------|
| `hooks.json` | Configuration |
| `scout-block.js` | PreToolUse (Bash, Read, Glob, Grep) |
| `validate-spec` | On spec file write |
| `post-pr-review` | After PR creation |
| `task-progress` | On task completion |
| `session-summary` | Session end |

### Skills (7 files)

| File | Purpose |
|------|---------|
| `SKILL.md` | Main skill definition |
| `minimax-codegen/SKILL.md` | Minimax single-file code generation workflow |
| `spec-format.md` | Spec format reference |
| `delta-format.md` | Delta notation reference |
| `templates/proposal.md` | Proposal template |
| `templates/tasks.md` | Tasks template |
| `templates/spec.md` | Spec template |

## Related

- [OpenSpec](https://github.com/Fission-AI/OpenSpec) - Inspiration for spec-driven workflow
- [Claude Code Plugins](https://github.com/anthropics/claude-plugins-official) - Official plugins
