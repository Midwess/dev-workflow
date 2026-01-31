# Project Context

## Overview

**dev-workflow**

OpenSpec-style spec-driven development workflow plugin for Claude Code with integrated code review, GitHub integration, and test generation.

## Tech Stack

### Languages
- Markdown (commands, agents, skills, documentation)
- JSON (configuration files)

### Frameworks
- Claude Code Plugin System

### Testing
- Manual testing via `/plugin reinstall`
- Local marketplace testing

### Build Tools
- None (no build step - direct markdown/JSON distribution)

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `.claude-plugin/` | Marketplace registration (marketplace.json) |
| `plugins/dev-workflow/` | The dev-workflow plugin |
| `plugins/dev-workflow/commands/` | Slash commands (13 files) |
| `plugins/dev-workflow/agents/` | Review agents (9 files) |
| `plugins/dev-workflow/skills/` | OpenSpec workflow skill |
| `plugins/dev-workflow/hooks/` | Automation hooks |

## Architecture

### Style
Single-plugin architecture focused on spec-driven development workflow

### Components
| Component | Location | Purpose |
|-----------|----------|---------|
| Commands | `plugins/dev-workflow/commands/` | User-invocable slash commands |
| Agents | `plugins/dev-workflow/agents/` | Specialized review agents |
| Skills | `plugins/dev-workflow/skills/` | OpenSpec workflow templates |
| Hooks | `plugins/dev-workflow/hooks/` | Event-driven automation |

### Key Patterns
- **Command structure**: Markdown + YAML frontmatter + step-by-step instructions
- **Agent structure**: Markdown + YAML frontmatter (name, description, tools, model, color) + system prompt
- **Marketplace registration**: Single `marketplace.json` with one plugin

## Conventions

### Naming
- **Commands**: kebab-case.md (`proposal-wizard.md`, `code-review.md`)
- **Agents**: kebab-case.md (`code-explorer.md`, `bug-detector.md`)

### Code Style
- YAML frontmatter for metadata in all markdown files
- Step-by-step numbered instructions in commands
- Expertise/Principles sections in agents
- JSON for all configuration

### Testing
- Manual testing via `/plugin reinstall dev-workflow@midwess`
- Test in actual project repositories
- Verify command execution, agent responses

### Git
- Branch naming: `feature/add-<feature>`, `fix/<issue>`, `docs/<topic>`
- Commit format: Conventional commits

### Versioning
- Semver (major.minor.patch) in `plugin.json`
- Patch: Bug fixes
- Minor: New features
- Major: Breaking changes

## Build Commands

| Command | Purpose |
|---------|---------|
| `/plugin marketplace add .` | Register local marketplace |
| `/plugin install dev-workflow@midwess` | Install the plugin |
| `/plugin reinstall dev-workflow@midwess` | Reload after changes |

## Dependencies

### Required
- Claude Code
- GitHub CLI (`gh`) authenticated

## Notes

This repository contains a single plugin (dev-workflow) distributed via Claude Code's plugin marketplace.

When developing:
1. Follow established patterns from existing commands/agents
2. Test locally before publishing
3. Update version in plugin.json
4. Document in plugin README.md
