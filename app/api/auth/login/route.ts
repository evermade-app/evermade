import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";
  const response = NextResponse.redirect(new URL(next, request.url));
  response.cookies.set("evermade-auth", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    httpOnly: false,
  });
  return response;
}
