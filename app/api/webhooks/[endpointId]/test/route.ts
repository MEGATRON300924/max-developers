import { authFetchPath } from "../../../../../lib/auth-session";

export async function POST(_request: Request, { params }: { params: Promise<{ endpointId: string }> }) {
  const { endpointId } = await params;
  return authFetchPath(`webhooks/${endpointId}/test`, { method: "POST" });
}
