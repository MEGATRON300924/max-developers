import { NextResponse } from "next/server";

const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID || "max_client_cUC9DEVSPgxp8kh7";

function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  if (!match) return null;
  try { return decodeURIComponent(match[1]); } catch { return null; }
}

export async function GET(request: Request) {
  const refreshToken = getCookie(request, "max_refresh_token");
  const accessToken = getCookie(request, "max_access_token");
  const tokens = [refreshToken, accessToken].filter(Boolean) as string[];

  await Promise.allSettled(tokens.map(async (token) => {
    try {
      await fetch(`${authApi}/api/v1/oauth/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, client_id: clientId }),
        cache: "no-store",
      });
    } catch {
      // Local session cookies are still cleared even if MAX Auth is temporarily unreachable.
    }
  }));

  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  response.cookies.delete("max_access_token");
  response.cookies.delete("max_refresh_token");
  response.cookies.delete("max_access_expires_at");
  return response;
}
