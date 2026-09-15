import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));
  response.cookies.delete("max_access_token");
  return response;
}
