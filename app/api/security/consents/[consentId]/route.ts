import { authFetchPath } from "../../../../../lib/auth-session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ consentId: string }> }) {
  const { consentId } = await params;
  return authFetchPath(`oauth/consents/${encodeURIComponent(consentId)}`, "", { method: "DELETE" });
}
