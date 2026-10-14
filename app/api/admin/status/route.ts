import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("max_access_token")?.value;
  if (!token) return NextResponse.json({ isAdmin: false }, { status: 200 });
  const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
  try {
    const response = await fetch(`${authApi}/api/v1/oauth/userinfo`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!response.ok) return NextResponse.json({ isAdmin: false }, { status: 200 });
    const user = await response.json() as Record<string, unknown>;
    const username = String(user.username ?? user.preferred_username ?? user.handle ?? "").replace(/^@/, "").toLowerCase();
    const admins = (process.env.MAX_DEVELOPERS_ADMIN_USERNAMES || "zionopaaje").split(",").map((name) => name.trim().replace(/^@/, "").toLowerCase()).filter(Boolean);
    return NextResponse.json({ isAdmin: Boolean(username) && admins.includes(username) });
  } catch {
    return NextResponse.json({ isAdmin: false }, { status: 200 });
  }
}
