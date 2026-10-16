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

    const payload = await response.json() as Record<string, unknown>;
    const data = payload.data && typeof payload.data === "object"
      ? payload.data as Record<string, unknown>
      : payload;
    const profile = data.user && typeof data.user === "object"
      ? data.user as Record<string, unknown>
      : data.profile && typeof data.profile === "object"
        ? data.profile as Record<string, unknown>
        : data;

    // MAX Auth responses may wrap the standard OIDC userinfo profile in data/user.
    // Normalize it here so dashboard session checks work with either response shape.
    if (!profile.sub && typeof profile.id === "string") profile.sub = profile.id;
    if (!profile.name && typeof profile.full_name === "string") profile.name = profile.full_name;
    if (!profile.preferred_username && typeof profile.username === "string") profile.preferred_username = profile.username;

    if (typeof profile.sub !== "string" || !profile.sub) return null;

    return {
      sub: profile.sub,
      name: typeof profile.name === "string" ? profile.name : undefined,
      preferred_username: typeof profile.preferred_username === "string" ? profile.preferred_username : undefined,
      email: typeof profile.email === "string" ? profile.email : undefined,
      picture: typeof profile.picture === "string" ? profile.picture : undefined,
    };
  } catch {
    return null;
  }
}
