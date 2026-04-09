# Delta for Plugin Distribution

## ADDED Requirements

### Requirement: Separate Runtime Plugin Roots
The system SHALL package Claude Code and Codex support in separate plugin roots while preserving the same `dev-workflow` workflow identity.

#### Scenario: Claude Code installation
- GIVEN the repository is used from Claude Code
- WHEN the user installs `dev-workflow` from `.claude-plugin/marketplace.json`
- THEN the plugin source SHALL resolve to `plugins/dev-workflow`
- AND Claude-specific hooks SHALL remain isolated to that runtime package

#### Scenario: Codex installation
- GIVEN the repository is used from Codex
- WHEN the user installs `dev-workflow` from `.agents/plugins/marketplace.json`
- THEN the plugin source SHALL resolve to `plugins/dev-workflow-codex`
- AND Codex-specific commands, agents, and skills SHALL be loaded from that package

### Requirement: Runtime-Specific Marketplace Registration
The system SHALL expose a dedicated marketplace manifest for each supported runtime.

#### Scenario: Separate manifests
- WHEN a maintainer inspects repository metadata
- THEN Claude Code registration SHALL live in `.claude-plugin/marketplace.json`
- AND Codex registration SHALL live in `.agents/plugins/marketplace.json`

#### Scenario: Stable plugin identity
- WHEN a user installs `dev-workflow` in either runtime
- THEN the displayed plugin name SHALL remain `dev-workflow`
- AND the runtime-specific manifest SHALL describe the correct package root

### Requirement: Runtime-Aware Documentation
The system SHALL document installation and maintenance steps separately for Claude Code and Codex.

#### Scenario: Installation guidance
- WHEN a user reads the root documentation
- THEN the documentation SHALL provide distinct install flows for Claude Code and Codex
- AND identify the runtime-specific marketplace and manifest files

#### Scenario: Maintainer guidance
- WHEN a contributor updates plugin metadata or docs
- THEN the documentation SHALL identify which runtime manifest must be changed
- AND call out any runtime-specific limitations such as Claude-only hooks
