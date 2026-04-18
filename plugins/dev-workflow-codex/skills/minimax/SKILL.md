---
name: minimax
description: Route a text request through the local Claude CLI using Minimax's Anthropic-compatible endpoint. Use when the user types $dev-workflow:minimax or asks to run a prompt through Minimax via the local claude command.
---

# Minimax Skill

Use this skill to run a text prompt through the local `claude` CLI against the Minimax Anthropic-compatible API.

## When to Use

Use this skill when:
- the user types `$dev-workflow:minimax`
- the user wants to run a prompt through Minimax
- the user wants the agent to use `claude` with Minimax endpoint overrides

## Workflow

1. Read [../../commands/minimax.md](../../commands/minimax.md) and use it as the detailed workflow.
2. Confirm the request text from the user input.
3. Verify `MINIMAX_API_KEY` with a simple shell-safe check if needed.
4. Run `claude` with:
   - `ANTHROPIC_AUTH_TOKEN="$MINIMAX_API_KEY"`
   - `ANTHROPIC_BASE_URL="https://api.minimax.io/anthropic"`
   - `ANTHROPIC_MODEL="MiniMax-M2.7-highspeed"`
5. Pipe the output to `json-stream` when available.
6. If `json-stream` fails, return or summarize the raw `claude` output instead.

## Output

End with:
- the request used
- whether `json-stream` parsing succeeded
- the resulting model output or the relevant error
