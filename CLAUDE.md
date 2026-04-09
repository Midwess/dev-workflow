# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Repository Overview

This repository contains the **dev-workflow** plugin suite - an OpenSpec-style spec-driven development workflow for Claude Code and Codex with integrated code review, GitHub integration, and test generation.

## Plugin Structure

```
.
├── .agents/
│   └── plugins/
│       └── marketplace.json      # Codex marketplace configuration
├── .claude-plugin/
│   └── marketplace.json      # Marketplace configuration
├── plugins/
│   ├── dev-workflow/         # The Claude Code plugin
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json   # Plugin metadata
│   │   ├── commands/         # 13 workflow commands
│   │   ├── agents/           # 9 review agents
│   │   ├── hooks/            # Automation hooks
│   │   └── skills/           # OpenSpec workflow skill
│   └── dev-workflow-codex/   # The Codex plugin
│       ├── .codex-plugin/
│       │   └── plugin.json   # Codex plugin metadata
│       ├── commands/         # Codex-native workflow commands
│       ├── agents/           # Codex planning/review agents
│       └── skills/           # Codex skill payloads
├── .dev/                     # Dev-workflow for this repo
├── README.md
├── CONTRIBUTING.md
└── CLAUDE.md
```

## Common Development Tasks

### Testing Plugin Changes

After modifying the plugin:

```bash
/plugin reinstall dev-workflow@midwess
/dev-workflow:status
```

### Adding a New Command

Commands go in `plugins/dev-workflow/commands/`:

```bash
touch plugins/dev-workflow/commands/my-command.md
```

Commands use markdown with YAML frontmatter:
```markdown
---
description: What this command does
argument-hint: <required> [optional]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pattern)
---

Command instructions...
```

### Adding a New Agent

Agents go in `plugins/dev-workflow/agents/`:

```markdown
---
name: agent-name
description: When to invoke this agent
tools: Read, Glob, Grep
model: sonnet
color: cyan
---

System prompt for the agent...
```

### Version Updates

Update the manifest for the runtime you changed:
- `plugins/dev-workflow/.claude-plugin/plugin.json`
- `plugins/dev-workflow-codex/.codex-plugin/plugin.json`

- Patch (1.0.X): Bug fixes
- Minor (1.X.0): New features
- Major (X.0.0): Breaking changes

## The Dev-Workflow

### Prerequisites

- GitHub CLI (`gh`) authenticated via `gh auth login`

### Workflow Overview

1. **Initialize** - `/dev-workflow:init` sets up `.dev/` folder
2. **Propose** - `/dev-workflow:proposal` creates change proposals
3. **Implement** - `/dev-workflow:apply` works through tasks
4. **Review** - `/dev-workflow:code-review` runs automated review
5. **Archive** - `/dev-workflow:archive` finalizes changes
6. **Submit** - `/dev-workflow:pr-submit` creates PR

### Core Commands

| Command | Description |
|---------|-------------|
| `/dev-workflow:init` | Initialize `.dev/` folder structure |
| `/dev-workflow:proposal <description>` | Create a change proposal |
| `/dev-workflow:proposal-wizard` | Interactive wizard for proposals |
| `/dev-workflow:apply <change-id>` | Implement tasks from a proposal |
| `/dev-workflow:code-review` | Run automated code review |
| `/dev-workflow:archive <change-id>` | Archive completed change |
| `/dev-workflow:pr-submit` | Create PR with review |
| `/dev-workflow:import-issue <source> <id>` | Import from GitHub or Confluence |
| `/dev-workflow:generate-tests <change-id>` | Generate test stubs from specs |

### Review Agents

- **claude-md-auditor** - CLAUDE.md guideline compliance
- **bug-detector** - Logic errors, null handling, security
- **history-analyzer** - Git history conflicts
- **spec-validator** - Spec format validation
- **test-analyzer** - Test coverage gaps (thorough mode)
- **comment-analyzer** - Comment accuracy (thorough mode)
- **code-simplifier** - Code clarity improvements (thorough mode)

## Prerequisites

- Claude Code installed
- GitHub CLI (`gh`) authenticated

## Testing Strategy

### Manual Testing

1. **Install marketplace locally:**
   ```bash
   /plugin marketplace add ~/path/to/repo
   ```

2. **Install plugin:**
   ```bash
   /plugin install dev-workflow@midwess
   ```

3. **Test commands:**
   ```bash
   /dev-workflow:status
   /dev-workflow:proposal --help
   ```

### Testing Checklist

- [ ] Commands execute without errors
- [ ] Commands produce expected outputs
- [ ] Agents respond appropriately
- [ ] Hooks trigger correctly
- [ ] Plugin metadata is correct

## Git Workflow

### Branch Naming

- `feature/add-<feature>` - New features
- `fix/<issue>` - Bug fixes
- `docs/<topic>` - Documentation updates

### Commit Messages

Follow conventional commits:
```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

## Key Files

- **`.agents/plugins/marketplace.json`**: Codex marketplace registration
- **`.claude-plugin/marketplace.json`**: Claude Code marketplace registration
- **`plugins/dev-workflow/.claude-plugin/plugin.json`**: Plugin metadata
- **`plugins/dev-workflow-codex/.codex-plugin/plugin.json`**: Codex plugin metadata
- **`plugins/dev-workflow/commands/*.md`**: Slash commands
- **`plugins/dev-workflow/agents/*.md`**: Specialized agents
- **`plugins/dev-workflow/skills/*/SKILL.md`**: Plugin skills
- **`plugins/dev-workflow/hooks/hooks.json`**: Hook configurations
- **`plugins/dev-workflow-codex/commands/*.md`**: Codex-native slash commands
- **`plugins/dev-workflow-codex/agents/*.md`**: Codex agent prompts
- **`plugins/dev-workflow-codex/skills/*/SKILL.md`**: Codex skill payloads

## Resources

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Claude Code Plugins](https://docs.claude.com/en/docs/claude-code/plugins)
