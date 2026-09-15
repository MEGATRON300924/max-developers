import { cookies } from "next/headers";

export type MaxUser = {
  sub?: string;
  name?: string;
  preferred_username?: string;
  email?: string;
  picture?: string;
};

const authApi = process.env.NEXT_PUBLIC_MAX_AUTH_URL || "https://auth.max-ai.name.ng";

export async function getMaxUser(): Promise<MaxUser | null> {
  const token = (await cookies()).get("max_access_token")?.value;
  if (!token) return null;

  try {
    const response = await fetch(`${authApi}/api/v1/oauth/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) return null;
    return await response.json() as MaxUser;
  } catch {
    return null;
  }
}
