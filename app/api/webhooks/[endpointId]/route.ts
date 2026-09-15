import { authFetchPath } from "../../../../lib/auth-session";

export async function PATCH(request: Request, { params }: { params: Promise<{ endpointId: string }> }) {
  const { endpointId } = await params;
  return authFetchPath(`webhooks/${endpointId}`, { method: "PATCH", body: JSON.stringify(await request.json()) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ endpointId: string }> }) {
  const { endpointId } = await params;
  return authFetchPath(`webhooks/${endpointId}`, { method: "DELETE" });
}
