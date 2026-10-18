# AgentShield 🛡️

**Safer AI-powered actions for Google Calendar.**

AgentShield is an AI-powered security platform designed to make AI-driven Google Calendar actions safer. It combines AI-based planning with deterministic security checks to help identify unauthorized or potentially unsafe actions before execution.

Built using **NVIDIA Nemotron** through **Nebius Token Factory**, AgentShield explores how AI agents can interact with productivity tools while keeping security, user control, and action validation at the center of the workflow.

## ✨ Key Features

* **AI-Powered Planning:** Uses NVIDIA Nemotron to interpret user requests and propose appropriate actions.
* **Security Policy Guard:** Applies deterministic policy checks to evaluate proposed actions.
* **Google Calendar Integration:** Supports calendar-related workflows through backend functions and Google OAuth.
* **Provenance Support:** Includes helper logic for tracking action-related information.
* **Web Interface:** Built with React and Vite.
* **Backend Integration:** Uses Base44 services for authentication, entities, and server-side functions.

Feature availability depends on the current implementation and backend configuration.

## 🎯 Try it

**Try AgentShield:** https://nocturnal-secure-agent-shield.base44.app

## 🧠 NVIDIA Nemotron & Nebius Token Factory

AgentShield integrates the `nvidia/nemotron-3-super-120b-a12b` model through Nebius Token Factory using an OpenAI-compatible chat-completions endpoint.

The model supports AI-powered planning by interpreting user requests and proposing candidate Google Calendar actions. These proposed actions are intended to pass through a separate deterministic security layer before reaching the backend execution workflow.

Nebius Token Factory provides the model inference endpoint used to integrate Nemotron into the application.

The AI model proposes actions; security validation and authorization should remain separate from the model's decision.

## 🏗️ Architecture

AgentShield combines AI planning with a separate security layer.

1. **User Interface:** Receives user requests through the React + Vite application.
2. **AI Planning:** Sends supported requests to NVIDIA Nemotron through Nebius Token Factory.
3. **Security Validation:** Uses deterministic policy checks to evaluate proposed actions.
4. **Backend Execution:** Routes supported operations through Base44 server functions.
5. **Google Calendar:** Supports configured calendar operations through server-side OAuth integration.

The security layer is designed to reduce reliance on AI-generated decisions alone. It does not guarantee that every unsafe action will be blocked.

## 🧰 Technology Stack

* **Frontend:** React + Vite
* **AI Model:** `nvidia/nemotron-3-super-120b-a12b`
* **AI Infrastructure:** Nebius Token Factory
* **Backend Services:** Base44 SDK and server functions
* **Calendar Integration:** Google Calendar OAuth
* **Security Logic:** Deterministic policy guard and provenance helper

## ⚙️ Requirements

* Node.js 20 or later
* npm
* A configured Base44 application
* A Nebius Token Factory API key
* Google OAuth credentials if Calendar integration is enabled

## 🚀 Local Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AgentShield
```

https://github.com/alya75663/Agentshiled/tree/main 

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and configure the required public frontend settings.

```bash
cp .env.example .env.local
```

**Security:** Never expose `NEBIUS_API_KEY`, `GOOGLE_CLIENT_SECRET`, or OAuth tokens in browser code or variables prefixed with `VITE_`. Keep secrets in the appropriate server-side environment.

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Follow the local URL printed by Vite.

### 5. Configure backend services

Import or deploy the `functions/` and `entities/` files into the configured Base44 application according to the platform's supported workflow.

The frontend relies on Base44 APIs, including `base44.entities.*` and `base44.functions.invoke`. Running the frontend alone does not provide these backend services.

## 🔐 Security Considerations

Before using AgentShield with real calendar data, review the following:

* Enforce server-side authorization and resource ownership checks.
* Never trust client-supplied trust levels or security decisions.
* Validate AI-generated actions and parameters against strict schemas.
* Require verified approval for sensitive or high-risk actions.
* Add idempotency protection to prevent duplicate calendar events.
* Keep OAuth tokens and API secrets server-side.
* Validate OAuth state and protect against replay attacks.
* Ensure the Google OAuth redirect URI matches the configured Base44 endpoint.

These are security review priorities, not claims that every safeguard is already implemented.

## 🧪 Project Status

AgentShield is a development project exploring safer AI-agent interactions with Google Calendar.

Some features require additional backend configuration, credentials, and testing. Verify the build, backend behavior, OAuth flow, and security controls before deploying the application with real user data.

## 📂 Repository Structure

```text
AgentShield/
├── src/          # Frontend application
├── functions/    # Backend functions
├── entities/     # Data entity definitions
├── shared/       # Shared security and integration helpers
├── .env.example  # Environment variable template
├── README.md
└── package.json
```

The exact structure may vary depending on the final source exported from Base44.

## 📌 Source Code Notes

Some files in this repository may be reconstructed from development notes or code excerpts rather than exported directly from the original Base44 application.

Compare the repository against the original project before treating it as the canonical source. Verify the build, backend behavior, OAuth flow, and security controls before public release.

## 📄 License

This project includes an MIT license file. Confirm that you have the right to distribute all included code and that the license is appropriate for the project. Third-party dependencies remain subject to their respective licenses.
