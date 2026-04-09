# Delta for Plugin Distribution

## ADDED Requirements

### Requirement: Gemini Runtime Assets
The system SHALL provide a Gemini-compatible runtime surface for `dev-workflow` using repository-local Gemini-specific assets.

#### Scenario: Gemini assets are discoverable
- WHEN a maintainer inspects the repository for Gemini support
- THEN the Gemini-specific files SHALL live in a dedicated Gemini-owned location
- AND that location SHALL contain the metadata, configuration, or hooks required for the supported Gemini workflow

#### Scenario: Shared workflow behavior is adapted safely
- WHEN a Gemini workflow capability corresponds to an existing Claude workflow hook
- THEN the Gemini implementation SHALL reuse or adapt that behavior through Gemini-owned files
- AND Gemini support SHALL not require editing Claude hook files in place to change Gemini-only behavior

### Requirement: Gemini Runtime Documentation
The system SHALL document how Gemini support fits alongside Claude Code and Codex.

#### Scenario: User-facing runtime guidance
- WHEN a user reads the repository or plugin documentation
- THEN the documentation SHALL identify Gemini as a supported or in-progress runtime explicitly
- AND it SHALL point to the Gemini-specific asset location and any setup prerequisites

#### Scenario: Maintainer-facing support boundaries
- WHEN a contributor updates runtime-specific workflow behavior
- THEN the documentation SHALL state whether the change applies to Claude Code, Codex, Gemini, or only a subset
- AND it SHALL call out Gemini limitations or partial parity explicitly
