---
name: video-generation
description: Generate videos with Minimax in Codex. Use when the user types $dev-workflow:video-generation, wants image-to-video generation, or needs the agent to start a background video task, poll until it finishes, and return the final download URL.
---

# Video Generation Skill

Use this skill to generate videos with the Minimax video API and wait until the background task finishes.

## When to Use

Use this skill when:
- the user types `$dev-workflow:video-generation`
- the user wants to generate a video from an image
- the user wants the agent to start a long-running Minimax video task and poll for completion
- the user wants the final downloadable video URL after generation completes

## Workflow

1. Require `MINIMAX_API_KEY` in the environment.
2. Gather the request inputs:
   - `prompt`
   - `first_frame_image`
   - optional `model`
   - optional `duration`
   - optional `resolution`
3. For `first_frame_image`, use a public URL or another reachable image URL.
   If the user gives a local image path, make it reachable first, then pass the resulting URL.
4. Start the task with:
   - `POST https://api.minimax.io/v1/video_generation`
5. Parse the start response and extract:
   - `task_id`
   - `base_resp.status_code`
   - `base_resp.status_msg`
6. If task creation succeeds, poll:
   - `GET https://api.minimax.io/v1/query/video_generation?task_id=...`
7. Treat these task states as in progress:
   - `Preparing`
   - `Queueing`
   - `Processing`
8. Treat these task states as terminal:
   - `Success`
   - `Fail`
9. Poll until terminal state, using a reasonable interval such as 10 to 20 seconds.
10. On `Success`, extract:
   - `file_id`
   - `video_width`
   - `video_height`
11. Fetch the final file metadata with:
   - `GET https://api.minimax.io/v1/files/retrieve?file_id=...`
12. Return the `download_url` from the file response.

## Request Sample

Use this request shape to create the task:

```bash
curl --request POST \
  --url https://api.minimax.io/v1/video_generation \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}" \
  --header "Content-Type: application/json" \
  --data '{
    "prompt": "A mouse runs toward the camera, smiling and blinking.",
    "first_frame_image": "https://cdn.hailuoai.com/prod/2024-09-18-16/user/multi_chat_file/9c0b5c14-ee88-4a5b-b503-4f626f018639.jpeg",
    "model": "MiniMax-Hailuo-2.3",
    "duration": 6,
    "resolution": "1080P"
  }'
```

Expected start response:

```json
{
  "task_id": "106916112212032",
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
```

## Polling Sample

Use this polling shape:

```bash
curl --request GET \
  --url "https://api.minimax.io/v1/query/video_generation?task_id=${task_id}" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

Successful completed task shape:

```json
{
  "task_id": "176843862716480",
  "status": "Success",
  "file_id": "176844028768320",
  "video_width": 1920,
  "video_height": 1080,
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
```

## File Retrieval Sample

After success, use this request shape:

```bash
curl --request GET \
  --url "https://api.minimax.io/v1/files/retrieve?file_id=${file_id}" \
  --header "Authorization: Bearer ${MINIMAX_API_KEY}"
```

The final downloadable video URL is returned in `file.download_url`.

## Guidance

- This API runs in the background. Do not claim completion from the initial `task_id` response alone.
- Poll until the task reaches `Success` or `Fail`.
- If the task reaches `Fail`, return the failure status and any error fields that are present.
- If the user needs webhooks, note that `callback_url` is supported, but use polling by default unless the user specifically asks for callbacks.
- Use concise status updates while polling.

## Output

End with:
- the prompt used
- the task ID
- the final task status
- the file ID when successful
- the final download URL when successful
