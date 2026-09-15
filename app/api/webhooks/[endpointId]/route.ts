import { NextResponse } from "next/server";
import { authFetchPath } from "../../../../lib/auth-session";

export async function PATCH(request: Request, { params }: { params: Promise<{ endpointId: string }> }) {
  const { endpointId } = await params;
  try {
    const body = await request.json();
    return authFetchPath(`webhooks/${encodeURIComponent(endpointId)}`, "", { method: "PATCH", body: JSON.stringify(body) });
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ endpointId: string }> }) {
  const { endpointId } = await params;
  return authFetchPath(`webhooks/${encodeURIComponent(endpointId)}`, "", { method: "DELETE" });
}
