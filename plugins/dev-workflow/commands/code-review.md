---
description: Automated code review with confidence scoring
argument-hint: [PR-number] [--quick|--thorough] [--no-comment]
allowed-tools: Read, Glob, Grep, Task, Bash(git status:*), Bash(git diff:*), Bash(git log:*), Bash(git rev-parse:*), Bash(git remote:*), Bash(gh issue view:*), Bash(gh search:*), Bash(gh issue list:*), Bash(gh pr comment:*), Bash(gh pr diff:*), Bash(gh pr view:*), Bash(gh pr list:*)
---

Perform automated code review on the current branch or PR using parallel review agents with confidence scoring. Results are displayed in the console AND posted as a PR comment.

## Input

`$ARGUMENTS` - Options:
- `[PR-number]` - Optional PR number to review (default: current branch)
- `--quick` - Fast review with core agents only (4 agents)
- `--thorough` - Deep review with all agents (7 agents) + code simplification
- `--no-comment` - Don't post PR comment, console only
- `--threshold N` - Custom confidence threshold (default: 80)

## Review Modes

| Mode | Agents | Use Case |
|------|--------|----------|
| Default | 4 core | Standard review |
| `--quick` | 4 core | Fast feedback, CI pipelines |
| `--thorough` | 7 all | Pre-merge, important PRs |

**Core agents (always run):**
- claude-md-auditor, bug-detector, history-analyzer, spec-validator

**Extended agents (--thorough only):**
- test-analyzer, comment-analyzer, code-simplifier

## Steps

### 1. Pre-flight Checks

Determine what to review:

**If PR number provided:**
```bash
gh pr view {PR-number} --json state,isDraft,number,title,headRefName
```

**If no PR number:**
```bash
gh pr view --json state,isDraft,number,title,headRefName 2>/dev/null
```

Check eligibility:
- Skip if PR is closed or merged
- Skip if PR is draft (warn user, offer to continue)
- Skip if PR was already reviewed by this tool (check for existing comment)
- If not on a PR, review uncommitted/staged changes instead

### 2. Gather Context

**Find project.md:**
```bash
# Read project guidelines
cat .dev/project.md 2>/dev/null
```

**Get changed files:**
```bash
# For PR
gh pr diff {number} --name-only

# For local changes
git diff --name-only HEAD
git diff --name-only --staged
```

**Get the diff:**
```bash
# For PR
gh pr diff {number}

# For local changes
git diff HEAD
```

**Find relevant specs:**
- Check `.dev/specs/` for related domains
- Check `.dev/changes/` for active proposals

### 3. Summarize Changes

Create a brief summary of what changed:
- Files modified
- Lines added/removed
- Key areas affected

### 4. Launch Parallel Review Agents

Launch agents IN PARALLEL using the Task tool based on review mode:

#### Core Agents (all modes)

**Agent 1: Project Guidelines Compliance (claude-md-auditor)**
- Provide: `.dev/project.md` content
- Provide: The diff/changes
- Ask: Check for guideline violations

**Agent 2: Bug Detection (bug-detector)**
- Provide: The diff/changes
- Provide: File context for changed files
- Ask: Scan for obvious bugs

**Agent 3: History Analysis (history-analyzer)**
- Provide: List of changed files
- Provide: The diff/changes
- Ask: Check git history for conflicts

**Agent 4: Spec Validation (spec-validator)** - Only if specs exist
- Provide: Any spec files in the changes
- Ask: Validate spec format

#### Extended Agents (--thorough mode only)

**Agent 5: Test Coverage (test-analyzer)**
- Provide: Changed source files
- Provide: Corresponding test files
- Ask: Identify test coverage gaps

**Agent 6: Comment Quality (comment-analyzer)**
- Provide: Changed files with their comments
- Ask: Check comment accuracy and quality

**Agent 7: Code Simplification (code-simplifier)**
- Provide: Changed code sections
- Ask: Suggest simplifications (run last, after other reviews pass)

### 5. Collect and Score Issues

Gather all issues from agents. Each issue should have:
- Description
- File and line numbers
- Source agent
- Initial confidence score

**Confidence Scoring Rubric:**
| Score | Meaning |
|-------|---------|
| 0-25 | Likely false positive |
| 26-50 | Uncertain, needs more context |
| 51-75 | Probably real, moderate confidence |
| 76-90 | High confidence, real issue |
| 91-100 | Certain, clear problem |

For project.md issues: Verify the guideline explicitly states the issue (boost confidence if quoted).

### 6. Filter by Threshold

Default threshold: **80**

Remove any issues with confidence < 80.

If no issues remain after filtering:
```
No high-confidence issues found.
```

### 7. Get Repository Info

For GitHub links:
```bash
# Get repo info
gh repo view --json owner,name

# Get full SHA for links
git rev-parse HEAD
```

### 8. Format Output

**Console Output (always):**

```
## Code Review

### Summary
{Brief summary of changes reviewed}

### Issues Found: {count}

#### Issue 1: {brief description}
**Source:** {agent name}
**Confidence:** {score}/100
**Location:** {file}:{lines}
**Details:** {explanation}
{If project.md: "Guideline: {quoted text}"}

---

#### Issue 2: ...

### Files Reviewed
- {file1}
- {file2}

### Agents Used
**Core:**
- claude-md-auditor: {issues found}
- bug-detector: {issues found}
- history-analyzer: {issues found}
- spec-validator: {issues found or "skipped"}

**Extended (--thorough only):**
- test-analyzer: {issues found or "skipped"}
- comment-analyzer: {issues found or "skipped"}
- code-simplifier: {suggestions or "skipped"}
```

**If no issues:**
```
## Code Review

No issues found.

### Summary
{What was checked}

### Files Reviewed
{count} files

### Checks Performed
- Project guidelines compliance (.dev/project.md)
- Bug detection
- Git history analysis
{- Spec validation (if applicable)}
```

### 9. Post PR Comment

If reviewing a PR, post comment using `gh pr comment`:

```bash
gh pr comment {number} --body "$(cat <<'EOF'
### Code Review

{If issues found:}
Found {N} issues:

1. {Brief description} ({reason})

https://github.com/{owner}/{repo}/blob/{full-sha}/{path}#L{start}-L{end}

2. ...

{If no issues:}
No issues found. Checked for bugs and project guidelines compliance.

---
Generated with [Claude Code](https://claude.ai/code)

<sub>React with :+1: if helpful, :-1: if not</sub>
EOF
)"
```

**Link format requirements:**
- Use FULL 40-character SHA (not abbreviated)
- Format: `https://github.com/{owner}/{repo}/blob/{sha}/{path}#L{start}-L{end}`
- Include at least 1 line of context around the issue

### 10. Final Output

```
## Code Review Complete

### Results
- Issues found: {count}
- Confidence threshold: 80
- PR comment: {posted/not applicable}

### PR Link
{If applicable: link to PR}

### Next Steps
{If issues: "Address the issues above before merging"}
{If clean: "Ready for human review and merge"}
```

## False Positive Patterns

DO NOT report:
- Pre-existing issues (not introduced in this change)
- Issues on unchanged lines
- Style issues (linters catch these)
- Type errors (type checker catches these)
- Issues with lint-ignore comments
- Intentional behavior changes documented in commit
- Issues in test files that are testing error conditions

## Notes

- Review focuses on the CHANGES, not the entire codebase
- Parallel agents make this faster but use more resources
- The 80 threshold balances thoroughness with noise reduction
- PR comments use GitHub-flavored markdown with code links
