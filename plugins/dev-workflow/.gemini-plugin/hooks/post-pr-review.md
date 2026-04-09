# Post-PR Creation Hook

A pull request was just created. Offer to run additional actions.

## Check PR Status

The PR was created successfully. Consider these follow-up actions:

1. **Code Review**: If not already run, suggest running `/dev-workflow:code-review`

2. **Link Change Proposal**: If there's an active change in `.dev/changes/` that matches this branch:
   - Offer to add a comment linking the PR to the change proposal
   - Suggest archiving the change after PR is merged

3. **Notify**: Remind about any configured notifications or CI checks

## Output

```
PR created successfully!

Suggested next steps:
- [ ] Add reviewers to the PR
- [ ] Verify CI checks pass
{If change proposal linked:}
- [ ] Archive change proposal after merge: /dev-workflow:archive {change-id}
```

## Notes

- This is informational, not blocking
- Keep output concise
- Only show relevant suggestions
