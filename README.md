# dev-workflow

OpenSpec-style spec-driven development workflow plugin for Claude Code. Includes integrated code review, GitHub integration, folder-based test flows, re-runnable code audits, and a senior-qa / tester / investigator / auditor agent suite.

## Quick Start

```bash
# 1. Add the marketplace (points at this repo)
/plugin marketplace add dev-logs/dev-workflow

# 2. Install the plugin
/plugin install dev-workflow@midwess-dev

# 3. Initialize the workflow in your project
/dev-workflow:init

# 4. Create a change proposal
/dev-workflow:proposal Add user authentication

# 5. Implement
/dev-workflow:apply add-user-authentication

# 6. Review and submit
/dev-workflow:code-review
/dev-workflow:pr-submit
```

## Prerequisites

- [Claude Code](https://claude.ai/code) installed
- GitHub CLI (`gh`) authenticated via `gh auth login`

## Installation

### Add the marketplace

The marketplace name is `midwess-dev` (defined in `.claude-plugin/marketplace.json`) and the plugin is bundled inside this repository.

```bash
/plugin marketplace add dev-logs/dev-workflow
```

If you want to test a local checkout of this repo instead of the GitHub remote:

```bash
/plugin marketplace add /absolute/path/to/dev-workflow
```

### Install the plugin

```bash
/plugin install dev-workflow@midwess-dev
```

### Update

```bash
/plugin reinstall dev-workflow@midwess-dev
```

### Uninstall

```bash
/plugin uninstall dev-workflow@midwess-dev
```

### Verify

In any project, run:

```bash
/dev-workflow:status
```

You should see the workflow state overview.

## Workflow Overview

1. **Initialize** - `/dev-workflow:init` sets up the `.dev/` folder structure
2. **Propose** - `/dev-workflow:proposal` or `/dev-workflow:proposal-wizard`
3. **Implement** - `/dev-workflow:apply` works through tasks with progress tracking
4. **Review** - `/dev-workflow:code-review` runs automated review with confidence scoring
5. **Archive** - `/dev-workflow:archive` merges specs and finalizes changes
6. **Submit** - `/dev-workflow:pr-submit` creates PR with generated description

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
| `/dev-workflow:import-issue <source> <id>` | Import from GitHub or Confluence |
| `/dev-workflow:generate-tests <change-id>` | Generate test stubs from specs |
| `/dev-workflow:audit <aspect>` | Create a re-runnable audit charter (`case.md`) |
| `/dev-workflow:trigger-audit <path>` | Run a charter against current code |

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
│       ├── analysis.md     # Codebase analysis
│       ├── blueprint.md    # Architecture plan
│       ├── tasks.md        # Implementation checklist
│       └── specs/
│           └── {domain}/
│               └── spec.md  # Delta specs
├── archive/            # Completed changes
└── project.md          # Project context
```

## Review Agents

The code review uses specialized agents with confidence scoring:

**Core Agents (all modes):**
- **claude-md-auditor** - CLAUDE.md / AGENTS.md guideline compliance
- **bug-detector** - Logic errors, null handling, security
- **history-analyzer** - Git history conflicts
- **spec-validator** - Spec format validation

**Extended Agents (--thorough):**
- **test-analyzer** - Test coverage gaps
- **comment-analyzer** - Comment accuracy
- **code-simplifier** - Code clarity improvements

## Audit Agents

- **audit-scout** (opus) - Turns an audit request into a durable `case.md` charter
- **audit-scanner** (sonnet) - Cheap file-scoping pass; returns a ranked candidate list
- **auditor** (opus) - Runs a charter against current code, writes dated `result-<date>.md` verdict
- **investigator** - Diagnoses root cause when a test flow fails
- **senior-qa** - Authors folder-based test cases
- **tester** - Executes test cases against a live or local system

## AI-Assisted Planning

**code-explorer** - Analyzes your codebase before creating proposals:
- Discovers existing patterns and conventions
- Maps architecture layers and dependencies
- Finds similar features for reference
- Output saved to: `analysis.md`

**code-architect** - Designs implementation architecture:
- Creates file blueprints (create/modify/review)
- Designs component interfaces
- Plans implementation phases
- Output saved to: `blueprint.md`

## Documentation

See [plugins/dev-workflow/README.md](./plugins/dev-workflow/README.md) for the full plugin documentation, covering:
- Detailed command options
- Spec format reference
- Delta notation guide
- Hook configurations
- Test generation
- Audit flow

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

Internal use only - Midwess, Inc.
