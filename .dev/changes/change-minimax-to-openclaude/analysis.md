# Analysis: change-minimax-to-openclaude

## Summary

Find all tools and skills that use minimax, and change commands to use `openclaude` instead of `claude`.

## Codebase Analysis

### Files Referencing "minimax" (16 total)

#### Commands
1. `plugins/dev-workflow/commands/minimax.md` - References `claude` binary in execution steps
2. `plugins/dev-workflow-codex/commands/minimax.md` - Same content, Codex variant

#### Skills
3. `plugins/dev-workflow/skills/minimax-codegen/SKILL.md` - Runs `claude -p "$prompt"` with Minimax env overrides
4. `plugins/dev-workflow/skills/video-generation/SKILL.md` - Uses Minimax API endpoints directly (no `claude` binary)
5. `plugins/dev-workflow/skills/image-generation/SKILL.md` - Uses Minimax API endpoints directly via curl (no `claude` binary)
6. `plugins/dev-workflow-codex/skills/minimax-codegen/SKILL.md` - Codex variant of minimax-codegen
7. `plugins/dev-workflow-codex/skills/minimax/SKILL.md` - Codex entry skill that delegates to command
8. `plugins/dev-workflow-codex/skills/video-generation/SKILL.md` - Codex variant of video-generation
9. `plugins/dev-workflow-codex/skills/image-generation/SKILL.md` - Codex variant of image-generation

#### Agent Files
10. `plugins/dev-workflow-codex/skills/minimax/agents/openai.yaml` - Agent definition
11. `plugins/dev-workflow-codex/skills/minimax-codegen/agents/openai.yaml` - Agent definition
12. `plugins/dev-workflow/skills/video-generation/agents/openai.yaml` - May reference minimax
13. `plugins/dev-workflow/skills/image-generation/agents/openai.yaml` - May reference minimax

#### READMEs
14. `plugins/dev-workflow/README.md` - Documents `/dev-workflow:minimax` command and image-generation
15. `plugins/dev-workflow-codex/README.md` - Documents `$dev-workflow:minimax` and `$dev-workflow:minimax-codegen`

### Key Pattern: `claude` Binary Usage

The `minimax.md` command files and `minimax-codegen` skill files invoke the `claude` CLI:

```bash
ANTHROPIC_AUTH_TOKEN="$MINIMAX_API_KEY" \
ANTHROPIC_BASE_URL="https://api.minimax.io/anthropic" \
ANTHROPIC_MODEL="MiniMax-M2.7-highspeed" \
claude -p "$request" --output-format text | json-stream
```

This must become `openclaude` instead of `claude`.

### What Does NOT Need Changing

- `video-generation` and `image-generation` skills use Minimax API directly via `curl` - no `claude` binary involved
- The API endpoint URLs (`https://api.minimax.io/...`) remain unchanged
- `MINIMAX_API_KEY` environment variable name stays the same

### Conventions to Follow

1. **Naming**: kebab-case for files and directories
2. **File moves**: When renaming a directory, move it (not copy + delete)
3. **Plugin manifests**: Check `plugin.json` files for command references
4. **Markdown skills**: Update YAML frontmatter `name` fields when renaming
5. **READMEs**: Update command tables and skill listings to reflect new names

## Dependencies

- None external required

## OpenSpec Integration

- This is a refactoring change within the existing dev-workflow plugin
- No new specs required beyond delta tracking the rename
