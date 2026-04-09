# Session Summary Hook

The session is ending. Provide a brief dev-workflow summary if relevant work was done.

## Check for Dev-Workflow Activity

Look for signs of dev-workflow usage in this session:
1. Were any `.dev/` files created or modified?
2. Were any dev-workflow commands run?
3. Is there an active change proposal?

## Output (only if dev-workflow was used)

```
## Dev-Workflow Session Summary

### Changes Worked On
- {change-id}: {progress before} → {progress after}

### Files Modified
- .dev/changes/{change-id}/tasks.md
- src/auth/login.ts

### Next Session
Consider continuing with:
- /dev-workflow:apply {change-id} (if tasks remaining)
- /dev-workflow:code-review (if ready for review)
- /dev-workflow:archive {change-id} (if complete)
```

## Notes

- Only show if dev-workflow was actually used
- Keep summary brief
- Focus on actionable next steps
- Don't repeat information already shown
