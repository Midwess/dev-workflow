# Tasks: change-minimax-to-openclaude

## Progress: [0/5]

## 1. Rename Command Files

- [ ] 1.1 Move `plugins/dev-workflow/commands/minimax.md` → `openclaude.md`
- [ ] 1.2 Move `plugins/dev-workflow-codex/commands/minimax.md` → `openclaude.md`

## 2. Rename Skill Directories

- [ ] 2.1 Move `plugins/dev-workflow/skills/minimax-codegen/` → `openclaude-codegen/`
- [ ] 2.2 Move `plugins/dev-workflow-codex/skills/minimax/` → `openclaude/`
- [ ] 2.3 Move `plugins/dev-workflow-codex/skills/minimax-codegen/` → `openclaude-codegen/`

## 3. Update Claude Plugin Content

- [ ] 3.1 Update `claude` → `openclaude` in `plugins/dev-workflow/commands/openclaude.md`
- [ ] 3.2 Update `claude` → `openclaude` in `plugins/dev-workflow/skills/openclaude-codegen/SKILL.md`
- [ ] 3.3 Update `claude` → `openclaude` in `plugins/dev-workflow/skills/video-generation/SKILL.md`
- [ ] 3.4 Update `claude` → `openclaude` in `plugins/dev-workflow/skills/image-generation/SKILL.md`
- [ ] 3.5 Update `/dev-workflow:minimax` → `/dev-workflow:openclaude` in `plugins/dev-workflow/README.md`

## 4. Update Codex Plugin Content

- [ ] 4.1 Update `claude` → `openclaude` in `plugins/dev-workflow-codex/commands/openclaude.md`
- [ ] 4.2 Update `claude` → `openclaude` in `plugins/dev-workflow-codex/skills/openclaude/SKILL.md`
- [ ] 4.3 Update `claude` → `openclaude` in `plugins/dev-workflow-codex/skills/openclaude-codegen/SKILL.md`
- [ ] 4.4 Update `claude` → `openclaude` in `plugins/dev-workflow-codex/skills/video-generation/SKILL.md`
- [ ] 4.5 Update `claude` → `openclaude` in `plugins/dev-workflow-codex/skills/image-generation/SKILL.md`
- [ ] 4.6 Update `$dev-workflow:minimax` → `$dev-workflow:openclaude` in `plugins/dev-workflow-codex/README.md`

## 5. Verify

- [ ] 5.1 Check `plugins/dev-workflow/.claude-plugin/plugin.json` for command references
- [ ] 5.2 Check `plugins/dev-workflow-codex/.codex-plugin/plugin.json` for command/skill references
- [ ] 5.3 Check `plugins/dev-workflow/skills/video-generation/agents/openai.yaml`
- [ ] 5.4 Check `plugins/dev-workflow/skills/image-generation/agents/openai.yaml`
- [ ] 5.5 Check `plugins/dev-workflow-codex/skills/video-generation/agents/openai.yaml`
- [ ] 5.6 Check `plugins/dev-workflow-codex/skills/image-generation/agents/openai.yaml`

---

## Notes

Implementation will use `git mv` to preserve git history for renamed files.
