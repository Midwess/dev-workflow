---
description: Create a new change proposal
argument-hint: <change-description>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git:*), Bash(ls:*), Bash(date:*), Task(code-explorer), Task(code-architect)
---

Create a new change proposal in `.dev/changes/` with specs, tasks, and optional design doc.

## Input

`$ARGUMENTS` - Description of the change to propose (e.g., "Add user authentication with OAuth")

## Steps

### 1. Validate `.dev/` exists

Check if `.dev/project.md` exists:
- If not, inform user: "Run `/dev-workflow:init` first to initialize the dev-workflow structure."
- Stop if not initialized

### 2. Grilling session

Before any code scanning or ID generation, align on exactly what is being built.

Load `CONTEXT.md` from the repo root if it exists — use its vocabulary throughout. If a term the user uses conflicts with a definition in `CONTEXT.md`, surface it immediately.

Interview the user **one question at a time**. Provide your recommended answer for each question before waiting for their response. Cover:

1. **Problem** — What specific problem does this solve? Who experiences it?
2. **Scope** — What is explicitly in scope? What is explicitly out of scope?
3. **Terminology** — Are there domain terms being used that need a precise definition? Challenge vague or overloaded words.
4. **Affected areas** — Which parts of the system will likely change? (Probe, don't assert — the code scan confirms.)
5. **Edge cases** — What happens in the failure/edge case for the most important scenario?
6. **Trade-offs** — Are there architectural choices with real alternatives? (If yes, may warrant an ADR.)

**Rules during grilling:**
- If a question can be answered by quickly reading the codebase, do so instead of asking
- When a term is resolved, update `CONTEXT.md` immediately (create it if it doesn't exist)
- Offer to write an ADR only when a decision is: hard to reverse + surprising without context + result of a real trade-off. Skip otherwise.
- Stop grilling when scope and language are unambiguous — do not over-interview

**At the end of grilling, produce a brief Grilling Summary:**
```
## Grilling Summary

**Problem**: {one sentence}
**In scope**: {bullet list}
**Out of scope**: {bullet list}
**Key terms resolved**: {term: definition, ...}
**ADRs created**: {list or "none"}
**Sharpened description**: {refined version of $ARGUMENTS if it changed}
```

Ask the user to confirm the summary before proceeding.

### 3. Generate change ID

Create a kebab-case ID from the **sharpened description** from the grilling summary (fall back to `$ARGUMENTS` if unchanged):
- "Add user authentication" → `add-user-authentication`
- "Fix login bug in dashboard" → `fix-login-bug-in-dashboard`
- Keep it concise (max ~5 words)

Check if `.dev/changes/{change-id}/` already exists:
- If exists, append numeric suffix: `add-user-auth-2`

### 4. Codebase Analysis (AI-Assisted)

Gather deep context using specialized agents. The grilling summary narrows the scope — pass it to both agents.

#### 4.1 Invoke code-explorer Agent

Launch the `code-explorer` agent with:
- **Input**: sharpened description + grilling summary (scope, affected areas, key terms)
- **Scope**: Identify relevant areas informed by grilling outcomes
- **Context**: `.dev/project.md` if exists

The agent will analyze the codebase and return `OUTPUT_CODEBASE_ANALYSIS` containing:
- Similar features found in the codebase
- Architecture layers relevant to this change
- Dependencies (internal, external, configuration)
- Conventions to follow (naming, testing, error handling)
- OpenSpec integration notes (affected domains, existing specs)

#### 4.2 Invoke code-architect Agent

Launch the `code-architect` agent with:
- **Input**: sharpened description + grilling summary + `OUTPUT_CODEBASE_ANALYSIS`
- **Context**: `.dev/project.md`, existing `.dev/specs/`

The agent will design the architecture and return `OUTPUT_ARCHITECTURE_BLUEPRINT` containing:
- Component designs with interfaces
- Files to create/modify/review
- Implementation phases with ordered tasks
- Delta spec structure recommendations
- Risks and mitigations

#### 4.3 Apply Agent Outputs

Use the analysis to inform proposal generation:
- **proposal.md**: Use blueprint's affected areas, risks, dependencies — and grilling summary for scope/motivation
- **tasks.md**: Use blueprint's implementation phases and task hints
- **delta specs**: Use blueprint's OpenSpec integration recommendations; use `CONTEXT.md` terms in scenario language
- **design.md**: Use blueprint's component designs (if complex change)

#### 4.4 Fallback (if agents unavailable)

If agents cannot be invoked, gather information manually:
- Read `.dev/project.md` for tech stack and conventions
- Read existing `.dev/specs/` for current requirements
- Scan codebase for files that might be affected
- Check recent git history for related changes

#### 4.5 Save analysis.md

Save the code-explorer output to `.dev/changes/{change-id}/analysis.md`.

This file documents:
- Codebase analysis findings
- Similar features found
- Architecture and patterns
- Dependencies identified
- Conventions to follow

#### 4.6 Save blueprint.md

Save the code-architect output to `.dev/changes/{change-id}/blueprint.md`.

This file documents:
- Design summary and decisions
- Files to create/modify/review
- Implementation phases
- Interface specifications
- Risks and mitigations

#### 4.7 Update project.md

Append/update the "Latest Analysis" section in `.dev/project.md` with:
- Architecture summary from code-explorer
- Key patterns discovered
- Conventions extracted

### 5. Create change folder structure

```
.dev/changes/{change-id}/
├── proposal.md          # Why and what (Status: draft)
├── analysis.md          # Codebase analysis from code-explorer
├── blueprint.md         # Architecture blueprint from code-architect
├── tasks.md             # Implementation checklist
├── design.md            # Technical decisions (only if complex)
└── specs/
    └── {domain}/
        └── spec.md      # Delta specification
```

Use Bash:
```bash
mkdir -p .dev/changes/{change-id}/specs
```

### 6. Generate `proposal.md`

Create `.dev/changes/{change-id}/proposal.md`:

```markdown
# Proposal: {Title from description}

**Status**: draft

## Summary

{1-2 sentence summary of what this change does}

## Motivation

{Why this change is needed - problem being solved}

## Scope

### In Scope

- {What will be implemented}
- {Features being added}

### Out of Scope

- {What will NOT be part of this change}
- {Future work being deferred}

## Affected Areas

| Area | Impact |
|------|--------|
| {file/module} | {what changes} |

## Dependencies

- {Prerequisites if any}

## Risks

| Risk | Mitigation |
|------|------------|
| {potential issue} | {how to handle} |
```

### 7. Generate `tasks.md`

Create `.dev/changes/{change-id}/tasks.md`:

```markdown
# Tasks: {change-id}

## Progress: [0/N]

## 1. {First Phase}

- [ ] 1.1 {First task}
- [ ] 1.2 {Second task}

## 2. {Second Phase}

- [ ] 2.1 {Task}
- [ ] 2.2 {Task}

## 3. Testing

- [ ] 3.1 Write unit tests
- [ ] 3.2 Write integration tests
- [ ] 3.3 Manual verification

## 4. Documentation

- [ ] 4.1 Update code comments
- [ ] 4.2 Update README if needed

---

## Notes

{Implementation notes will be added here during development}
```

Break down the change into logical phases and tasks. Each task should be:
- Specific and actionable
- Small enough to complete in one session
- Independently verifiable

### 8. Generate delta specs

Identify which spec domains are affected and create delta files.

For each affected domain, create `.dev/changes/{change-id}/specs/{domain}/spec.md`:

```markdown
# Delta for {Domain}

## ADDED Requirements

### Requirement: {New Requirement Name}

The system SHALL {behavior description}.

#### Scenario: {Success case}

- WHEN {condition}
- THEN {expected result}

#### Scenario: {Failure case}

- WHEN {failure condition}
- THEN {expected error handling}

## MODIFIED Requirements

### Requirement: {Existing Requirement Name}

{Complete updated requirement text - not just the changes}

#### Scenario: {Updated scenario}

- WHEN {new condition}
- THEN {new result}

## REMOVED Requirements

### Requirement: {Requirement being removed}

Reason: {Why this is being removed}
```

**Delta guidelines:**
- ADDED: New capabilities being introduced
- MODIFIED: Include the COMPLETE requirement text, not just changes
- REMOVED: Include reason for removal
- Reference the spec-format.md and delta-format.md in skills for format details

### 9. Generate `design.md` (if complex)

Only create if the change involves:
- New architecture patterns
- Database schema changes
- API design decisions
- Performance considerations
- Security implications

```markdown
# Design: {change-id}

## Overview

{High-level technical approach}

## Architecture

{Diagram or description of system changes}

## Key Decisions

### Decision 1: {Title}

**Context:** {Why this decision is needed}
**Options:**
1. {Option A} - {pros/cons}
2. {Option B} - {pros/cons}
**Decision:** {Chosen option and rationale}

## Data Model

{Schema changes if any}

## API Changes

{Endpoint changes if any}

## Security Considerations

{Security implications and mitigations}
```

### 10. Output summary

```
## Proposal Created: {change-id}

**Status**: draft (requires approval before implementation)

### Files Created
- .dev/changes/{change-id}/proposal.md (Status: draft)
- .dev/changes/{change-id}/analysis.md (codebase analysis)
- .dev/changes/{change-id}/blueprint.md (architecture plan)
- .dev/changes/{change-id}/tasks.md
- .dev/changes/{change-id}/specs/{domain}/spec.md
{- .dev/changes/{change-id}/design.md (if created)}
{- CONTEXT.md (created/updated during grilling)}

### Summary
{Brief summary of the proposal}

### Tasks
{N} tasks across {M} phases

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
```

## Notes

- Keep proposals focused - one feature/fix per proposal
- If the change is large, consider splitting into multiple proposals
- Specs should be written from the user/system perspective, not implementation details
- Tasks should be ordered by dependency (prerequisites first)
