# dev-workflow

OpenSpec-style spec-driven development workflow plugin for Claude Code with integrated code review, GitHub integration, and test generation.

## Quick Start

```bash
# 1. Add the marketplace
/plugin marketplace add midwess/.ai

# 2. Install the plugin
/plugin install dev-workflow@midwess

# 3. Initialize in your project
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

## Workflow Overview

1. **Initialize** - `/dev-workflow:init` sets up the `.dev/` folder structure
2. **Propose** - `/dev-workflow:proposal` or `/dev-workflow:proposal-wizard` creates change proposals
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
- **claude-md-auditor** - CLAUDE.md guideline compliance
- **bug-detector** - Logic errors, null handling, security
- **history-analyzer** - Git history conflicts
- **spec-validator** - Spec format validation

**Extended Agents (--thorough):**
- **test-analyzer** - Test coverage gaps
- **comment-analyzer** - Comment accuracy
- **code-simplifier** - Code clarity improvements

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

## Installation

### From GitHub (Recommended)

```bash
/plugin marketplace add midwess/.ai
/plugin install dev-workflow@midwess
```

### From Local Clone

```bash
git clone https://github.com/midwess/.ai ~/midwess/.ai
/plugin marketplace add ~/midwess/.ai
/plugin install dev-workflow@midwess
```

### Verify Installation

```bash
/plugin list
# Should show: dev-workflow@midwess (enabled)

/dev-workflow:status
```

## Updating

```bash
# From GitHub
/plugin update dev-workflow@midwess

# From local clone
cd ~/midwess/.ai && git pull
/plugin reinstall dev-workflow@midwess
```

## Documentation

See [plugins/dev-workflow/README.md](./plugins/dev-workflow/README.md) for complete documentation including:
- Detailed command options
- Spec format reference
- Delta notation guide
- Hook configurations
- Test generation

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

Internal use only - Midwess, Inc.
