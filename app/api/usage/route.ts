import { authFetchPath } from "../../../lib/auth-session";

export async function GET() {
  return authFetchPath("security/usage");
}
