import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "node:crypto";

function base64url(input: Buffer) {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID;
  const authFrontend = process.env.NEXT_PUBLIC_MAX_AUTH_FRONTEND_URL || "https://api.max-ai.name.ng";
  const redirectUri = process.env.NEXT_PUBLIC_MAX_AUTH_REDIRECT_URI || new URL("/auth/callback", request.url).toString();
  const incoming = new URL(request.url);
  const next = incoming.searchParams.get("next");
  const safeNext = next && next.startsWith("/") ? next : "/";

  if (!clientId || clientId.startsWith("REPLACE_")) {
    return NextResponse.redirect(new URL(`/sign-in?error=missing_client&next=${encodeURIComponent(safeNext)}`, request.url));
  }

  const state = base64url(crypto.randomBytes(32));
  const verifier = base64url(crypto.randomBytes(48));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";

  jar.set("max_oauth_state", state, { httpOnly: true, secure, sameSite: "lax", path: "/auth", maxAge: 600 });
  jar.set("max_oauth_verifier", verifier, { httpOnly: true, secure, sameSite: "lax", path: "/auth", maxAge: 600 });
  jar.set("max_oauth_next", safeNext, { httpOnly: true, secure, sameSite: "lax", path: "/auth", maxAge: 600 });

  const url = new URL(`${authFrontend}/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  // The developer platform only needs the MAX access token and user profile/email.
  // Do not request OIDC's `openid` scope here because that requires MAX Auth to
  // have an OIDC signing key configured in production in order to mint an ID token.
  url.searchParams.set("scope", "profile email");
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);

  return NextResponse.redirect(url);
}
