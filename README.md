# MAX Developer Platform

The developer console for **The MAX AI Ecosystem**, built by The Tron Forge Limited.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Lucide icons
- Plus Jakarta Sans
- Vercel-ready

## Local development

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env.local` and set the registered MAX Auth developer-platform client ID.

Production URLs:

- Developer Platform: `https://developers.max-ai.name.ng`
- MAX Auth frontend: `https://api.max-ai.name.ng`
- MAX Auth API: `https://auth.max-ai.name.ng/api/v1`
- OAuth callback: `https://developers.max-ai.name.ng/auth/callback`

The portal uses OAuth 2.0 Authorization Code + PKCE with S256 and does not require a browser client secret.

## Platform status

The current implementation includes the following production-oriented platform areas:

- MAX Account OAuth sign-in and callback handling
- PKCE, state validation, secure session cookies, refresh-token rotation, and logout
- Developer dashboard with live MAX Auth data
- OAuth applications: list, detail, revoke, and management links
- Credentials: client IDs, public/confidential client handling, and secret rotation
- API catalogue and real MAX Auth API endpoint references
- Documentation for authentication, OAuth, errors, rate limits, and security
- Security dashboard with real audit events and OAuth consent management
- Usage analytics backed by MAX Auth request telemetry
- Webhooks: endpoint creation, subscriptions, testing, delivery history, secret rotation, and deletion
- Activity and security event views
- Developer settings
- Official JavaScript/TypeScript SDK source under `packages/max-sdk-js`
- Responsive light/dark MAX-branded interface
- Production security headers and reduced framework fingerprinting
- GitHub Actions build validation for the main branch and pull requests

## Architecture

MAX Auth is the identity and OAuth source of truth. MAX Developers acts as the developer-console client and proxies authenticated operations to MAX Auth through server-side routes. The portal does not maintain a duplicate OAuth-client database.

## Security model

- Authorization Code + S256 PKCE
- Exact registered redirect URI validation
- OAuth authorization codes are single-use and expire
- Refresh-token rotation
- Opaque OAuth access tokens
- Secure, HTTP-only session cookies in production
- OAuth client secrets are never displayed in normal listings
- Webhook delivery signing and endpoint validation
- Server-side authenticated API proxying
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- Strict referrer policy
- Restricted browser permissions
- Next.js powered-by header disabled

## SDK

The JavaScript/TypeScript SDK is currently maintained as a source package in this repository. It is not published to npm yet. The SDK supports authenticated API requests, userinfo, token introspection, and token revocation. OAuth authorization and PKCE remain handled by MAX Auth.

## Repository status

This repository contains the current MAX Developers implementation on the `main` branch. Deployment configuration and production environment values must be supplied by the hosting platform; secrets are intentionally not committed to Git.
