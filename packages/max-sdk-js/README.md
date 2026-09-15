# @max-ai/sdk

Official JavaScript / TypeScript client for the MAX Developer Platform.

## Installation

```bash
npm install @max-ai/sdk
```

## Usage

```ts
import MaxClient from "@max-ai/sdk";

const max = new MaxClient({
  accessToken: process.env.MAX_ACCESS_TOKEN,
});

const user = await max.userinfo();
console.log(user);
```

The SDK uses the production MAX Auth API by default:
`https://auth.max-ai.name.ng/api/v1`

OAuth authorization, PKCE, client registration and client secrets remain managed by MAX Auth. Never expose a confidential client secret in browser code.
