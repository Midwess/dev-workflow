# Project Context

## Overview

**ai-workflow / dev-workflow**

OpenSpec-style spec-driven development workflow plugin suite for Claude Code and Codex. This repository ships runtime-specific plugin roots, shared workflow documentation, and a repo-local `.dev/` workspace used to manage changes to the plugin itself.

## Tech Stack

### Languages
- Markdown for commands, skills, agents, specs, and documentation
- JSON for marketplace and plugin manifests
- JavaScript for Claude hook automation

### Platforms
- Claude Code plugin system
- Codex plugin system

### Testing
- Manual Claude Code marketplace install and reload
- Manual Codex plugin installation from the local marketplace
- Workflow smoke testing through `init`, `proposal`, `status`, `code-review`, and related commands/skills

### Build Tools
- None; this repo is distributed directly from markdown, JSON, and small support scripts

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `.dev/` | Source-of-truth workspace for this repository's specs, active changes, archive, and project context |
| `.claude-plugin/` | Claude Code marketplace registration for the local plugin suite |
| `.agents/plugins/` | Codex marketplace registration for the local plugin suite |
| `plugins/dev-workflow/` | Claude Code plugin root with commands, agents, hooks, skills, and plugin metadata |
| `plugins/dev-workflow-codex/` | Codex plugin root with Codex-native commands, agents, skills, and plugin metadata |
| `plugins/dev-workflow/commands/` | Claude slash command definitions |
| `plugins/dev-workflow-codex/skills/` | Codex `$dev-workflow:*` entry skills |
| `plugins/dev-workflow/hooks/` | Claude-only automation hooks and supporting scripts |

## Architecture

### Style
Dual-runtime plugin suite with shared workflow concepts and runtime-specific delivery surfaces.

### Components
| Component | Location | Purpose |
|-----------|----------|---------|
| Claude marketplace | `.claude-plugin/marketplace.json` | Registers the Claude Code plugin from the local repo |
| Codex marketplace | `.agents/plugins/marketplace.json` | Registers the Codex plugin from the local repo |
| Claude plugin | `plugins/dev-workflow/` | Claude-specific command, agent, hook, and skill packaging |
| Codex plugin | `plugins/dev-workflow-codex/` | Codex-specific skills, commands, review agents, and metadata |
| Repo workflow state | `.dev/` | Tracks proposals, delta specs, and archived changes for this repository itself |

### Key Patterns
- Keep the high-level dev-workflow lifecycle aligned across Claude Code and Codex, even when delivery details differ.
- Use runtime-specific manifests and marketplace roots instead of assuming a single plugin package.
- Store commands, skills, and agents as markdown files with frontmatter-driven metadata.
- Treat `.dev/specs/` as the long-term source of truth and `.dev/changes/` as the workspace for active proposals.
- Keep hooks isolated to the Claude plugin unless Codex gains an equivalent mechanism.

## Conventions

### Naming
- Use kebab-case for command, agent, and skill directories/files such as `proposal-wizard.md` and `code-review`.
- Keep change IDs in `.dev/changes/` concise, descriptive, and kebab-case.

### Content Style
- Use YAML frontmatter in markdown-driven plugin assets.
- Prefer step-by-step operational instructions over narrative prose in commands and skills.
- Update repository docs when behavior changes across either runtime.

### Testing
- Reload the Claude plugin with `/plugin reinstall dev-workflow@midwess` after Claude-side changes.
- Reopen or refresh Codex plugin installation from `/plugins` after Codex-side changes.
- Smoke test the workflow entrypoints most affected by the change.

### Git
- Branch naming: `feature/add-<feature>`, `fix/<issue>`, `docs/<topic>`
- Commit style: Conventional commits

### Versioning
- Update `plugins/dev-workflow/.claude-plugin/plugin.json` when Claude plugin behavior or metadata changes.
- Update `plugins/dev-workflow-codex/.codex-plugin/plugin.json` when Codex plugin behavior or metadata changes.
- Keep versioning runtime-specific; do not assume both plugin manifests advance together.

## Key Commands

| Command | Purpose |
|---------|---------|
| `/plugin marketplace add ~/midwess/.ai` | Register the local marketplace in Claude Code |
| `/plugin install dev-workflow@midwess` | Install the Claude Code plugin |
| `/plugin reinstall dev-workflow@midwess` | Reload the Claude plugin after local edits |
| `/dev-workflow:status` | Smoke test the Claude workflow surface |
| `codex` | Open the repository in Codex |
| `/plugins` | Open Codex plugin management and install the local plugin |
| `$dev-workflow:proposal <description>` | Start a Codex proposal workflow |

## Notes

- This repository already contains active `.dev/changes/` work; refresh `.dev/project.md` without discarding user-authored proposal files.
- The repo has shifted from a Claude-only plugin to a dual-runtime suite. Any new capability should be evaluated for Claude parity, Codex parity, or an intentional runtime-specific divergence.
- Hooks remain Claude-specific for now and should be documented that way.
