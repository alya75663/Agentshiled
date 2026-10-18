# AgentShield
AgentShield is an AI-powered security platform designed to help users manage Google Calendar actions more safely. It integrates AI-based planning with security checks to reduce the risk of unauthorized or potentially unsafe actions.

The project uses NVIDIA Nemotron through Nebius Token Factory and includes a web interface, security policies, and supporting backend functions.

This repository contains the project source code and setup documentation. Some features may require additional configuration, including Base44 backend services and Google Calendar OAuth credentials.

## Current architecture

- React + Vite interface.
- Base44 SDK for authentication, entities, and server functions.
- Nebius Token Factory OpenAI-compatible chat-completions endpoint configured for `nvidia/nemotron-3-super-120b-a12b`.
- Deterministic policy guard and provenance helper.
- Google Calendar OAuth token storage and event creation through Base44 server functions.

## Requirements

- Node.js 20+ and npm.
- A configured Base44 app for the SDK-based UI/functions.
- A Nebius Token Factory API key.
- Google OAuth credentials and an authorized redirect URI if Calendar integration is enabled.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in public Base44 configuration values. Never put `NEBIUS_API_KEY` or `GOOGLE_CLIENT_SECRET` in a `VITE_` variable or browser code.
2. Install dependencies: `npm install`.
3. Run the Vite frontend: `npm run dev`.
4. Deploy/import the `functions/` and `entities/` files into the configured Base44 app according to the platform's current workflow.

The UI still calls Base44 APIs (`base44.entities.*` and `base44.functions.invoke`). A plain GitHub Pages deployment will not provide those backend services. GitHub stores the source; it does not run the Base44 backend.

## Security notes before public release

- Review ownership checks in `executeCalendarAction`; service-role access must not permit cross-user execution.
- Do not trust `trust_level` supplied by the browser. Derive trust from a server-verified source.
- Validate every model-generated action and its parameters with a strict schema.
- Consider fail-closed defaults for high-risk actions and add an explicit, server-verified approval path for `ASK_USER`.
- Add idempotency protection to avoid duplicate Calendar events.
- OAuth tokens must remain server-side and never be logged or returned to the client.
- The custom OAuth redirect URI currently points at the Base44 app URL and must match the Google Cloud OAuth configuration.

## Source fidelity

The two files `src/pages/Policies.jsx` and `src/pages/OAuthConsent.jsx` are preserved from pasted source attachments. Several app components and backend functions were reconstructed from the descriptions and code excerpts in the conversation; they are marked in their headers. Compare them with your Base44 editor before treating them as the canonical source.

## License

MIT license included for this project bundle. Confirm you have the right to sublicense all included dependencies, generated code, and platform-specific pieces before publishing. Third-party packages retain their own licenses.
