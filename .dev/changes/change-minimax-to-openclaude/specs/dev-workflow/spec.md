# Delta for dev-workflow

## MODIFIED Requirements

### Requirement: Minimax Text Command

The system SHALL provide a command that routes text requests through the local `openclaude` CLI using Minimax's Anthropic-compatible API endpoint.

#### Scenario: Running a text request

- WHEN the user invokes `/dev-workflow:openclaude <request>`
- THEN the system SHALL run `openclaude -p "$request"` with `ANTHROPIC_AUTH_TOKEN`, `ANTHROPIC_BASE_URL`, and `ANTHROPIC_MODEL` environment variables set appropriately
- AND pipe the output to `json-stream` when available

#### Scenario: Missing API key

- WHEN the user invokes `/dev-workflow:openclaude` without `MINIMAX_API_KEY` set
- THEN the system SHALL instruct the user to export the key first

### Requirement: Minimax Codegen Skill

The system SHALL provide a skill that uses Minimax as a single-file code generator via the local `openclaude` CLI.

#### Scenario: Single-file code generation

- WHEN the user provides a file path and intention via `$dev-workflow:openclaude-codegen`
- THEN the system SHALL run Minimax through the local `openclaude` CLI (not `claude`)
- AND apply the generated output only to the target file

### Requirement: Video Generation Skill

The system SHALL provide a video generation skill that uses Minimax's video API and polls for completion.

#### Scenario: Video generation prerequisites

- WHEN the skill is invoked
- THEN it SHALL verify `MINIMAX_API_KEY` is set before making API calls

### Requirement: Image Generation Skill

The system SHALL provide an image generation skill that uses Minimax's image API.

#### Scenario: Image generation prerequisites

- WHEN the skill is invoked
- THEN it SHALL verify `MINIMAX_API_KEY` is set before making API calls
