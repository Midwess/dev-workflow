# Blueprint: change-minimax-to-openclaude

## Design Summary

Rename `minimax`-branded command and skill files/directories to `openclaude`, and update all `claude` binary references to `openclaude`.

## Files to Create

None - this is a rename-only change.

## Files to Rename/Move

### Claude Plugin

| Old Path | New Path | Notes |
|----------|----------|-------|
| `plugins/dev-workflow/commands/minimax.md` | `plugins/dev-workflow/commands/openclaude.md` | Update frontmatter `name: openclaude-codegen` if applicable |

### Codex Plugin

| Old Path | New Path | Notes |
|----------|----------|-------|
| `plugins/dev-workflow-codex/commands/minimax.md` | `plugins/dev-workflow-codex/commands/openclaude.md` | Update frontmatter |
| `plugins/dev-workflow-codex/skills/minimax/` | `plugins/dev-workflow-codex/skills/openclaude/` | Entire directory |
| `plugins/dev-workflow-codex/skills/minimax-codegen/` | `plugins/dev-workflow-codex/skills/openclaude-codegen/` | Entire directory |

## Files to Modify (Content Updates)

### Claude Plugin

| File | Changes |
|------|---------|
| `plugins/dev-workflow/skills/minimax-codegen/SKILL.md` | Rename directory → `openclaude-codegen/`, update `claude` → `openclaude` |
| `plugins/dev-workflow/skills/video-generation/SKILL.md` | Update `claude` → `openclaude` in prerequisites/commands |
| `plugins/dev-workflow/skills/image-generation/SKILL.md` | Update `claude` → `openclaude` in prerequisites/commands |
| `plugins/dev-workflow/README.md` | Update `/dev-workflow:minimax` → `/dev-workflow:openclaude`, update Minimax Text table row |

### Codex Plugin

| File | Changes |
|------|---------|
| `plugins/dev-workflow-codex/skills/openclaude-codegen/SKILL.md` | Update `claude` → `openclaude` |
| `plugins/dev-workflow-codex/skills/openclaude/SKILL.md` | Update `claude` → `openclaude`, update frontmatter `name: openclaude` |
| `plugins/dev-workflow-codex/skills/video-generation/SKILL.md` | Update `claude` → `openclaude` in prerequisites/commands |
| `plugins/dev-workflow-codex/skills/image-generation/SKILL.md` | Update `claude` → `openclaude` in prerequisites/commands |
| `plugins/dev-workflow-codex/README.md` | Update `$dev-workflow:minimax` → `$dev-workflow:openclaude`, `$dev-workflow:minimax-codegen` → `$dev-workflow:openclaude-codegen` |

## Files to Review

| File | Reason |
|------|--------|
| `plugins/dev-workflow/.claude-plugin/plugin.json` | Check for command name references |
| `plugins/dev-workflow-codex/.codex-plugin/plugin.json` | Check for command/skill name references |
| `plugins/dev-workflow/skills/video-generation/agents/openai.yaml` | Check if agent references minimax |
| `plugins/dev-workflow/skills/image-generation/agents/openai.yaml` | Check if agent references minimax |
| `plugins/dev-workflow-codex/skills/video-generation/agents/openai.yaml` | Check if agent references minimax |
| `plugins/dev-workflow-codex/skills/image-generation/agents/openai.yaml` | Check if agent references minimax |

## Implementation Phases

### Phase 1: Rename Command Files

1. Move `plugins/dev-workflow/commands/minimax.md` → `openclaude.md`
2. Move `plugins/dev-workflow-codex/commands/minimax.md` → `openclaude.md`

### Phase 2: Rename Skill Directories

1. Move `plugins/dev-workflow/skills/minimax-codegen/` → `openclaude-codegen/`
2. Move `plugins/dev-workflow-codex/skills/minimax/` → `openclaude/`
3. Move `plugins/dev-workflow-codex/skills/minimax-codegen/` → `openclaude-codegen/`

### Phase 3: Update Content References

1. Update `claude` → `openclaude` in all affected skill files
2. Update `claude` → `openclaude` in command files

### Phase 4: Update Documentation

1. Update README files in both plugin roots

### Phase 5: Verify

1. Check plugin manifest files for any references
2. Verify all renamed files are correctly referenced

## Risks

- **Risk**: Old command names stop working - **Mitigation**: Document the rename prominently
- **Risk**: Plugin manifest references break - **Mitigation**: Check manifests before finalizing
