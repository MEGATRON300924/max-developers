import { authFetchPath } from "../../../lib/auth-session";

export async function GET() {
  return authFetchPath("webhooks");
}

export async function POST(request: Request) {
  return authFetchPath("webhooks", { method: "POST", body: JSON.stringify(await request.json()) });
}
