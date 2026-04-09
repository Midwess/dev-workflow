# Delta Format Reference

Delta files describe proposed changes to specifications. They live in `.dev/changes/{change-id}/specs/{domain}/spec.md`.

## Structure

```markdown
# Delta for {Domain}

## ADDED Requirements

### Requirement: {New Requirement Name}
The system SHALL {new behavior}.

#### Scenario: {Scenario}
- WHEN {condition}
- THEN {result}

## MODIFIED Requirements

### Requirement: {Existing Requirement Name}
The system SHALL {updated behavior}.

#### Scenario: {Updated Scenario}
- WHEN {new condition}
- THEN {new result}

## REMOVED Requirements

### Requirement: {Requirement to Remove}
Reason: {Why this requirement is being removed}
```

## Section Rules

### ADDED

Creates new requirements that don't exist in the main spec.

- Must include complete requirement with all scenarios
- Will be appended to main spec during archive
- Requirement name must be unique (not exist in main spec)

```markdown
## ADDED Requirements

### Requirement: Two-Factor Authentication
The system SHALL support optional 2FA via TOTP.

#### Scenario: 2FA setup
- WHEN a user enables 2FA
- THEN the system generates a TOTP secret
- AND displays QR code for authenticator app

#### Scenario: 2FA verification
- GIVEN 2FA is enabled for the user
- WHEN the user logs in with valid credentials
- THEN the system prompts for TOTP code
```

### MODIFIED

Updates existing requirements in the main spec.

- **MUST include complete requirement text** (not just the changes)
- Replaces the entire requirement block during archive
- Use when changing behavior, adding scenarios, or updating language
- Requirement name must match an existing requirement

```markdown
## MODIFIED Requirements

### Requirement: User Login
The system SHALL authenticate users via email, password, and optional 2FA.

#### Scenario: Login without 2FA
- WHEN the user submits valid credentials
- AND 2FA is not enabled
- THEN the system issues a JWT token

#### Scenario: Login with 2FA
- WHEN the user submits valid credentials
- AND 2FA is enabled
- THEN the system prompts for TOTP code
- AND issues JWT token only after valid TOTP

#### Scenario: Invalid password
- WHEN the user submits an incorrect password
- THEN the system returns a 401 error
```

### REMOVED

Removes requirements that are no longer needed.

- Must include reason for removal (for audit trail)
- Requirement will be deleted from main spec during archive
- Consider: is this truly removal, or modification?

```markdown
## REMOVED Requirements

### Requirement: Remember Me Cookie
Reason: Replaced by 2FA with longer token expiry. Security audit recommended against persistent cookies.

### Requirement: Basic Auth Support
Reason: Deprecated in favor of OAuth 2.0. No clients using basic auth as of Q4 2024.
```

## Merge Algorithm

During `/dev-workflow:archive`, deltas are applied in this order:

1. **REMOVED**: Find matching requirement by name, delete entire block
2. **MODIFIED**: Find matching requirement by name, replace entire block
3. **ADDED**: Append new requirement to end of Requirements section

### Conflict Resolution

- If MODIFIED targets a non-existent requirement, treat as ADDED
- If ADDED uses a name that exists, the archive will fail with error
- If REMOVED targets a non-existent requirement, log warning but continue

## Complete Example

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system SHALL support optional 2FA via TOTP.

#### Scenario: 2FA setup
- WHEN a user enables 2FA
- THEN the system generates a TOTP secret
- AND displays QR code for authenticator app

#### Scenario: 2FA verification
- GIVEN 2FA is enabled for the user
- WHEN the user logs in with valid credentials
- THEN the system prompts for TOTP code

#### Scenario: Invalid TOTP
- GIVEN 2FA is enabled for the user
- WHEN the user submits invalid TOTP code
- THEN the system returns 401 error
- AND does not increment failed login counter

## MODIFIED Requirements

### Requirement: User Login
The system SHALL authenticate users via email, password, and optional 2FA.

#### Scenario: Login without 2FA
- GIVEN a user without 2FA enabled
- WHEN the user submits valid credentials
- THEN the system issues a JWT token
- AND redirects to dashboard

#### Scenario: Login with 2FA
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN the system prompts for TOTP code

#### Scenario: Invalid password
- WHEN the user submits an incorrect password
- THEN the system returns a 401 error
- AND increments the failed attempt counter

## REMOVED Requirements

### Requirement: Remember Me Cookie
Reason: Replaced by 2FA with configurable token expiry. Security audit recommended against persistent cookies for sensitive applications.
```

## Validation Rules

The spec-validator agent checks:

1. **Section headers**: Only ADDED, MODIFIED, REMOVED are valid
2. **Requirement format**: Each has `### Requirement:` header
3. **Scenario format**: Each requirement has at least one scenario
4. **WHEN/THEN**: Every scenario has WHEN and THEN clauses
5. **REMOVED reason**: Each removed requirement includes reason
6. **No duplicates**: Same requirement not in multiple sections

## Best Practices

1. **Review before archive** - Deltas are permanent once merged
2. **Complete requirements** - MODIFIED must include full text, not partial
3. **Clear reasons** - REMOVED should explain why, for future reference
4. **One change per proposal** - Keep proposals focused
5. **Test scenarios** - Ensure scenarios are actually testable
