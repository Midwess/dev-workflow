# Tasks: add-codex-plugin-support

## Progress: [0/10]

## 1. Establish Runtime Packaging

- [ ] 1.1 Add or validate Codex marketplace registration in `.agents/plugins/marketplace.json`
- [ ] 1.2 Add or validate Codex package metadata in `plugins/dev-workflow-codex/.codex-plugin/plugin.json`
- [ ] 1.3 Review Claude plugin metadata changes required by the dual-runtime suite

## 2. Port Workflow Surfaces To Codex

- [ ] 2.1 Add the core workflow command set under `plugins/dev-workflow-codex/commands/`
- [ ] 2.2 Add the proposal and review agent set under `plugins/dev-workflow-codex/agents/`
- [ ] 2.3 Add the OpenSpec skill payload under `plugins/dev-workflow-codex/skills/openspec-workflow/`

## 3. Document Dual-Runtime Usage

- [ ] 3.1 Update `README.md` with distinct Claude Code and Codex installation flows
- [ ] 3.2 Update `CONTRIBUTING.md` and `CLAUDE.md` with runtime-specific file ownership and versioning guidance
- [ ] 3.3 Add or refine `plugins/dev-workflow-codex/README.md` and Claude plugin docs to explain package boundaries

## 4. Verify And Reconcile

- [ ] 4.1 Verify both marketplace manifests point to valid plugin roots
- [ ] 4.2 Review docs for consistent runtime terminology and explicit hook limitations
- [ ] 4.3 Reconcile already-present worktree changes against these tasks before approval/apply

---

## Notes

The active worktree already contains initial Codex support changes. Task completion should be reconciled against that work before moving this proposal from draft to approved.
