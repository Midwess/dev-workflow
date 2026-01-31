# Contributing to dev-workflow

Thank you for your interest in contributing! This guide will help you add new features, fix bugs, and improve the dev-workflow plugin.

## Getting Started

### Prerequisites

- [Claude Code](https://claude.ai/code) installed
- Git installed
- GitHub CLI (`gh`) authenticated

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/midwess/.ai
   cd .ai
   ```

2. **Add the local marketplace:**
   ```bash
   /plugin marketplace add ~/midwess/.ai
   ```

3. **Install the plugin:**
   ```bash
   /plugin install dev-workflow@midwess
   ```

4. **Make changes to plugin files**

5. **Reload to test:**
   ```bash
   /plugin reinstall dev-workflow@midwess
   ```

## Plugin Structure

```
plugins/dev-workflow/
├── .claude-plugin/
│   └── plugin.json       # Plugin metadata
├── commands/             # Slash commands (13 files)
│   ├── init.md
│   ├── proposal.md
│   ├── proposal-wizard.md
│   ├── apply.md
│   ├── archive.md
│   ├── undo-archive.md
│   ├── code-review.md
│   ├── pr-submit.md
│   ├── list.md
│   ├── show.md
│   ├── status.md
│   ├── import-issue.md
│   └── generate-tests.md
├── agents/               # Review agents (9 files)
│   ├── code-explorer.md
│   ├── code-architect.md
│   ├── bug-detector.md
│   ├── test-analyzer.md
│   ├── claude-md-auditor.md
│   ├── spec-validator.md
│   ├── comment-analyzer.md
│   ├── code-simplifier.md
│   └── history-analyzer.md
├── hooks/                # Automation hooks
│   └── hooks.json
├── skills/               # OpenSpec workflow skill
│   └── openspec-workflow/
└── README.md
```

## Adding a Command

1. **Create the command file:**
   ```bash
   touch plugins/dev-workflow/commands/my-command.md
   ```

2. **Write the command:**
   ```markdown
   ---
   description: What this command does
   argument-hint: <required> [optional]
   allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pattern)
   ---

   Command description and purpose.

   ## Input
   $ARGUMENTS - Description of arguments

   ## Steps
   ### 1. First step
   Instructions...

   ### 2. Second step
   Instructions...

   ## Output
   Expected results
   ```

3. **Test:**
   ```bash
   /plugin reinstall dev-workflow@midwess
   /dev-workflow:my-command
   ```

## Adding an Agent

1. **Create the agent file:**
   ```bash
   touch plugins/dev-workflow/agents/my-agent.md
   ```

2. **Write the agent:**
   ```markdown
   ---
   name: my-agent
   description: When to invoke this agent
   tools: Read, Glob, Grep
   model: sonnet
   color: cyan
   ---

   You are an expert in [domain]. Your role is to [purpose].

   ## Expertise
   - Area 1
   - Area 2

   ## Principles
   - Principle 1
   - Principle 2
   ```

3. **Test:**
   ```bash
   /plugin reinstall dev-workflow@midwess
   @my-agent
   ```

## Testing

### Manual Testing

1. Install locally
2. Test each modified command
3. Test each modified agent
4. Verify hooks trigger correctly

### Testing Checklist

- [ ] Commands execute without errors
- [ ] Commands produce expected outputs
- [ ] Agents respond appropriately
- [ ] Plugin metadata is correct
- [ ] README is updated if needed

## Submitting Changes

### Branch Naming

- `feature/add-<feature>` - New features
- `fix/<issue>` - Bug fixes
- `docs/<topic>` - Documentation

### Commit Messages

```
<type>(<scope>): <subject>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

Example:
```
feat(commands): add bulk import command

Add /dev-workflow:bulk-import command for importing multiple issues
at once from GitHub projects.
```

### Pull Request Process

1. Create a feature branch
2. Make changes and test thoroughly
3. Commit with clear messages
4. Push and create PR
5. Address review feedback
6. Merge after approval

## Version Updates

When making changes, update `plugins/dev-workflow/.claude-plugin/plugin.json`:

- **Patch** (1.0.X): Bug fixes, minor improvements
- **Minor** (1.X.0): New features, backward-compatible
- **Major** (X.0.0): Breaking changes

## Questions?

- Open an issue on GitHub
- Check existing documentation
- Review similar commands/agents for patterns

## License

Internal use only - Midwess, Inc.
