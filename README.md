# dev-workflow

OpenSpec-style spec-driven development workflow plugin suite for Claude Code and Codex with integrated code review, GitHub integration, and test generation.

## Quick Start

### Claude Code

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

### Codex

```bash
# 1. Clone the repo locally
git clone https://github.com/midwess/.ai ~/midwess/.ai
cd ~/midwess/.ai

# 2. Start Codex in the repo
codex

# 3. In Codex, open the plugin directory and install dev-workflow
/plugins

# 4. Use the proposal skill
$dev-workflow:proposal Add user authentication with OAuth
```

## Prerequisites

- [Claude Code](https://claude.ai/code) or [Codex](https://developers.openai.com/codex/plugins/) installed
- GitHub CLI (`gh`) authenticated via `gh auth login`

## Platform Support

- **Claude Code**: Full plugin support via `.claude-plugin/marketplace.json` and `plugins/dev-workflow/.claude-plugin/plugin.json`
- **Codex**: Dedicated Codex plugin root via `.agents/plugins/marketplace.json` and `plugins/dev-workflow-codex/.codex-plugin/plugin.json`
- **Hooks**: Existing hook automation remains Claude-specific for now

## Workflow Overview

1. **Initialize** - `/dev-workflow:init` sets up the `.dev/` folder structure
2. **Propose**
   Claude Code: `/dev-workflow:proposal` or `/dev-workflow:proposal-wizard`
   Codex: `$dev-workflow:proposal`
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

## Codex Skills

| Skill | Description |
|------|-------------|
| `$dev-workflow:init` | Initialize the `.dev/` workspace in Codex |
| `$dev-workflow:proposal` | Create a dev-workflow change proposal and supporting files in Codex |
| `$dev-workflow:proposal-wizard` | Create a proposal through a guided flow in Codex |
| `$dev-workflow:apply` | Implement tasks from an approved change proposal in Codex |
| `$dev-workflow:code-review` | Run the multi-agent review workflow in Codex |
| `$dev-workflow:archive` | Archive a completed change and merge its delta specs |
| `$dev-workflow:undo-archive` | Restore an archived change to active work |
| `$dev-workflow:pr-submit` | Run review and create a pull request in Codex |
| `$dev-workflow:status` | Show current dev-workflow state in Codex |
| `$dev-workflow:list` | List active or archived changes in Codex |
| `$dev-workflow:show` | Show details for one change in Codex |
| `$dev-workflow:import-issue` | Import a GitHub issue or PRD into dev-workflow |
| `$dev-workflow:generate-tests` | Generate tests from a proposal or spec domain |

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
- **project-guidelines-auditor** - AGENTS.md / CLAUDE.md / project guideline compliance
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

### Claude Code

```bash
/plugin marketplace add midwess/.ai
/plugin install dev-workflow@midwess
```

### Codex

```bash
git clone https://github.com/midwess/.ai ~/midwess/.ai
cd ~/midwess/.ai
codex
# then run /plugins and install dev-workflow from the repo marketplace
# then use:
$dev-workflow:proposal Add user authentication with OAuth
```

### Verify Installation

```bash
$dev-workflow:proposal Add a small test proposal
```

## Updating

```bash
# Pull the latest repo changes
cd ~/midwess/.ai && git pull

# Claude Code: reinstall the plugin
/plugin reinstall dev-workflow@midwess

# Codex: restart Codex so the local marketplace reloads the plugin files
```

## Documentation

See [plugins/dev-workflow/README.md](./plugins/dev-workflow/README.md) for the Claude Code plugin and [plugins/dev-workflow-codex/README.md](./plugins/dev-workflow-codex/README.md) for the Codex plugin.

The plugin docs cover:
- Detailed command options
- Spec format reference
- Delta notation guide
- Hook configurations
- Test generation

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

Internal use only - Midwess, Inc.
