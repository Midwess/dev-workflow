---
name: minimax-codegen
description: Use Minimax as a single-file code generator in Codex. Use when the user types $dev-workflow:minimax-codegen, gives a file path plus an intention for that file, or wants Minimax to rewrite a specific file without a long analysis or review.
---

# Minimax Codegen Skill

Use this skill to update one file by prompting Minimax with the exact file path, the current file contents, and the user's intended outcome.

## When to Use

Use this skill when:
- the user types `$dev-workflow:minimax-codegen`
- the user gives a file path and asks Minimax to change that file
- the user wants intention-driven code generation instead of a detailed edit plan
- the user wants Minimax to generate code directly and concisely without extra review text

## Workflow

1. Require one exact target file path. Do not guess the path.
2. If the path is relative, resolve it from the repo root and then use that exact resolved path in the Minimax prompt.
3. Read the current contents of that file before prompting Minimax.
4. If the file does not exist, stop and ask for the correct path instead of guessing.
5. Recommend an intention-focused request:
   - the user does not need to specify exact code edits
   - the user should describe what they want the file to accomplish
6. Build the Minimax prompt so it includes:
   - the exact file path
   - the current file contents
   - the user's detailed intention
   - instructions to modify only that file
   - a strict output contract
7. Run Minimax through the local `claude` CLI with:
   - `ANTHROPIC_AUTH_TOKEN="$MINIMAX_API_KEY"`
   - `ANTHROPIC_BASE_URL="https://api.minimax.io/anthropic"`
   - `ANTHROPIC_MODEL="MiniMax-M2.7-highspeed"`
   - `claude -p "$prompt" --output-format text | json-stream`
8. If `json-stream` fails, keep the raw `claude` output instead of discarding it.
9. Apply the generated output only to the target file.

## Prerequisites

Require `MINIMAX_API_KEY` in the environment before running the request.

If the key is missing, tell the user to export it first:

```bash
export MINIMAX_API_KEY="..."
```

Use a shell-safe check if verification is needed:

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

## Prompting Rules

Tell Minimax these points explicitly:
- use the exact file path provided
- modify only that file
- output the full updated file contents first
- then give a very short summary of what changed
- no long explanation
- no code review
- no extra checks

Use a prompt with this shape:

````text
You are updating exactly one file.

Target file path: /absolute/path/to/file.ext

User intention:
<detailed intention>

Current file contents:
```language
<current file contents>
```

Requirements:
- Modify only this file.
- Use the exact target file path above.
- Do not ask follow-up questions.
- Do not review or analyze the code.
- Do not explain at length.
- Do not check the code.
- Just generate the change.
- Keep the response concise.
- First output the full final contents for the target file.
- After that, output a very short summary of what changed.
````

The request to Minimax should describe intent clearly, but does not need to specify the exact code diff.

## Output

End with:
- the exact file path used
- whether the file was updated
- the concise Minimax change summary
