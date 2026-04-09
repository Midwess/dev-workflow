---
name: proposal
description: Create or refine a dev-workflow change proposal in Codex. Use when the user types $dev-workflow:proposal, asks to create a proposal, wants a new .dev/changes/<change-id>/ plan, or needs proposal.md, analysis.md, blueprint.md, tasks.md, or delta specs generated from a feature request.
---

# Proposal Skill

Use this skill to drive the dev-workflow proposal phase in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:proposal`
- the user asks to create a change proposal
- the user wants a new `.dev/changes/<change-id>/`
- the user wants `proposal.md`, `analysis.md`, `blueprint.md`, `tasks.md`, or delta specs generated

If the request is about implementing an existing proposal rather than creating one, do not use this skill as the primary workflow.

## Workflow

1. Validate that `.dev/project.md` exists.
   If it does not exist, bootstrap a minimal dev-workflow workspace first:
   - create `.dev/specs/`
   - create `.dev/changes/`
   - create `.dev/archive/`
   - create `.dev/project.md`
   - detect the repository tech stack and record it in `.dev/project.md`

2. Turn the request into a concise kebab-case `change-id`.
   Keep it short and descriptive.
   If the directory already exists, append a numeric suffix.

3. Read the minimum context needed:
   - `.dev/project.md`
   - relevant `.dev/specs/**/*.md`
   - nearby code and config files for the affected area

4. For non-trivial changes, delegate analysis:
   - use `code-explorer` to map affected files, conventions, and dependencies
   - use `code-architect` to produce an implementation blueprint and task breakdown

5. Create or update:
   - `.dev/changes/<change-id>/proposal.md`
   - `.dev/changes/<change-id>/analysis.md`
   - `.dev/changes/<change-id>/blueprint.md`
   - `.dev/changes/<change-id>/tasks.md`
   - `.dev/changes/<change-id>/specs/<domain>/spec.md`
   - optionally `.dev/changes/<change-id>/design.md` for complex changes

6. Default the proposal to `Status: draft`.

7. End with:
   - the generated `change-id`
   - the files created or updated
   - whether `.dev/` had to be bootstrapped first
   - the next step: review the proposal and change `Status: draft` to `Status: approved` before implementation

## Output Expectations

### proposal.md

Include:
- title
- status
- summary
- motivation
- scope
- risks
- dependencies

### analysis.md

Summarize:
- similar features
- affected files
- architecture notes
- conventions to follow
- risks and dependencies

### blueprint.md

Summarize:
- design approach
- files to create or modify
- implementation phases
- testing strategy

### tasks.md

Use markdown checkboxes and a progress header:

```md
## Progress: [0/N]

- [ ] 1.1 ...
- [ ] 1.2 ...
```

Tasks should be ordered, concrete, and implementation-ready.

### Delta spec

Use OpenSpec delta sections:
- `## ADDED Requirements`
- `## MODIFIED Requirements`
- `## REMOVED Requirements`

Each requirement should include scenarios with `WHEN` and `THEN`.

## Guidance

- Prefer one proposal per change.
- Keep the proposal scoped enough to implement in ordered tasks.
- If the request is ambiguous, ask one concise clarifying question or make a reasonable assumption and record it in `proposal.md`.
- If no obvious spec domain exists, create one that matches the feature area.

## Related Files

- Read [../openspec-workflow/SKILL.md](../openspec-workflow/SKILL.md) for the overall dev-workflow model.
- Read [../openspec-workflow/spec-format.md](../openspec-workflow/spec-format.md) for requirement formatting.
- Read [../openspec-workflow/delta-format.md](../openspec-workflow/delta-format.md) for delta rules.
