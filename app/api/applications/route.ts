import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";

async function token() {
  return (await cookies()).get("max_access_token")?.value;
}

async function authFetch(path: string, init?: RequestInit) {
  const accessToken = await token();
  if (!accessToken) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const response = await fetch(`${authApi}/api/v1/oauth/clients${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const text = await response.text();
  let body: unknown = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = { message: text || "Request failed" }; }
  return NextResponse.json(body, { status: response.status });
}

export async function GET() {
  return authFetch("");
}

export async function POST(request: Request) {
  const body = await request.json();
  return authFetch("", { method: "POST", body: JSON.stringify(body) });
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
