import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";

async function authFetch(clientId: string, init?: RequestInit) {
  const accessToken = (await cookies()).get("max_access_token")?.value;
  if (!accessToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const response = await fetch(`${authApi}/api/v1/oauth/clients/${encodeURIComponent(clientId)}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const text = await response.text();
  let body: unknown = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { message: text || "Request failed" }; }
  return NextResponse.json(body, { status: response.status });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const body = await request.json();
  return authFetch(clientId, { method: "PATCH", body: JSON.stringify(body) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetch(clientId, { method: "DELETE" });
}
