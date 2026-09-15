import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";

async function authFetch(path: string, init?: RequestInit) {
  const accessToken = (await cookies()).get("max_access_token")?.value;
  if (!accessToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const response = await fetch(`${authApi}/api/v1/oauth/clients${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const text = await response.text();
  let body: unknown = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { message: text || "Request failed" }; }
  return NextResponse.json(body, { status: response.status });
}

export async function GET(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const response = await authFetch("");
  if (!response.ok) return response;

  const data = await response.json() as { clients?: Array<Record<string, unknown>> };
  const client = data.clients?.find((item) => item.id === clientId);
  if (!client) return NextResponse.json({ message: "Application not found." }, { status: 404 });
  return NextResponse.json({ client });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const body = await request.json();
  return authFetch(`/${encodeURIComponent(clientId)}`, { method: "PATCH", body: JSON.stringify(body) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetch(`/${encodeURIComponent(clientId)}`, { method: "DELETE" });
}

export async function POST(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetch(`/${encodeURIComponent(clientId)}/rotate-secret`, { method: "POST", body: JSON.stringify({}) });
}
