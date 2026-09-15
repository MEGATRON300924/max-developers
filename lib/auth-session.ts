import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID;

const accessCookie = "max_access_token";
const refreshCookie = "max_refresh_token";
const expiryCookie = "max_access_expires_at";

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

async function parseResponse(response: Response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { message: text || "Request failed" };
  }
}

async function refreshSession(jar: Awaited<ReturnType<typeof cookies>>) {
  const refreshToken = jar.get(refreshCookie)?.value;
  if (!refreshToken || !clientId) return null;

  try {
    const response = await fetch(`${authApi}/api/v1/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
      }),
      cache: "no-store",
    });

    if (!response.ok) return null;
    const token = await parseResponse(response) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
    } | null;

    if (!token?.access_token) return null;

    const accessMaxAge = Math.max(60, token.expires_in ?? 3600);
    jar.set(accessCookie, token.access_token, cookieOptions(accessMaxAge));
    jar.set(expiryCookie, String(Date.now() + accessMaxAge * 1000), cookieOptions(accessMaxAge));
    if (token.refresh_token) jar.set(refreshCookie, token.refresh_token, cookieOptions(30 * 24 * 60 * 60));
    return token.access_token;
  } catch {
    return null;
  }
}

export async function authFetchPath(basePath: string, path = "", init?: RequestInit) {
  const jar = await cookies();
  let accessToken = jar.get(accessCookie)?.value;
  if (!accessToken) accessToken = await refreshSession(jar) || undefined;
  if (!accessToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const request = () => fetch(`${authApi}/api/v1/${basePath.replace(/^\/+|\/+$/g, "")}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  try {
    let response = await request();
    if (response.status === 401) {
      const refreshed = await refreshSession(jar);
      if (refreshed) {
        accessToken = refreshed;
        response = await request();
      }
    }

    const body = await parseResponse(response);
    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json({ message: "MAX Auth is temporarily unavailable" }, { status: 503 });
  }
}

export async function authFetch(path: string, init?: RequestInit) {
  return authFetchPath("oauth/clients", path, init);
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(accessCookie);
  jar.delete(refreshCookie);
  jar.delete(expiryCookie);
}
