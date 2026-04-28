import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

const PROTECTED = ["/dashboard", "/builder", "/new-project", "/library"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (!isProtected) return NextResponse.next();

  const authCookie = request.cookies.get(AUTH_COOKIE);
  const isAuthenticated = authCookie?.value === "true";

  if (isAuthenticated) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = `?next=${encodeURIComponent(pathname)}`;

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/builder/:path*", "/new-project/:path*", "/library/:path*"],
};
