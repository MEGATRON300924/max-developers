# @max-ai/sdk

Official JavaScript / TypeScript client for the MAX Developer Platform.

> **Current distribution:** The package is available in the MAX Developers source repository, but it has not been published to the public npm registry yet.

## Build from source

From the repository root:

```bash
cd packages/max-sdk-js
npm install
npm run build
```

The compiled package is written to `dist/`.

## Usage

```ts
import MaxClient from "@max-ai/sdk";

const max = new MaxClient({
  accessToken: process.env.MAX_ACCESS_TOKEN,
});

const user = await max.userinfo();
console.log(user);
```

For OAuth token revocation, provide the registered OAuth client ID. Confidential clients must also provide their client secret:

```ts
const max = new MaxClient({
  clientId: process.env.MAX_CLIENT_ID,
  clientSecret: process.env.MAX_CLIENT_SECRET,
});

await max.revoke(process.env.MAX_ACCESS_TOKEN!);
```

The SDK uses the production MAX Auth API by default:
`https://auth.max-ai.name.ng/api/v1`

OAuth authorization, PKCE, client registration and client secrets remain managed by MAX Auth. Never expose a confidential client secret in browser code.
