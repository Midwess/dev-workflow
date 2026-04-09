# Blueprint: add-codex-plugin-support

## Design Summary

Adopt a dual-runtime packaging model:

1. Claude Code continues to load `dev-workflow` from `plugins/dev-workflow/` through `.claude-plugin/marketplace.json`.
2. Codex loads `dev-workflow` from `plugins/dev-workflow-codex/` through `.agents/plugins/marketplace.json`.
3. Shared workflow concepts stay aligned, but runtime-specific packaging, docs, and constraints remain explicit.

## Files To Create Or Modify

| Area | Action |
|------|--------|
| `.agents/plugins/marketplace.json` | Register the Codex package root |
| `plugins/dev-workflow-codex/.codex-plugin/plugin.json` | Define Codex package metadata and capabilities |
| `plugins/dev-workflow-codex/commands/` | Provide the Codex workflow command surface |
| `plugins/dev-workflow-codex/agents/` | Provide proposal/review agent prompts suited to Codex |
| `plugins/dev-workflow-codex/skills/openspec-workflow/` | Carry shared OpenSpec references and templates into Codex |
| `plugins/dev-workflow/README.md` | Clarify Claude-specific installation and the Codex companion package |
| `README.md`, `CONTRIBUTING.md`, `CLAUDE.md` | Document dual-runtime usage and maintenance responsibilities |
| `.dev/project.md` | Record the architecture shift and runtime conventions |

## Implementation Phases

### 1. Runtime Packaging

- Define Codex marketplace registration in `.agents/plugins/marketplace.json`
- Validate the Codex package manifest and package root structure
- Keep the Claude plugin manifest valid after suite-level documentation changes

### 2. Workflow Surface Parity

- Populate `plugins/dev-workflow-codex/commands/` with the core workflow commands
- Populate `plugins/dev-workflow-codex/agents/` with the planning and review agents needed for proposal/apply/review flows
- Carry the shared OpenSpec skill content into the Codex plugin package

### 3. Documentation And Maintainer Guidance

- Split installation guidance by runtime in root docs
- Document runtime-specific manifest ownership and marketplace files
- Explain that hooks remain Claude-specific unless Codex-specific automation is added later

### 4. Verification

- Confirm both marketplace manifests point to valid plugin roots
- Review Claude and Codex docs for consistent terminology and capability claims
- Reconcile current worktree changes against the proposal tasks before approval/apply

## Risks And Mitigations

| Risk | Mitigation |
|------|------------|
| Codex package diverges from the intended workflow semantics | Use the Claude plugin surface as the baseline and verify command coverage explicitly |
| Release metadata is updated for only one runtime | Treat both manifests as part of release review and document ownership clearly |
| Users cannot tell which plugin root applies to their tool | Keep install steps and marketplace paths separated in every top-level doc |
