import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/auth/") ||
    pathname === "/sign-in"
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("max_access_token")?.value;
  const refreshToken = request.cookies.get("max_refresh_token")?.value;

  if (!accessToken || !refreshToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(url);
  }

  const expiresAt = Number(request.cookies.get("max_access_expires_at")?.value || 0);
  if (!expiresAt || expiresAt <= Date.now()) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/refresh";
    url.search = `?next=${encodeURIComponent(`${pathname}${search}`)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

// Next.js 16: this file intentionally remains the single request proxy entrypoint.
