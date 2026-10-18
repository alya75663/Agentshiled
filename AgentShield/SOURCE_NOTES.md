# Source notes and completeness audit

This package is intentionally labeled as a review/source bundle, not a verified release.

## Preserved from files shared in chat
- `src/pages/Policies.jsx` (complete pasted attachment)
- `src/pages/OAuthConsent.jsx` (complete pasted attachment; this is Base44 MCP consent, not Google OAuth)
- Entity schemas reconstructed from the exact JSON supplied for Action, Decision, Message, Policy, GoogleCalendarToken, and EvaluationTest.
- Frontend and server snippets reproduced/reconstructed from the code and descriptions in the conversation.

## Must compare against the Base44 editor before public submission
The full original versions of these files were not available as downloadable source files in this conversation; the versions included here are reconstructed scaffolding rather than byte-for-byte copies: Dashboard, Login/Register/ForgotPassword/ResetPassword, AuthContext, ProtectedRoute, Layout, Evaluation, DecisionLog, GuardCard, PlannerCard, ProvenanceCard, Timeline, CalendarConnect, shared guard/provenance/nebius/googleOAuth, and server functions.

## Known concerns
- OAuth state is signed and time-limited in this reconstructed helper but is not single-use; improve replay protection before production.
- `executeCalendarAction` uses a reconstructed entity ownership check; verify exact entity APIs and Base44 created_by_id behavior.
- Google Calendar event date/time must be normalized to RFC3339 and timezone-aware values before use.
- `ASK_USER` currently does not have a complete confirm-then-execute route in this scaffold.
- Base44 SDK and server APIs may require platform-specific setup not represented by this ZIP.
- `OAuthConsent.jsx` requires Base44 MCP endpoints and is not wired as a normal route in this scaffold.
