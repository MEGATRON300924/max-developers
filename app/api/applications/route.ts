import { NextResponse } from "next/server";
import { authFetch } from "../../../lib/auth-session";

export async function GET() {
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
