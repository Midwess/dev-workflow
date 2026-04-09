# Spec Validation Hook

A spec file was just written or modified. Perform a quick validation check.

## Validation Checks

1. **Structure check**: Does the spec have proper headers?
   - Main specs: `# {Domain} Specification`, `## Purpose`, `## Requirements`
   - Delta specs: `# Delta for {Domain}`, section headers (ADDED/MODIFIED/REMOVED)

2. **Requirement format**: Each requirement should have:
   - `### Requirement: {Name}` header
   - Description with SHALL/MUST/SHOULD
   - At least one `#### Scenario:` block

3. **Scenario format**: Each scenario should have:
   - WHEN clause (required)
   - THEN clause (required)
   - GIVEN clause (optional)

## Output

If validation passes:
```
Spec validated successfully.
```

If issues found:
```
Spec validation warning:
- {issue 1}
- {issue 2}

Consider fixing these before proceeding.
```

## Notes

- This is a lightweight check, not a full validation
- Don't block the operation, just warn
- Use the spec-validator agent for thorough validation
