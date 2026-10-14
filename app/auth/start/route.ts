import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";


function base64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/onboarding";
  return value;
}
export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID?.trim();
  if (!clientId || clientId === "REPLACE_WITH_DEVELOPER_PLATFORM_CLIENT_ID") {
    return NextResponse.json({ error: "MAX Auth client is not configured. Set NEXT_PUBLIC_MAX_AUTH_CLIENT_ID in the deployment environment." }, { status: 500 });
  }
  const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
  const redirectUri = process.env.NEXT_PUBLIC_MAX_AUTH_REDIRECT_URI || "https://developers.max-ai.name.ng/auth/callback";
  const incoming = new URL(request.url);
  const safeRedirect = safeNext(incoming.searchParams.get("next"));
  const state = base64url(crypto.randomBytes(32));
  const verifier = base64url(crypto.randomBytes(48));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  jar.set("max_oauth_state", state, { httpOnly: true, secure, sameSite: "lax", path: "/auth", maxAge: 600 });
  jar.set("max_oauth_verifier", verifier, { httpOnly: true, secure, sameSite: "lax", path: "/auth", maxAge: 600 });
  jar.set("max_oauth_next", safeRedirect, { httpOnly: true, secure, sameSite: "lax", path: "/auth", maxAge: 600 });
  const url = new URL(`${authApi}/api/v1/oauth/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  // Request only baseline sign-in scopes here. Optional/privileged scopes must be enabled for this client in MAX Auth first.
  url.searchParams.set("scope", "openid profile email");
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);
  return NextResponse.redirect(url);
}
