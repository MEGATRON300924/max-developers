import { NextResponse } from "next/server";
import { authFetchPath } from "../../../../../lib/auth-session";

export async function GET(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/config`);
}

export async function PUT(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  try {
    const body = await request.json();
    return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/config`, { method: "PUT", body: JSON.stringify(body) });
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}
