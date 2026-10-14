import { NextResponse } from "next/server";
import { cookies } from "next/headers";


function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/onboarding";
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
    response.cookies.delete("max_oauth_state"); response.cookies.delete("max_oauth_verifier"); response.cookies.delete("max_oauth_next"); return response;
  };
  if (error) return fail(error);
  if (!code || !state || !savedState || state !== savedState || !verifier) return fail("invalid_oauth_response");
  const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID?.trim();
  if (!clientId || clientId === "REPLACE_WITH_DEVELOPER_PLATFORM_CLIENT_ID") return fail("max_auth_client_not_configured");
  const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
  const redirectUri = process.env.NEXT_PUBLIC_MAX_AUTH_REDIRECT_URI || "https://developers.max-ai.name.ng/auth/callback";
  let tokenResponse: Response;
  const clientSecret = process.env.MAX_AUTH_CLIENT_SECRET?.trim() || process.env.MAX_AUTH_OAUTH_CLIENT_SECRET?.trim();
  try {
    tokenResponse = await fetch(`${authApi}/api/v1/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        ...(clientSecret ? { client_secret: clientSecret } : {}),
        redirect_uri: redirectUri,
        code_verifier: verifier,
      }),
      cache: "no-store",
    });
  } catch {
    return fail("token_exchange_unreachable");
  }
  let tokenPayload: Record<string, unknown> = {};
  try {
    tokenPayload = await tokenResponse.json() as Record<string, unknown>;
  } catch {
    if (!tokenResponse.ok) return fail("token_exchange_failed");
  }
  if (!tokenResponse.ok) {
    // Keep backend details out of the URL, but show a useful, non-sensitive reason.
    const nested = tokenPayload.error && typeof tokenPayload.error === "object"
      ? tokenPayload.error as Record<string, unknown>
      : {};
    const codeValue = String(tokenPayload.code ?? tokenPayload.error_code ?? nested.code ?? nested.error ?? tokenPayload.error ?? "").toLowerCase();
    const messageValue = String(tokenPayload.message ?? nested.message ?? "").toLowerCase();
    if (codeValue.includes("invalid_client") || messageValue.includes("client credentials")) return fail("token_exchange_invalid_client");
    if (codeValue.includes("invalid_grant") || messageValue.includes("authorization code")) return fail("token_exchange_invalid_grant");
    if (codeValue.includes("invalid_redirect_uri") || messageValue.includes("redirect uri")) return fail("token_exchange_redirect_mismatch");
    if (codeValue.includes("pkce") || messageValue.includes("verifier")) return fail("token_exchange_pkce_failed");
    return fail("token_exchange_failed");
  }
  const token = tokenPayload as { access_token?: string; refresh_token?: string; expires_in?: number };
  if (!token.access_token) return fail("missing_access_token");
  const response = NextResponse.redirect(new URL(safeRedirect, request.url));
  const secure = process.env.NODE_ENV === "production";
  const accessMaxAge = Math.max(60, token.expires_in ?? 3600);
  response.cookies.set("max_access_token", token.access_token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: accessMaxAge });
  response.cookies.set("max_access_expires_at", String(Date.now() + accessMaxAge * 1000), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: accessMaxAge });
  if (token.refresh_token) response.cookies.set("max_refresh_token", token.refresh_token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
  response.cookies.delete("max_oauth_state"); response.cookies.delete("max_oauth_verifier"); response.cookies.delete("max_oauth_next"); return response;
}
