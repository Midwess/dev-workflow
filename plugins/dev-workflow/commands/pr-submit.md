---
description: Run code review and create a pull request
argument-hint: [--skip-review] [--draft] [--base <branch>]
allowed-tools: Read, Glob, Grep, Task, Bash(git:*), Bash(gh:*)
---

Run automated code review and create a pull request with a formatted description. This is a full workflow command that ensures code quality before PR creation.

## Input

`$ARGUMENTS` - Optional flags:
- `--skip-review` - Skip the code review step
- `--draft` - Create PR as draft
- `--base <branch>` - Target branch (default: main or master)

## Steps

### 1. Pre-flight Checks

**Verify branch state:**
```bash
# Get current branch
git branch --show-current

# Check if on main/master (should not create PR from main)
git rev-parse --abbrev-ref HEAD
```

If on main/master:
```
Error: Cannot create PR from main/master branch.
Create a feature branch first: git checkout -b feature/your-feature
```

**Check for uncommitted changes:**
```bash
git status --porcelain
```

If uncommitted changes exist:
```
Warning: You have uncommitted changes.
Options:
1. Commit changes first
2. Stash changes and continue
3. Cancel

Proceed?
```

**Check remote tracking:**
```bash
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
```

If no upstream:
```
Branch not pushed to remote. Will push with: git push -u origin {branch}
```

### 2. Determine Base Branch

```bash
# Try to detect default branch
gh repo view --json defaultBranchRef --jq '.defaultBranchRef.name'
```

Use `--base` argument if provided, otherwise use detected default.

### 3. Run Code Review (unless --skip-review)

Execute the code-review workflow:
- Launch parallel review agents
- Collect and score issues
- Filter by confidence threshold (80)

**If critical issues found (confidence >= 90):**
```
Warning: {N} critical issues found

Critical Issues:
1. {description} (confidence: {score})
   File: {path}:{lines}

Options:
1. Fix issues and try again
2. Continue anyway (not recommended)
3. Cancel

Proceed with PR creation?
```

Wait for user confirmation if critical issues exist.

### 4. Gather PR Context

**Get commit history:**
```bash
# Commits since divergence from base
git log {base}..HEAD --oneline
git log {base}..HEAD --format="%s%n%b"
```

**Get full diff:**
```bash
git diff {base}...HEAD --stat
git diff {base}...HEAD
```

**Check for related change proposal:**
- Look for change-id in commit messages
- Check `.dev/changes/` for active proposals
- Look for issue references (#123) in commits

### 5. Generate PR Title

Generate from (in priority order):
1. Change proposal title (if linked)
2. Branch name (converted: `feature/add-auth` → "Add auth")
3. First commit message summary
4. Diff analysis

**Format:** `{type}: {description}`

Types:
- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `docs` - Documentation
- `test` - Tests
- `chore` - Maintenance

### 6. Generate PR Description

Create markdown description:

```markdown
## Summary

{2-3 sentences summarizing the change, generated from commits and diff}

## Changes

- {Bullet point list of key changes}
- {Extracted from commit messages and diff analysis}

## Related

{If change proposal exists:}
- Change Proposal: `.dev/changes/{change-id}/`
- Specs: `.dev/specs/{domains affected}/`

{If issue references found:}
- Closes #{issue-number}
- Related to #{issue-number}

## Test Plan

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual verification completed
{Additional items from tasks.md if applicable}

## Code Review

{If review ran:}
- Issues found: {count}
- Critical issues: {count}
- Review status: {passed/warnings}

{If review skipped:}
- Review skipped (--skip-review flag)

## Checklist

- [ ] Code follows project conventions
- [ ] `.dev/project.md` guidelines followed
- [ ] Documentation updated (if needed)
- [ ] No sensitive data exposed
- [ ] Tests added for new functionality

---
Generated with [Claude Code](https://claude.ai/code)
```

### 7. Push and Create PR

**Push branch:**
```bash
# Push with tracking if needed
git push -u origin {branch-name}
```

**Create PR:**
```bash
gh pr create \
  --title "{generated title}" \
  --body "$(cat <<'EOF'
{generated description}
EOF
)" \
  --base {base-branch} \
  {--draft if flag provided}
```

### 8. Post-Creation Actions

**If code review found issues:**
Post them as a separate comment on the new PR:
```bash
gh pr comment {pr-number} --body "$(cat <<'EOF'
### Automated Code Review

{review results}
EOF
)"
```

**Link to change proposal:**
If a change proposal was detected, add a comment linking them.

### 9. Final Output

```
## PR Created

### Branch
{branch-name} → {base-branch}

### PR
#{pr-number}: {title}
{pr-url}

### Code Review Summary
{If ran: X issues found, Y critical}
{If skipped: Review skipped}

### Change Proposal
{If linked: .dev/changes/{change-id}/}
{If not: No change proposal linked}

### Next Steps
1. Review the PR description at {url}
2. Request reviewers
{If issues: 3. Address code review findings}
{If clean: 3. Ready for human review}
```

## Error Handling

**PR already exists:**
```
PR already exists for this branch: #{number}
{url}

Options:
1. Open existing PR
2. Update existing PR description
3. Cancel
```

**Push rejected:**
```
Push rejected. Possible causes:
- Branch is behind remote (try: git pull --rebase)
- Branch protection rules
- No push access

Resolve and try again.
```

**gh CLI not authenticated:**
```
Error: GitHub CLI not authenticated.
Run: gh auth login
```

## Notes

- Always runs review unless explicitly skipped
- Critical issues (90+ confidence) require confirmation
- PR description is comprehensive but editable
- Links change proposals when detected
- Uses HEREDOC for proper markdown formatting
