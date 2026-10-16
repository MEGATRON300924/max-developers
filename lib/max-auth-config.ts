/**
 * Canonical origins used by the MAX Developers authentication flow.
 *
 * API requests always go to the MAX Auth API host. The browser is sent to the
 * separately deployed MAX Auth frontend only for account UI; OAuth then returns
 * to the exact Developers callback registered on the client.
 */
export const MAX_AUTH_API_URL = (process.env.MAX_AUTH_URL || "https://auth.max-ai.name.ng").replace(/\/$/, "");
export const MAX_AUTH_FRONTEND_URL = (process.env.NEXT_PUBLIC_MAX_AUTH_FRONTEND_URL || "https://api.max-ai.name.ng").replace(/\/$/, "");
export const MAX_DEVELOPERS_URL = (process.env.MAX_DEVELOPERS_URL || "https://developers.max-ai.name.ng").replace(/\/$/, "");
