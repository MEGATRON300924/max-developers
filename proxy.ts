import { NextResponse, type NextRequest } from "next/server";

const protectedPaths = ["/applications", "/credentials", "/activity"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("max_access_token")?.value;
  if (token) return NextResponse.next();

  const signIn = new URL("/sign-in", request.url);
  signIn.searchParams.set("next", pathname);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ["/applications/:path*", "/credentials/:path*", "/activity/:path*"],
};
