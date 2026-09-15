import { authFetchPath } from "../../../../../lib/auth-session";

export async function GET(_request: Request, { params }: { params: Promise<{ endpointId: string }> }) {
  const { endpointId } = await params;
  return authFetchPath(`webhooks/${encodeURIComponent(endpointId)}/deliveries`);
}
