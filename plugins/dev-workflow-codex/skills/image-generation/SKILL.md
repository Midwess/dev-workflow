---
name: image-generation
description: Generate images through the Minimax image_generation API in Codex. Use when the user types $dev-workflow:image-generation, asks to create images from a prompt, or wants Minimax image URLs returned from a direct API call.
---

# Image Generation Skill

Use this skill to generate images through the Minimax image API in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:image-generation`
- the user wants an image generated from a prompt
- the user wants the agent to call Minimax directly with `curl`

## Workflow

1. Read [../../commands/image-generation.md](../../commands/image-generation.md) and use it as the detailed workflow.
2. Confirm the prompt and request options from the user input.
3. Verify `MINIMAX_API_KEY` with a simple shell-safe check if needed.
4. Use the Minimax `curl --request POST https://api.minimax.io/v1/image_generation` flow described in the command.
5. Parse successful responses from `data.image_urls` when `base_resp.status_code` is `0`.
6. Normalize returned `http://` image URLs to `https://` before presenting them.
7. Do not use `HEAD` requests to validate these signed URLs; use `GET` if validation is necessary.
8. If parsing utilities fail but the raw JSON clearly contains `data.image_urls`, still return those URLs instead of reporting a generation failure.

## Output

End with:
- the prompt used
- the request options used
- the generated image URLs or the relevant API error
- the success and failure counts when present in `metadata`
