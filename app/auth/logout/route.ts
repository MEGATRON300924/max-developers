import { NextResponse } from "next/server";

const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID;

export async function GET(request: Request) {
  const requestCookies = request.headers.get("cookie") || "";
  const refreshToken = requestCookies.match(/(?:^|;\s*)max_refresh_token=([^;]+)/)?.[1];
  const accessToken = requestCookies.match(/(?:^|;\s*)max_access_token=([^;]+)/)?.[1];

  if (clientId) {
    const tokens = [refreshToken, accessToken].filter(Boolean) as string[];
    await Promise.allSettled(tokens.map((token) => fetch(`${authApi}/api/v1/oauth/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, client_id: clientId }),
      cache: "no-store",
    })));
  }

  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  response.cookies.delete("max_access_token");
  response.cookies.delete("max_refresh_token");
  response.cookies.delete("max_access_expires_at");
  return response;
}
