---
description: Interactive wizard for creating change proposals
allowed-tools: Read, Write, Glob, Grep, Bash(git:*), Bash(ls:*), AskUserQuestion, Task(code-explorer), Task(code-architect)
---

Interactive wizard that guides you through creating a well-structured change proposal step by step.

## Overview

This wizard collects information through a series of questions, then generates a complete proposal with specs and tasks. Use this when you want guided help creating a proposal.

For quick proposals with a known description, use `/dev-workflow:proposal <description>` instead.

## Steps

### 1. Validate Setup

Check `.dev/` exists:
- If not: "Run `/dev-workflow:init` first."

### 2. Gather Basic Information

Use AskUserQuestion for each step:

**Step 1: Change Type**
```
What type of change is this?

Options:
- Feature: New functionality
- Fix: Bug fix or correction
- Refactor: Code improvement without behavior change
- Docs: Documentation only
- Test: Test additions or improvements
```

**Step 2: Title**
```
What's a brief title for this change?
(This will be used to generate the change-id)

Example: "Add user authentication with OAuth"
```

**Step 3: Motivation**
```
Why is this change needed?

Options:
- User request/feedback
- Bug report
- Technical debt
- Performance improvement
- Security requirement
- New feature requirement
- Other (explain)
```

**Step 4: Scope**
```
What's the scope of this change?

Options:
- Small: Single file or function, < 1 day
- Medium: Multiple files, 1-3 days
- Large: Multiple modules, 3+ days
- Epic: Cross-cutting, needs breakdown
```

### 3. Identify Affected Areas

**Step 5: Domains**
```
Which areas of the codebase will this affect?
(Select all that apply)

{Auto-detected from project structure:}
- [ ] auth - Authentication/authorization
- [ ] api - API endpoints
- [ ] ui - User interface
- [ ] db - Database/data layer
- [ ] utils - Utilities/helpers
- [ ] tests - Test infrastructure
- [ ] Other: ___
```

**Step 6: Related Files**
```
Do you know specific files that will be modified?

Options:
- Yes, let me list them
- No, discover during implementation
- Let me search the codebase first
```

If "Yes": Ask for file paths
If "Search": Help user search for relevant files

### 3.5 Intelligent Codebase Analysis

After gathering basic information (type, title, motivation, scope, domains, files), invoke the code-explorer agent to provide intelligent suggestions.

**Auto-invoke code-explorer:**

Display to user: "Analyzing codebase for relevant patterns..."

Launch the `code-explorer` agent with:
- **Input**: Collected information (type, title, motivation, scope, domains)
- **Scope**: Target areas identified from domains and files

The agent returns `OUTPUT_CODEBASE_ANALYSIS`.

**Save to analysis.md**: Store the output as `.dev/changes/{change-id}/analysis.md`

**Update project.md**: Append/update "Latest Analysis" section in `.dev/project.md`

Use the results to:
1. **Enhance Step 6** - Suggest specific files based on similar features found
2. **Prepare for requirements** - Share relevant patterns and conventions
3. **Inform architecture** - Pass analysis to code-architect agent

Display summary to user:
```
Analysis complete:
- Found {N} similar features in the codebase
- Identified {M} relevant patterns to follow
- {P} files likely affected
```

If user selected "Let me search the codebase first" in Step 6:
- Use code-explorer results to suggest specific files
- Display: "Based on analysis, these files are likely relevant:"
- List files from OUTPUT_CODEBASE_ANALYSIS

### 4. Define Requirements

**Step 7: Requirements Style**
```
How would you like to define requirements?

Options:
- Guided: Answer questions for each requirement
- Freeform: Describe in natural language, I'll structure it
- Skip: Generate basic specs, refine later
```

**If Guided:**
For each requirement:
```
Requirement 1:

What should the system do?
Example: "The system shall authenticate users via OAuth 2.0"

What triggers this behavior?
Example: "When a user clicks 'Login with Google'"

What's the expected result?
Example: "The system redirects to OAuth provider and returns a session token"

Any failure cases to handle?
Example: "If OAuth fails, show error message and log details"
```

Repeat until user says "done adding requirements"

### 4.5 Architecture Design

After requirements are defined, invoke the code-architect agent to design the implementation.

**Auto-invoke code-architect:**

Display to user: "Designing implementation architecture..."

Launch the `code-architect` agent with:
- **Input**: All collected information + `OUTPUT_CODEBASE_ANALYSIS`
- **Context**: `.dev/project.md`, existing specs

The agent returns `OUTPUT_ARCHITECTURE_BLUEPRINT`.

**Save to blueprint.md**: Store the output as `.dev/changes/{change-id}/blueprint.md`

Display summary to user:
```
Architecture designed:
- {N} new files to create
- {M} existing files to modify
- {P} implementation phases
- Estimated complexity: {Low/Medium/High}
```

