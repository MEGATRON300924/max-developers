import { authFetchPath } from "../../../../../lib/auth-session";

export async function POST(_request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return authFetchPath("oauth/clients", `/${encodeURIComponent(clientId)}/verify-manifest`, { method: "POST" });
}
