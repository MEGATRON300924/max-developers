import { authFetch } from "../../../lib/auth-session";

export async function GET() { return authFetch(""); }

export async function POST(request: Request) {
  const body = await request.json();
  return authFetch("", { method: "POST", body: JSON.stringify(body) });
}