Use the blueprint to:
1. **Pre-populate task planning** - Default tasks from blueprint
2. **Inform preview** - Show architectural decisions
3. **Generate design.md** - Use component designs if complex

**If Freeform:**
```
Describe what this change should do in your own words.
I'll convert it into structured requirements.

Example:
"Users should be able to log in with Google or GitHub.
After successful login, they get a JWT token.
If login fails, we should show a friendly error message
and log the details for debugging."
```

### 5. Plan Tasks

**Step 8: Task Planning**
```
How should I break down the tasks?

Options:
- AI-assisted (recommended): Use code-architect blueprint
- Auto-generate: Based on requirements and scope
- Guided: Walk through each phase
- Custom: You provide the task list
```

**If AI-assisted (recommended):**
- Use tasks from `OUTPUT_ARCHITECTURE_BLUEPRINT`
- Display the proposed phases and tasks
- Allow user to modify before confirming

**If Guided:**
```
Phase 1: Setup
What setup tasks are needed?
- Database changes?
- New dependencies?
- Configuration?

Phase 2: Implementation
What are the core implementation tasks?

Phase 3: Testing
What testing is needed?
- Unit tests?
- Integration tests?
- Manual verification?

Phase 4: Documentation
What documentation updates are needed?
```

### 6. Review and Confirm

**Step 9: Preview**
Display the generated proposal:

```
## Proposal Preview

### Title
{title}

### Type
{type}

### Summary
{generated summary}

### Scope
{scope} - Estimated {X} tasks

### Domains Affected
- {domain1}
- {domain2}

### Requirements
1. {requirement 1 summary}
2. {requirement 2 summary}

### Tasks (Preview)
1. Setup
   - 1.1 {task}
2. Implementation
   - 2.1 {task}
3. Testing
   - 3.1 {task}

---

Options:
1. Create proposal
2. Edit requirements
3. Edit tasks
4. Start over
5. Cancel
```

### 7. Generate Proposal

When confirmed, generate all files:
- `.dev/changes/{change-id}/proposal.md` (with **Status**: draft)
- `.dev/changes/{change-id}/analysis.md` (from code-explorer)
- `.dev/changes/{change-id}/blueprint.md` (from code-architect)
- `.dev/changes/{change-id}/tasks.md`
- `.dev/changes/{change-id}/specs/{domain}/spec.md` for each domain
- `.dev/changes/{change-id}/design.md` if large/epic scope

### 8. Final Output

```
## Proposal Created: {change-id}

**Status**: draft (requires approval before implementation)

### Files Generated
- proposal.md (Status: draft)
- analysis.md (codebase analysis)
- blueprint.md (architecture plan)
- tasks.md
- specs/{domains}/spec.md

### Summary
{brief summary}

### Next Steps

1. **Review** the generated documents:
   - `analysis.md` - Is the codebase analysis accurate?
   - `blueprint.md` - Is the architecture approach correct?
   - `tasks.md` - Are the tasks complete and ordered correctly?
   - `specs/` - Are the requirements correctly defined?

2. **Adjust** any files as needed

3. **Approve** by changing Status in proposal.md:
   ```
   **Status**: approved
   ```

4. **Implement** with:
   ```
   /dev-workflow:apply {change-id}
   ```

Note: /apply will not proceed until the proposal is approved.

### Quick Commands
- View: /dev-workflow:show {change-id}
- Apply: /dev-workflow:apply {change-id} (after approval)
- Edit: Open .dev/changes/{change-id}/ in editor
```

## Wizard Flow Diagram

```
Start
  │
  ▼
[Type] → [Title] → [Motivation] → [Scope]
                                     │
                                     ▼
                              [Affected Domains]
                                     │
                                     ▼
                              [Related Files]
                                     │
                                     ▼
                         *** code-explorer ***
                         (Analyzes codebase)
                                     │
                                     ▼
                        ┌────────────┼────────────┐
                        │            │            │
                     Guided      Freeform       Skip
                        │            │            │
                        ▼            ▼            ▼
                 [Requirements defined in chosen style]
                                     │
                                     ▼
                         *** code-architect ***
                         (Designs architecture)
                                     │
                                     ▼
                  ┌──────────┬───────┼───────┬──────────┐
                  │          │       │       │          │
              AI-assist    Auto   Guided   Custom
                  │          │       │       │
                  ▼          ▼       ▼       ▼
                    [Tasks planned in chosen style]
                                     │
                                     ▼
                               [Preview]
                                     │
                          ┌──────────┼──────────┐
                          │          │          │
                       Create      Edit       Cancel
                          │          │
                          ▼          └──→ (back to edit step)
                    [Generate Files]
                          │
                          ▼
                        Done
```

## Notes

- Wizard is interactive - waits for user input at each step
- Can go back to previous steps if needed
- Generates same output as `/dev-workflow:proposal`
- Better for first-time users or complex proposals
- Skip options available for experienced users
