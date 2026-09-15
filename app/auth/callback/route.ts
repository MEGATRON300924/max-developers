import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DEFAULT_MAX_CLIENT_ID = "max_client_cUC9DEVSPgxp8kh7";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  return value;
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const code = incoming.searchParams.get("code");
  const state = incoming.searchParams.get("state");
  const error = incoming.searchParams.get("error");
  const jar = await cookies();
  const savedState = jar.get("max_oauth_state")?.value;
  const verifier = jar.get("max_oauth_verifier")?.value;
  const next = jar.get("max_oauth_next")?.value ?? null;
  const safeRedirect = safeNext(next);

  const fail = (reason: string) => {
    const response = NextResponse.redirect(new URL(`/sign-in?error=${encodeURIComponent(reason)}&next=${encodeURIComponent(safeRedirect)}`, request.url));
    response.cookies.delete("max_oauth_state");
    response.cookies.delete("max_oauth_verifier");
    response.cookies.delete("max_oauth_next");
    return response;
  };

  if (error) return fail(error);
  if (!code || !state || !savedState || state !== savedState || !verifier) return fail("invalid_oauth_response");

  const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID || DEFAULT_MAX_CLIENT_ID;
  const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
  const redirectUri = process.env.NEXT_PUBLIC_MAX_AUTH_REDIRECT_URI || "https://developers.max-ai.name.ng/auth/callback";

  let tokenResponse: Response;
  try {
    tokenResponse = await fetch(`${authApi}/api/v1/oauth/token`, {
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
  } catch {
    return fail("token_exchange_failed");
  }

  if (!tokenResponse.ok) return fail("token_exchange_failed");

  let token: { access_token?: string; refresh_token?: string; expires_in?: number };
  try {
    token = await tokenResponse.json() as { access_token?: string; refresh_token?: string; expires_in?: number };
  } catch {
    return fail("token_exchange_failed");
  }
  if (!token.access_token || !token.refresh_token) return fail("missing_access_token");

  const response = NextResponse.redirect(new URL(safeRedirect, request.url));
  const secure = process.env.NODE_ENV === "production";
  const accessMaxAge = Math.max(60, token.expires_in ?? 3600);
  response.cookies.set("max_access_token", token.access_token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: accessMaxAge });
  response.cookies.set("max_access_expires_at", String(Date.now() + accessMaxAge * 1000), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: accessMaxAge });
  response.cookies.set("max_refresh_token", token.refresh_token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
  response.cookies.delete("max_oauth_state");
  response.cookies.delete("max_oauth_verifier");
  response.cookies.delete("max_oauth_next");
  return response;
}
