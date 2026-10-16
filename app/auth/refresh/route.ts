import { MAX_AUTH_API_URL } from "../../../lib/max-auth-config";
import { NextResponse } from "next/server";

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/dashboard";
  return value === "/" ? "/dashboard" : value;
}

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  if (!match) return null;
  try { return decodeURIComponent(match[1]); } catch { return null; }
}

function clearSession(response: NextResponse) {
  for (const name of ["max_access_token", "max_refresh_token", "max_access_expires_at"]) {
    response.cookies.set(name, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  }
  return response;
}

type TokenResponse = { access_token?: string; refresh_token?: string; expires_in?: number };
function normalizeToken(payload: unknown): TokenResponse | null {
  if (!payload || typeof payload !== "object") return null;
  const outer = payload as Record<string, unknown>;
  const candidate = outer.data && typeof outer.data === "object"
    ? outer.data as Record<string, unknown>
    : outer;
  if (typeof candidate.access_token !== "string" || !candidate.access_token) return null;
  return {
    access_token: candidate.access_token,
    refresh_token: typeof candidate.refresh_token === "string" ? candidate.refresh_token : undefined,
    expires_in: typeof candidate.expires_in === "number" ? candidate.expires_in : undefined,
  };
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const next = safeNext(incoming.searchParams.get("next"));
  const refreshToken = getCookie(request, "max_refresh_token");
  const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID?.trim();
  const authApi = MAX_AUTH_API_URL;
  const clientSecret = process.env.MAX_AUTH_CLIENT_SECRET?.trim() || process.env.MAX_AUTH_OAUTH_CLIENT_SECRET?.trim();

  if (!clientId || clientId === "REPLACE_WITH_DEVELOPER_PLATFORM_CLIENT_ID") {
    const response = NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}&error=max_auth_client_not_configured`, request.url));
    return clearSession(response);
  }

  if (!refreshToken) {
    const response = NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}`, request.url));
    return clearSession(response);
  }

  try {
    const tokenResponse = await fetch(`${authApi}/api/v1/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        ...(clientSecret ? { client_secret: clientSecret } : {}),
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) throw new Error("refresh_failed");
    const token = normalizeToken(await tokenResponse.json());
    if (!token?.access_token) throw new Error("missing_access_token");

    const secure = process.env.NODE_ENV === "production";
    const accessMaxAge = Math.max(60, token.expires_in ?? 3600);
    const response = NextResponse.redirect(new URL(next, request.url));
    response.cookies.set("max_access_token", token.access_token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: accessMaxAge });
    response.cookies.set("max_access_expires_at", String(Date.now() + accessMaxAge * 1000), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: accessMaxAge });
    if (token.refresh_token) {
      response.cookies.set("max_refresh_token", token.refresh_token, { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
    }
    return response;
  } catch {
    const response = NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}&error=session_expired`, request.url));
    return clearSession(response);
  }
}
