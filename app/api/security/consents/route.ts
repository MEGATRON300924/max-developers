import { authFetchPath } from "../../../../lib/auth-session";

export async function GET() {
  return authFetchPath("oauth/consents");
}
