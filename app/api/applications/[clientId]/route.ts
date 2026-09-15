import { NextResponse } from "next/server";
import { authFetch } from "../../../../lib/auth-session";

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
  try {
    const body = await request.json();
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
