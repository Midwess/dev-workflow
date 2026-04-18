---
description: Generate images with the Minimax image_generation API
argument-hint: <prompt> [--aspect-ratio <ratio>] [--count <n>] [--response-format <url|base64>] [--no-prompt-optimizer]
allowed-tools: [Read, Write, Edit, Grep, Bash]
---

Generate one or more images with Minimax and return the API output to the user.

## Input

`$ARGUMENTS` - Options:
- `<prompt>` - Required image prompt
- `--aspect-ratio <ratio>` - Optional, defaults to `16:9`
- `--count <n>` - Optional, defaults to `3`
- `--response-format <url|base64>` - Optional, defaults to `url`
- `--no-prompt-optimizer` - Optional, disables prompt optimization

## Prerequisite

Require `MINIMAX_API_KEY` in the environment before running the request.

If the key is missing, tell the user to export it first:

```bash
export MINIMAX_API_KEY="..."
```

To verify the key, use a shell-safe check and avoid nested parameter expansion:

```bash
if [ -n "$MINIMAX_API_KEY" ]; then
  echo "MINIMAX_API_KEY is set"
else
  echo "MINIMAX_API_KEY is NOT set"
fi
```

## Steps

### 1. Parse inputs

- Treat everything before recognized flags as the prompt.
- If no prompt is supplied, ask the user for one concise image prompt.
- Defaults:
  - `aspect_ratio=16:9`
  - `count=3`
  - `response_format=url`
  - `prompt_optimizer=true`

### 2. Build the request

Use this request shape:

```bash
curl --request POST \
  --url https://api.minimax.io/v1/image_generation \
  --header "authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "content-type: application/json" \
  --data '{
    "model": "image-01",
    "prompt": "A man in a white t-shirt, full-body, standing front view, outdoors, with the Venice Beach sign in the background, Los Angeles. Fashion photography in 90s documentary style, film grain, photorealistic.",
    "aspect_ratio": "16:9",
    "response_format": "url",
    "n": 3,
    "prompt_optimizer": true
  }'
```

Replace the example `prompt`, `aspect_ratio`, `response_format`, `n`, and `prompt_optimizer` values with the user's request.
Ensure the prompt is escaped correctly for JSON before running `curl`.

### 3. Execute the call

Run the `curl` request against `https://api.minimax.io/v1/image_generation`.
Prefer capturing the raw JSON response first, then parsing it:

```bash
response="$(curl --silent --show-error --request POST \
  --url https://api.minimax.io/v1/image_generation \
  --header "authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "content-type: application/json" \
  --data "$json_payload")"
```

### 4. Return the result

- First inspect `base_resp.status_code`.
- Treat `base_resp.status_code == 0` as success.
- For successful `url` responses, parse `data.image_urls[]`.
- If returned URLs use `http://`, normalize them to `https://` before showing them to the user.
- Present the URLs as complete single-line values without inserting manual line breaks.
- For successful `base64` responses, return the relevant `data` field and note that decoding or file writing is still needed.
- If the API returns an error, show `base_resp.status_code`, `base_resp.status_msg`, and any other relevant error fields.

Expected success shape:

```json
{
  "id": "06323a75df108b1d18d8fcc5592897e8",
  "data": {
    "image_urls": [
      "https://...",
      "https://...",
      "https://..."
    ]
  },
  "metadata": {
    "failed_count": "0",
    "success_count": "3"
  },
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
```

Recommended parsing with `jq`:

```bash
echo "$response" | jq -r '.base_resp.status_code'
echo "$response" | jq -r '.data.image_urls[] | sub("^http://"; "https://")'
echo "$response" | jq -r '.metadata.success_count'
```

If `jq` is unavailable, return the raw JSON and extract the URLs manually instead of claiming parsing failed.

## Troubleshooting

- Do not use `echo "MINIMAX_API_KEY is ${MINIMAX_API_KEY:+set (length: ${#MINIMAX_API_KEY})}"` because that nested expansion is not shell-safe here.
- Do not validate these signed object-store URLs with `HEAD`; a `HEAD` request can return `403 SignatureDoesNotMatch` even when `GET` succeeds.
- These URLs can return `Content-Disposition: attachment`, so the browser may download the image instead of rendering it inline.
- If parsing fails but the response contains `data.image_urls`, treat the request as successful and return those URLs.
- If the API returns `success_count > 0` and `failed_count == 0`, summarize that as a successful generation.

## Example

```text
$dev-workflow:image-generation A man in a white t-shirt, full-body, standing front view, outdoors, with the Venice Beach sign in the background, Los Angeles. Fashion photography in 90s documentary style, film grain, photorealistic. --aspect-ratio 16:9 --count 3
```
