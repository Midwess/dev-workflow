---
name: minimax-codegen
description: Use Minimax as a single-file code generator in OpenClaude. Use when the user gives a file path plus an intention for that file and wants Claude to return a concise ready-to-run command instead of a long explanation.
---

# Minimax Codegen Skill

Use this skill to prepare one `openclaude` command for one file.

Claude should stay terse:
- default to returning only the command
- add one short blocking note only when the command cannot be run yet
- no long analysis, plan, or review

Treat Minimax like a junior dev:
- be explicit about the exact file
- give direct instructions
- keep scope narrow
- do not ask it to explore, review, or think out loud
- always tell it to respond concisely and not talk much

## When to Use

Use this skill when:
- the user gives a file path and asks Minimax to change that file
- the user wants intention-driven code generation instead of a detailed edit plan
- the user wants Claude to reply with a ready-to-run command, not a long explanation

## Workflow

1. Require one exact target file path. Do not guess the path.
2. If the path is relative, resolve it from the repo root and then use that exact resolved path in the Minimax prompt.
3. Read the current contents of that file before prompting Minimax.
4. If the file does not exist, stop and ask for the correct path instead of guessing.
5. Turn the user's intention into short direct instructions. Do not over-specify the diff unless needed.
6. Build the Minimax prompt so it includes:
   - the exact file path
   - the current file contents
   - the user's intended outcome
   - instructions to modify only that file
   - a strict output contract
7. Default Claude output should be the ready-to-run command only. Avoid extra prose.
8. Run Minimax through the local `openclaude` CLI with:
   - `ANTHROPIC_AUTH_TOKEN="$MINIMAX_API_KEY"`
   - `ANTHROPIC_BASE_URL="https://api.minimax.io/anthropic"`
   - `ANTHROPIC_MODEL="MiniMax-M2.7-highspeed"`
   - `openclaude -p "$prompt" --output-format=text`
9. If `text` fails, keep the raw `openclaude` output instead of discarding it.
10. Apply the generated output only to the target file.

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
- `openclaude`

## Prompting Rules

Tell Minimax these points explicitly:
- you are a junior dev updating exactly one file
- use the exact file path provided
- modify only that file
- do not explore outside the task
- output the full updated file contents first
- then give a very short summary
- no long explanation
- no code review
- no extra checks
- keep the response concise
- do not talk much

Use a prompt with this shape:

````text
You are a junior dev updating exactly one file.

Target file path: /absolute/path/to/file.ext

Task:
<short direct instruction from the user's intention>

Current file contents:
```language
<current file contents>
```

Requirements:
- Modify only this file.
- Use the exact target file path above.
- Do not ask follow-up questions.
- Do not review or analyze the code.
- Do not explain your reasoning.
- Do not check the code.
- Just generate the change.
- Keep the response concise. Do not talk much.
- First output the full final contents for the target file.
- After that, output a very short summary of what changed.
````

The request to Minimax should describe intent clearly, but does not need to specify the exact code diff.

## Output

Default Claude output:
- the command only
- if blocked, one short sentence saying what is missing
