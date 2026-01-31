---
description: Initialize dev-workflow in the current project
allowed-tools: Read, Glob, Grep, Write, Bash(ls:*), Bash(find:*), Bash(git:*), AskUserQuestion, Task(code-explorer)
---

Initialize the dev-workflow system for this project by creating the `.dev/` folder structure and detecting the project's tech stack.

## Steps

### 1. Check for existing `.dev/` folder

Use Glob to check if `.dev/` already exists:
- If `.dev/project.md` exists, inform the user and ask if they want to reinitialize
- If user declines, stop here

### 2. Discover project structure

Detect the tech stack by looking for common configuration files:

**Package managers / Languages:**
| File | Stack |
|------|-------|
| `package.json` | Node.js/npm |
| `Cargo.toml` | Rust |
| `pyproject.toml`, `requirements.txt`, `setup.py` | Python |
| `go.mod` | Go |
| `Gemfile` | Ruby |
| `pom.xml`, `build.gradle` | Java |
| `composer.json` | PHP |
| `*.csproj`, `*.sln` | .NET |

**Frameworks (check dependencies in package files):**
- Frontend: React, Vue, Angular, Svelte, Next.js, Nuxt
- Backend: Express, Fastify, NestJS, Django, FastAPI, Flask, Gin, Echo
- Testing: Jest, Vitest, Pytest, Go test, RSpec

**Other indicators:**
- `CLAUDE.md` - Project has Claude Code guidance
- `docker-compose.yml`, `Dockerfile` - Containerized
- `.github/workflows/` - GitHub Actions CI
- `tsconfig.json` - TypeScript

### 2.5 Deep Codebase Exploration (Optional)

Offer enhanced analysis to improve `project.md` quality.

**Ask user using AskUserQuestion:**
```
Would you like a deep codebase analysis to enhance project.md?

Options:
- Quick (default): Basic tech stack detection only
- Deep: Comprehensive pattern and architecture analysis
```

**If "Quick" (default):**
- Proceed to Step 3 with basic detection results

**If "Deep":**

Launch the `code-explorer` agent with:
- **Scope**: Entire project
- **Focus**: Overall architecture, patterns, conventions

Display to user: "Performing deep codebase analysis..."

The agent returns `OUTPUT_CODEBASE_ANALYSIS`. Use the results to enhance `project.md`:

1. **Architecture section** - From architecture mapping
2. **Conventions section** - From convention extraction
3. **Key patterns** - From pattern discovery
4. **Directory purposes** - From dependency analysis

Display summary to user:
```
Deep analysis complete:
- Architecture style: {style}
- {N} code patterns identified
- {M} conventions extracted
- {P} key directories mapped
```

### 3. Create `.dev/` directory structure

Create the following folders and files:

```
.dev/
├── specs/              # Source of truth specifications
├── changes/            # Active change proposals
├── archive/            # Completed changes
└── project.md          # Project context
```

Use Bash to create directories:
```bash
mkdir -p .dev/specs .dev/changes .dev/archive
```

### 4. Generate `project.md`

Create `.dev/project.md` with detected information:

```markdown
# Project Context

## Overview

{Project name from package.json/Cargo.toml/etc, or folder name}
{Description if available from package file}

## Tech Stack

### Languages
- {Detected language(s)}

### Frameworks
- {Detected framework(s)}

### Testing
- {Detected test framework(s)}

### Build Tools
- {Detected build tools}

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/` | {if exists: Source code} |
| `tests/` | {if exists: Test files} |
| `lib/` | {if exists: Library code} |

## Architecture

{If deep analysis was performed, include:}

### Style
{Architecture style from code-explorer: e.g., Layered, Microservices, Monolith, MVC}

### Layers
| Layer | Directory | Purpose |
|-------|-----------|---------|
| {layer} | {path} | {purpose} |

### Key Patterns
- {Pattern 1}: {where used}
- {Pattern 2}: {where used}

{If quick analysis, leave this section with placeholder:}
Run `/dev-workflow:init` with "Deep" analysis to populate this section.

## Conventions

### Naming
{Add project-specific naming conventions}

### Code Style
{Add code style guidelines or reference to config files like .eslintrc, .prettierrc}

### Testing
{Add testing conventions - coverage requirements, test file naming}

### Git
{Add git conventions - branch naming, commit message format}

## Build Commands

| Command | Purpose |
|---------|---------|
| `{detected build command}` | Build the project |
| `{detected test command}` | Run tests |
| `{detected lint command}` | Run linter |

## Notes

{Space for additional project-specific notes}
```

### 5. Output summary

Display a summary to the user:

```
## dev-workflow initialized

### Detected Stack
- Language: {languages}
- Framework: {frameworks}
- Testing: {test frameworks}

{If deep analysis was performed:}
### Architecture (from deep analysis)
- Style: {architecture style}
- Patterns: {N} identified
- Conventions: {M} extracted

### Created Structure
.dev/
├── specs/
├── changes/
├── archive/
└── project.md

### Next Steps
1. Review and complete .dev/project.md with your project conventions
2. Run /dev-workflow:proposal <description> to create your first change
```

## Notes

- If no tech stack is detected, create the structure anyway with a generic `project.md`
- Look for existing specs in comments/docs that could be migrated to `.dev/specs/`
- Suggest adding `.dev/` to version control (it's meant to be shared)
