# dev-workflow Codex plugin

Codex-native companion plugin for the existing `dev-workflow` Claude Code plugin.

This plugin keeps the same high-level workflow:

- initialize `.dev/`
- create and refine change proposals
- apply tasks from `tasks.md`
- run multi-agent code review
- archive completed changes
- prepare pull requests

It is intentionally packaged in a separate root so Codex-specific skills and agents can evolve without weakening the existing Claude Code command layer.

## Structure

```text
plugins/dev-workflow-codex/
├── .codex-plugin/plugin.json
├── agents/
├── commands/
├── skills/
└── README.md
```

## Main Surfaces

- `skills/` contains the Codex entrypoints you invoke with `$...`
- `skills/proposal/` provides the `$dev-workflow:proposal` workflow for creating new change proposals
- `skills/openspec-workflow/` provides the shared OpenSpec conventions and templates
- `agents/` contains specialist prompts used for proposal planning and review

## Using In Codex

After installing the plugin in Codex, start the proposal workflow with:

```text
$dev-workflow:proposal Add user authentication with OAuth
```

If `.dev/` does not exist yet, `$dev-workflow:proposal` should bootstrap the minimal dev-workflow structure first and then create the change proposal.

Available entry skills include:

- `$dev-workflow:init`
- `$dev-workflow:proposal`
- `$dev-workflow:proposal-wizard`
- `$dev-workflow:apply`
- `$dev-workflow:code-review`
- `$dev-workflow:archive`
- `$dev-workflow:undo-archive`
- `$dev-workflow:pr-submit`
- `$dev-workflow:status`
- `$dev-workflow:list`
- `$dev-workflow:show`
- `$dev-workflow:import-issue`
- `$dev-workflow:generate-tests`
- `$dev-workflow:image-generation`
- `$dev-workflow:minimax`
- `$dev-workflow:minimax-codegen`

## Notes

- Claude Code support continues to live in `plugins/dev-workflow/`
- Codex marketplace discovery is configured in `.agents/plugins/marketplace.json`
