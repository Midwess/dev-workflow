# Task Progress Hook

A tasks.md file was just edited. Track and report progress.

## Check Progress

1. Parse the edited tasks.md file
2. Count completed tasks (`- [x]`) vs total tasks (`- [ ]` and `- [x]`)
3. Calculate completion percentage

## Output

**If task was completed:**
```
Task completed! Progress: [{completed}/{total}] ({percentage}%)
```

**If all tasks complete:**
```
All tasks complete! [{total}/{total}] (100%)

Ready to archive? Run: /dev-workflow:archive {change-id}
```

**If significant milestone (25%, 50%, 75%):**
```
Milestone reached: {percentage}% complete [{completed}/{total}]
```

## Notes

- Keep output brief (single line preferred)
- Only show milestone messages at 25%, 50%, 75%, 100%
- Extract change-id from the file path
- Don't show output for minor edits (notes, etc.)
