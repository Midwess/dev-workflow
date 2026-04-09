# Spec Format Reference

## Structure

```markdown
# {Domain} Specification

## Purpose
{One paragraph describing what this domain covers}

## Requirements

### Requirement: {Unique Name}
The system {SHALL|MUST|SHOULD} {behavior description}.

#### Scenario: {Descriptive Name}
- GIVEN {precondition} (optional)
- WHEN {trigger condition or user action}
- THEN {expected system behavior}
- AND {additional expected behavior} (optional)

#### Scenario: {Another Scenario}
- WHEN {different condition}
- THEN {different behavior}
```

## Language Guide

### Requirement Verbs

| Verb | Meaning |
|------|---------|
| **SHALL** | Mandatory requirement |
| **MUST** | Mandatory (alias for SHALL) |
| **SHOULD** | Recommended but not mandatory |
| **MAY** | Optional behavior |

### Scenario Keywords

| Keyword | Purpose | Required |
|---------|---------|----------|
| **GIVEN** | Precondition/context | Optional |
| **WHEN** | Trigger/action | Required |
| **THEN** | Expected result | Required |
| **AND** | Additional clauses | Optional |

## Naming Conventions

### Requirement Names
- Use Title Case
- Be descriptive and unique within domain
- Examples: "User Login", "Rate Limiting", "Data Validation"

### Scenario Names
- Use descriptive phrases
- Describe the specific case being tested
- Examples: "Successful login", "Invalid password", "Rate limit exceeded"

### Domain Names
- Use lowercase kebab-case for folders
- Examples: `auth`, `api`, `user-management`, `billing`

## Examples

### Authentication Spec

```markdown
# Auth Specification

## Purpose
Handles user authentication, session management, and access control.

## Requirements

### Requirement: User Login
The system SHALL authenticate users via email and password.

#### Scenario: Successful login
- GIVEN a registered user
- WHEN the user submits valid credentials
- THEN the system issues a JWT token
- AND redirects to the dashboard

#### Scenario: Invalid password
- WHEN the user submits an incorrect password
- THEN the system returns a 401 error
- AND increments the failed attempt counter

#### Scenario: Account locked
- GIVEN a user with 5 failed login attempts
- WHEN the user attempts to login
- THEN the system returns a 423 Locked error
- AND sends unlock email to user

### Requirement: Session Management
The system SHALL maintain user sessions with configurable expiry.

#### Scenario: Session expiry
- GIVEN a session older than the configured timeout
- WHEN the user makes a request
- THEN the system returns a 401 error
- AND clears the session cookie
```

### API Spec

```markdown
# API Specification

## Purpose
Defines REST API behavior, rate limiting, and error handling.

## Requirements

### Requirement: Rate Limiting
The system SHALL enforce rate limits on API endpoints.

#### Scenario: Under limit
- WHEN a client makes requests under the limit
- THEN requests are processed normally

#### Scenario: Limit exceeded
- WHEN a client exceeds 100 requests per minute
- THEN the system returns 429 Too Many Requests
- AND includes Retry-After header

### Requirement: Error Responses
The system SHALL return consistent error response format.

#### Scenario: Validation error
- WHEN a request fails validation
- THEN the system returns 400 Bad Request
- AND includes field-level error details in JSON body

#### Scenario: Server error
- WHEN an unexpected error occurs
- THEN the system returns 500 Internal Server Error
- AND logs the error with correlation ID
- AND returns correlation ID to client
```

## Best Practices

1. **One requirement per behavior** - Don't combine unrelated behaviors
2. **Multiple scenarios per requirement** - Cover success, failure, and edge cases
3. **Specific WHEN/THEN** - Avoid vague language like "handles correctly"
4. **Testable scenarios** - Each scenario should be verifiable
5. **Consistent naming** - Follow conventions throughout the project
