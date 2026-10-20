import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authFetch, authFetchPath } from "../../../../lib/auth-session";

export async function GET(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const response = await authFetch("");
  if (!response.ok) return response;

  const data = await response.json() as { clients?: Array<Record<string, unknown>> };
  const client = data.clients?.find((item) => item.id === clientId);
  if (!client) return NextResponse.json({ message: "Application not found." }, { status: 404 });
  return NextResponse.json({ client });
}

async function isMaxAdmin() {
  const token = (await cookies()).get("max_access_token")?.value;
  if (!token) return false;
  const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";
  try {
    const response = await fetch(`${authApi}/api/v1/oauth/userinfo`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!response.ok) return false;
    const user = await response.json() as Record<string, unknown>;
    const username = String(user.username ?? user.preferred_username ?? user.handle ?? "").replace(/^@/, "").toLowerCase();
    const admins = (process.env.MAX_DEVELOPERS_ADMIN_USERNAMES || "zionopaaje").split(",").map((name) => name.trim().replace(/^@/, "").toLowerCase()).filter(Boolean);
    return admins.includes(username);
  } catch { return false; }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  try {
    const body = await request.json() as { scopes?: unknown };
    if (Array.isArray(body.scopes) && body.scopes.includes("developer:manage") && !(await isMaxAdmin())) {
      return NextResponse.json({ message: "The developer:manage permission is restricted to approved MAX AI Ecosystem administrators." }, { status: 403 });
    }
    const adminResponse = await authFetchPath(`admin/oauth-clients/${encodeURIComponent(clientId)}`, "", { method: "PATCH", body: JSON.stringify(body) });
    if (adminResponse.status === 200) return adminResponse;
    if (adminResponse.status !== 403) return adminResponse;
    return authFetch(`/${encodeURIComponent(clientId)}`, { method: "PATCH", body: JSON.stringify(body) });
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetch(`/${encodeURIComponent(clientId)}`, { method: "DELETE" });
}

export async function POST(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetch(`/${encodeURIComponent(clientId)}/rotate-secret`, { method: "POST", body: JSON.stringify({}) });
}
