import { NextResponse } from "next/server";
import { authFetch, authFetchPath } from "../../../../../lib/auth-session";

export async function GET(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  const applicationResponse = await authFetch("");
  if (!applicationResponse.ok) return applicationResponse;

  const data = await applicationResponse.json() as { clients?: Array<Record<string, unknown>> };
  const client = data.clients?.find((item) => item.id === clientId);
  if (!client) return NextResponse.json({ message: "Application not found." }, { status: 404 });

  const clientOAuthId = typeof client.clientId === "string" ? client.clientId : "";
  if (!clientOAuthId) return NextResponse.json({ message: "Application is missing its OAuth client ID." }, { status: 500 });

  const incoming = new URL(request.url).searchParams;
  const query = new URLSearchParams({ client_id: clientOAuthId });
  const redirectUri = incoming.get("redirect_uri");
  const scope = incoming.get("scope");
  if (redirectUri) query.set("redirect_uri", redirectUri);
  if (scope) query.set("scope", scope);

  return authFetchPath("oauth/client-tester", `?${query.toString()}`);
}
