import { NextResponse } from "next/server";
import { authFetchPath } from "../../../../../lib/auth-session";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id || id.length > 128) {
    return NextResponse.json({ message: "Invalid OAuth client ID." }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  const response = await authFetchPath("oauth/clients", `/${encodeURIComponent(id)}/rotate-secret`, { method: "POST" });
  response.headers.set("Cache-Control", "no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}
