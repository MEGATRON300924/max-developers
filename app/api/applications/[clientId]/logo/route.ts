import { NextResponse } from "next/server";
import { authFetchPath } from "../../../../../lib/auth-session";

export async function POST(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  try {
    const body = await request.json();
    return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/logo`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ message: "Invalid image upload" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/logo`, { method: "DELETE" });
}
