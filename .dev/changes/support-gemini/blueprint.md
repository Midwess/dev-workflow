# Blueprint: support-gemini

## Design Summary

Extend the repository's runtime-support model to Gemini by treating the current `plugins/dev-workflow/.gemini-plugin/` directory as the initial implementation seed. Confirm the exact Gemini packaging contract first, then complete the missing metadata/configuration, keep Gemini-specific automation isolated, and update documentation so supported behavior is explicit.

## Files To Create Or Modify

| Area | Action |
|------|--------|
| `plugins/dev-workflow/.gemini-plugin/` | Add the Gemini runtime metadata/configuration and complete the supported hook assets |
| `plugins/dev-workflow/hooks/` | Use as the reference behavior set for parity and divergence decisions |
| `plugins/dev-workflow/README.md` | Explain Gemini support, layout, and runtime boundaries |
| `README.md` | Add Gemini to top-level install and support guidance |
| `CONTRIBUTING.md` | Document how maintainers should update and test Gemini support |
| `CLAUDE.md` | Record file ownership and runtime-specific maintenance guidance |
| `.dev/project.md` | Update the architecture notes after implementation if support is approved |

## Implementation Phases

### 1. Confirm Gemini Packaging Contract

- Identify the Gemini runtime metadata or registration files required by the target environment
- Decide whether the existing `.gemini-plugin/` layout is sufficient or whether Gemini needs a dedicated package root

### 2. Complete Gemini Runtime Assets

- Audit the existing Gemini hook files against the supported workflow surface
- Add any missing Gemini-specific metadata, configuration, or prompt files
- Keep Gemini-specific behavior isolated from Claude and Codex files unless shared docs or version metadata must change

### 3. Update Documentation And Maintainer Guidance

- Add Gemini install/use guidance to repo and plugin docs
- Document which behavior is shared across Claude Code, Codex, and Gemini
- Call out Gemini limitations or partial parity explicitly

### 4. Verification

- Verify all Gemini-referenced files exist and point to valid local assets
- Review documentation for accurate runtime terminology and setup instructions
- Reconcile the final runtime model with any adjacent active proposals before approval

## Testing Strategy

- Validate the Gemini runtime asset tree against the confirmed packaging contract
- Smoke test the supported Gemini workflow entrypoints or hook triggers, if the Gemini environment is available locally
- Review docs and runtime comparisons for consistency across Claude Code, Codex, and Gemini
