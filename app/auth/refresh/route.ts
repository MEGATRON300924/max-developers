import { NextResponse } from "next/server";

const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID;

function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export async function GET(request: Request) {
  const incoming = new URL(request.url);
  const next = safeNext(incoming.searchParams.get("next"));
  const refreshToken = request.headers.get("cookie")?.match(/(?:^|;\s*)max_refresh_token=([^;]+)/)?.[1];

  if (!refreshToken || !clientId) {
    const response = NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}`, request.url));
    response.cookies.delete("max_access_token");
    response.cookies.delete("max_refresh_token");
    response.cookies.delete("max_access_expires_at");
    return response;
  }

  try {
    const tokenResponse = await fetch(`${authApi}/api/v1/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
      cache: "no-store",
    });

    if (!tokenResponse.ok) throw new Error("refresh_failed");

    const token = await tokenResponse.json() as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    };

    if (!token.access_token) throw new Error("missing_access_token");

    const secure = process.env.NODE_ENV === "production";
    const accessMaxAge = Math.max(60, token.expires_in ?? 3600);
    const response = NextResponse.redirect(new URL(next, request.url));

    response.cookies.set("max_access_token", token.access_token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: accessMaxAge,
    });
    response.cookies.set("max_access_expires_at", String(Date.now() + accessMaxAge * 1000), {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: accessMaxAge,
    });
    if (token.refresh_token) {
      response.cookies.set("max_refresh_token", token.refresh_token, {
        httpOnly: true,
        secure,
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return response;
  } catch {
    const response = NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(next)}&error=session_expired`, request.url));
    response.cookies.delete("max_access_token");
    response.cookies.delete("max_refresh_token");
    response.cookies.delete("max_access_expires_at");
    return response;
  }
}
