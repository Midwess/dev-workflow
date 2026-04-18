---
description: Send a text request through the Claude CLI using the Minimax Anthropic-compatible endpoint
argument-hint: <request>
allowed-tools: [Read, Write, Edit, Grep, Bash]
---

Run a user request through the local `claude` CLI while pointing it at Minimax's Anthropic-compatible API.

## Input

`$ARGUMENTS` - A required natural-language request to send to the model.

## Prerequisites

Require `MINIMAX_API_KEY` in the environment before running the request.

If the key is missing, tell the user to export it first:

```bash
export MINIMAX_API_KEY="..."
```

To verify the key, use a shell-safe check:

```bash
if [ -n "$MINIMAX_API_KEY" ]; then
  echo "MINIMAX_API_KEY is set"
else
  echo "MINIMAX_API_KEY is NOT set"
fi
```

Also require these commands to exist locally:
- `claude`
- `json-stream`

## Steps

### 1. Parse input

- Treat all of `$ARGUMENTS` as the request.
- If no request is supplied, ask the user for one concise prompt.

### 2. Build the command

Use this execution shape:

```bash
ANTHROPIC_AUTH_TOKEN="$MINIMAX_API_KEY" \
ANTHROPIC_BASE_URL="https://api.minimax.io/anthropic" \
ANTHROPIC_MODEL="MiniMax-M2.7-highspeed" \
claude -p "$request" --output-format text | json-stream
```

Do not single-quote a literal `'request'` string. Use the actual request value and shell-escape it safely.

### 3. Execute

Run the command with the environment overrides above.

### 4. Return the result

- If the command succeeds, return the parsed streamed output.
- If `json-stream` is unavailable or fails, rerun or summarize the raw `claude` text output instead of dropping the response.
- If `claude` returns an error, show the important stderr lines and confirm the Minimax endpoint and model that were used.

## Example

```text
$dev-workflow:minimax Summarize the architecture of this repository in five bullets.
```
