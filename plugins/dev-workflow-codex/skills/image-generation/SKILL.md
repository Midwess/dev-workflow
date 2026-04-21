---
name: image-generation
description: Generate images through the Minimax image_generation API in Codex. Use when the user types $dev-workflow:image-generation, asks for text-to-image or image-to-image generation, or wants Minimax image URLs returned from a direct API call.
---

# Image Generation Skill

Use this skill to generate images through the Minimax image API in Codex.

## When to Use

Use this skill when:
- the user types `$dev-workflow:image-generation`
- the user wants an image generated from a prompt
- the user wants to generate a new image from a reference image
- the user wants the agent to call Minimax directly with `curl`

## Workflow

1. Read [../../commands/image-generation.md](../../commands/image-generation.md) and use it as the detailed workflow.
2. Confirm the prompt and request options from the user input.
3. Verify `MINIMAX_API_KEY` with a simple shell-safe check if needed.
4. For text-to-image requests, use the Minimax `curl --request POST https://api.minimax.io/v1/image_generation` flow described in the command.
5. For image-to-image requests, require the AWS CLI to be available, upload the source image into `s3://midwess/temporary/`, then use the resulting signed URL in `subject_reference[].image_file`.
6. Parse successful responses from `data.image_urls` when `base_resp.status_code` is `0`.
7. Normalize returned `http://` image URLs to `https://` before presenting them.
8. Do not use `HEAD` requests to validate these signed URLs; use `GET` if validation is necessary.
9. If parsing utilities fail but the raw JSON clearly contains `data.image_urls`, still return those URLs instead of reporting a generation failure.

## Samples

Use these two concrete samples when building the request.

### Text to Image

```bash
curl --request POST \
  --url https://api.minimax.io/v1/image_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "image-01",
    "prompt": "A man in a white t-shirt, full-body, standing front view, outdoors, with the Venice Beach sign in the background, Los Angeles. Fashion photography in 90s documentary style, film grain, photorealistic.",
    "aspect_ratio": "16:9",
    "response_format": "url",
    "n": 3,
    "prompt_optimizer": true
  }'
```

### Image to Image

```bash
curl --request POST \
  --url https://api.minimax.io/v1/image_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "model": "image-01",
    "prompt": "A girl looking into the distance from a library window",
    "aspect_ratio": "16:9",
    "subject_reference": [
      {
        "type": "character",
        "image_file": "https://cdn.hailuoai.com/prod/2025-08-12-17/video_cover/1754990600020238321-411603868533342214-cover.jpg"
      }
    ],
    "n": 2
  }'
```

For image-to-image generation, `subject_reference[0].image_file` should be a remote image URL.
When the source image is local, upload it to `s3://midwess/temporary/` first and use the presigned URL.

## Output

End with:
- the prompt used
- the request options used
- the source image path and signed S3 URL used when image-to-image generation was used
- the generated image URLs or the relevant API error
- the success and failure counts when present in `metadata`
