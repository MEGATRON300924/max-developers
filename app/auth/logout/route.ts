import { MAX_AUTH_API_URL } from "../../../lib/max-auth-config";
import { NextResponse } from "next/server";
const authApi = MAX_AUTH_API_URL;
const clientId = process.env.NEXT_PUBLIC_MAX_AUTH_CLIENT_ID?.trim() || "";
function getCookie(request: Request, name: string) { const cookieHeader = request.headers.get("cookie") || ""; const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`)); if (!match) return null; try { return decodeURIComponent(match[1]); } catch { return null; } }
export async function GET(request: Request) {
  const refreshToken = getCookie(request, "max_refresh_token"); const accessToken = getCookie(request, "max_access_token"); const tokens = [refreshToken, accessToken].filter(Boolean) as string[];
  await Promise.allSettled(tokens.map(async (token) => { try { await fetch(`${authApi}/api/v1/oauth/revoke`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, client_id: clientId }), cache: "no-store" }); } catch {} }));
  const response = NextResponse.redirect(new URL("/sign-in", request.url)); response.cookies.delete("max_access_token"); response.cookies.delete("max_refresh_token"); response.cookies.delete("max_access_expires_at"); return response;
}
