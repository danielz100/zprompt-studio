# Security Policy

## Reporting

Found a vulnerability? Email **danielzumarraga999@gmail.com** with subject `[SECURITY] zprompt-studio`. **Do not open public issues.**

Include: affected version/commit, repro steps, impact assessment.

Response SLA: ack within 72h, fix or mitigation plan within 14 days for critical issues.

## Supported versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅        |
| < 0.1   | ❌        |

## Threat model

- **V2 invariant**: BYOK key never logged, never persisted server-side, never in URLs. Any code path that violates this is a critical bug.
- **V7 invariant**: all DB writes scoped via Supabase RLS to `auth.uid()`. Cross-tenant reads/writes are critical.
- **V14 invariant**: no secrets in repo. `.env*` gitignored, only `.env.example` tracked.

## Out of scope

User's own API key compromise (BYOK is user's responsibility). DoS via free-tier abuse on user's own Google AI quota.

## Disclosure

After fix shipped, we credit reporters in [CHANGELOG.md](./CHANGELOG.md) unless they request anonymity.
