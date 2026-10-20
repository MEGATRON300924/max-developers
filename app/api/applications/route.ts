import { NextResponse } from "next/server";
import { authFetch, authFetchPath } from "../../../lib/auth-session";

export async function GET() {
  const adminResponse = await authFetchPath("admin/oauth-clients");
  if (adminResponse.status === 200) return adminResponse;
  if (adminResponse.status !== 403) return adminResponse;
  return authFetch("");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return authFetch("", { method: "POST", body: JSON.stringify(body) });
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}
