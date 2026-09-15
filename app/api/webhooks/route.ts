import { NextResponse } from "next/server";
import { authFetchPath } from "../../../lib/auth-session";

export async function GET() {
  return authFetchPath("webhooks");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return authFetchPath("webhooks", "", { method: "POST", body: JSON.stringify(body) });
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }
}
