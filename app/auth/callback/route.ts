import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const code = incoming.searchParams.get("code");
  const state = incoming.searchParams.get("state");
  const error = incoming.searchParams.get("error");
  const jar = await cookies();
  const savedState = jar.get("max_oauth_state")?.value;
  const verifier = jar.get("max_oauth_verifier")?.value;

  const fail = (reason: string) => NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(reason)}`, request.url));
  if (error) return fail(error);
  if (!code || !state || !savedState || state !== savedState || !verifier) return fail("invalid_oauth_response");

  const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID;
  const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
  const redirectUri = process.env.NEXT_PUBLIC_MAX_AUTH_REDIRECT_URI || new URL("/auth/callback", request.url).toString();
  if (!clientId || clientId.startsWith("REPLACE_")) return fail("missing_client");

  const tokenResponse = await fetch(`${authApi}/api/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) return fail("token_exchange_failed");
  const token = await tokenResponse.json() as { access_token?: string; expires_in?: number };
  if (!token.access_token) return fail("missing_access_token");

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.set("max_access_token", token.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, token.expires_in ?? 3600),
  });
  response.cookies.delete("max_oauth_state");
  response.cookies.delete("max_oauth_verifier");
  return response;
}
