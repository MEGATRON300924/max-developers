# MAX Developer Platform

The developer console for The MAX AI Ecosystem.

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

Copy `.env.example` to `.env.local` and set the MAX Auth developer-platform client ID after registering this portal as a public PKCE OAuth application.

The production callback is:

`https://developers.max-ai.name.ng/auth/callback`

The portal uses Authorization Code + PKCE and does not require a browser client secret.

## Current Phase 1 foundation

- MAX Account sign-in screen
- MAX Auth PKCE start/callback routes
- Developer dashboard
- Applications area
- Application creation UI
- Credentials foundation
- Activity/build/manage navigation structure
- Responsive MAX Account-style visual system
- Light/dark theme support

## Next implementation steps

1. Register the developer portal OAuth client in MAX Auth.
2. Connect application creation to the MAX Auth OAuth client API.
3. Add authenticated server sessions and account data.
4. Add application detail/edit/revoke flows.
5. Add documentation and API catalogue foundation.
