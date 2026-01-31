# Tasks: keep-only-dev-workflow

## Progress: [8/8]

## 1. Remove Plugin Directories

- [x] 1.1 Remove plugins/agentic-ai-workflow
- [x] 1.2 Remove plugins/code-master
- [x] 1.3 Remove plugins/frontend-pro
- [x] 1.4 Remove plugins/midwess
- [x] 1.5 Remove plugins/mcp-servers
- [x] 1.6 Remove plugins/rich-statusline

## 2. Remove Other Directories

- [x] 2.1 Remove templates/ directory
- [x] 2.2 Remove commands/ directory

## 3. Update Configuration

- [x] 3.1 Update .claude-plugin/marketplace.json

## 4. Update Documentation

- [x] 4.1 Rewrite README.md
- [x] 4.2 Rewrite CLAUDE.md
- [x] 4.3 Rewrite CONTRIBUTING.md
- [x] 4.4 Update .dev/project.md

## 5. Verification

- [x] 5.1 Verify only dev-workflow remains
- [x] 5.2 Search for stale references

---

## Notes

Implementation completed 2026-01-24.

### Changes Made
- Removed 6 plugin directories (agentic-ai-workflow, code-master, frontend-pro, midwess, mcp-servers, rich-statusline)
- Removed templates/ and commands/ directories
- Updated marketplace.json to single plugin
- Rewrote README.md, CLAUDE.md, CONTRIBUTING.md for single-plugin architecture
- Updated .dev/project.md

### Final Structure
```
.
├── .claude-plugin/marketplace.json
├── plugins/dev-workflow/
├── .dev/
├── README.md
├── CLAUDE.md
└── CONTRIBUTING.md
```
