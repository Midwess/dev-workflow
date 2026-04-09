---
description: Generate test stubs from spec scenarios
argument-hint: <change-id|domain> [--output <path>]
allowed-tools: [Read, Write, Edit, Glob, Grep, Bash]
---

Generate test stubs from OpenSpec scenarios (WHEN/THEN). Creates test file templates that match your spec requirements.

## Input

`$ARGUMENTS` - Options:
- `<change-id>` - Generate tests from a change proposal's delta specs
- `<domain>` - Generate tests from a main spec domain (e.g., "auth")
- `--output <path>` - Custom output directory (default: detected test folder)
- `--framework <name>` - Test framework (jest, vitest, pytest, go, etc.)
- `--dry-run` - Preview generated tests without writing files

## Steps

### 1. Detect Test Framework

Look for test configuration:

| File | Framework |
|------|-----------|
| `jest.config.*` | Jest |
| `vitest.config.*` | Vitest |
| `pytest.ini`, `pyproject.toml[pytest]` | Pytest |
| `*_test.go` | Go testing |
| `*.spec.rb` | RSpec |
| `Cargo.toml` | Rust (cargo test) |

Use `--framework` to override detection.

### 2. Find Test Directory

Common patterns:
- `tests/`, `test/`, `__tests__/`
- `src/**/*.test.ts`, `src/**/*.spec.ts`
- `*_test.go` (same directory)

Use `--output` to override.

### 3. Load Spec Scenarios

**From change proposal:**
Read `.dev/changes/{change-id}/specs/*/spec.md`

**From main spec:**
Read `.dev/specs/{domain}/spec.md`

Extract all scenarios:
```markdown
#### Scenario: {name}
- GIVEN {precondition}
- WHEN {action}
- THEN {expected}
- AND {additional}
```

### 4. Generate Test Structure

For each requirement, create a test suite:

**Jest/Vitest (TypeScript/JavaScript):**
```typescript
describe('{Requirement Name}', () => {
  describe('Scenario: {Scenario Name}', () => {
    // GIVEN: {precondition}

    it('should {THEN clause}', () => {
      // Arrange
      // {Setup based on GIVEN}

      // Act
      // {Action based on WHEN}

      // Assert
      // {Verification based on THEN}
      expect(result).toBe(expected);
    });

    // AND clauses become additional assertions or tests
    it('should also {AND clause}', () => {
      // ...
    });
  });

  describe('Scenario: {Another Scenario}', () => {
    // ...
  });
});
```

**Pytest (Python):**
```python
class TestRequirementName:
    """Tests for: {Requirement Name}"""

    class TestScenarioName:
        """Scenario: {Scenario Name}"""

        # GIVEN: {precondition}

        def test_should_then_clause(self):
            """THEN: {then clause}"""
            # Arrange
            # {Setup based on GIVEN}

            # Act
            # {Action based on WHEN}

            # Assert
            # {Verification based on THEN}
            assert result == expected

        def test_should_also_and_clause(self):
            """AND: {and clause}"""
            # ...
```

**Go:**
```go
func TestRequirementName(t *testing.T) {
    t.Run("Scenario: {Scenario Name}", func(t *testing.T) {
        // GIVEN: {precondition}

        t.Run("should {THEN clause}", func(t *testing.T) {
            // Arrange
            // {Setup based on GIVEN}

            // Act
            // {Action based on WHEN}

            // Assert
            // {Verification based on THEN}
            if result != expected {
                t.Errorf("expected %v, got %v", expected, result)
            }
        })
    })
}
```

**RSpec (Ruby):**
```ruby
RSpec.describe '{Requirement Name}' do
  context 'Scenario: {Scenario Name}' do
    # GIVEN: {precondition}

    it 'should {THEN clause}' do
      # Arrange
      # {Setup based on GIVEN}

      # Act
      # {Action based on WHEN}

      # Assert
      # {Verification based on THEN}
      expect(result).to eq(expected)
    end
  end
end
```

### 5. Add Helper Comments

Include helpful comments in generated tests:

```typescript
/**
 * Generated from: .dev/specs/auth/spec.md
 * Requirement: User Login
 *
 * TODO: Implement test setup
 * TODO: Add actual assertions
 * TODO: Remove this comment when test is complete
 */
```

### 6. Handle Complex Scenarios

**Multiple THEN/AND clauses:**
- Create separate test cases for each assertion
- Group related assertions if they test the same behavior

**Conditional scenarios (GIVEN):**
- Create test fixtures or beforeEach hooks
- Document precondition setup needed

**Error scenarios:**
- Generate error handling tests
- Include expected error types/messages

### 7. Output

**Preview (--dry-run):**
```
## Test Generation Preview

### Source
.dev/changes/add-user-auth/specs/auth/spec.md

### Tests to Generate

#### tests/auth/user-login.test.ts
- describe('User Login')
  - describe('Scenario: Successful login')
    - it('should issue a JWT token')
    - it('should redirect to dashboard')
  - describe('Scenario: Invalid password')
    - it('should return 401 error')
    - it('should increment failed attempt counter')

#### tests/auth/oauth-support.test.ts
- describe('OAuth Support')
  - describe('Scenario: OAuth login')
    - it('should redirect to OAuth provider')

Total: 2 files, 5 test cases

---
This is a dry run. No files created.
Run without --dry-run to generate.
```

**Actual generation:**
```
## Tests Generated

### Files Created
- tests/auth/user-login.test.ts (3 test cases)
- tests/auth/oauth-support.test.ts (2 test cases)

### Summary
- Requirements covered: 2
- Scenarios covered: 3
- Test cases generated: 5

### Next Steps
1. Implement the TODO sections in each test
2. Add necessary imports and fixtures
3. Run tests: npm test (or your test command)

### Quick Commands
- Run tests: npm test
- Run specific: npm test -- --grep "User Login"
```

## Notes

- Generated tests are stubs - implementation needed
- Preserves existing tests (won't overwrite)
- Uses project conventions for file naming
- Each scenario becomes at least one test case
- GIVEN clauses inform setup code comments
- WHEN clauses inform action code comments
- THEN/AND clauses become assertions
