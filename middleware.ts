import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED = ["/dashboard", "/builder", "/new-project", "/library"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from the landing page straight to the dashboard
  if (pathname === "/") {
    const token = await getToken({ req: request });
    if (token) {
      const dashUrl = request.nextUrl.clone();
      dashUrl.pathname = "/dashboard";
      dashUrl.search = "";
      return NextResponse.redirect(dashUrl);
    }
    return NextResponse.next();
  }

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) return NextResponse.next();

  const token = await getToken({ req: request });
  if (token) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/builder/:path*",
    "/new-project/:path*",
    "/library/:path*",
  ],
};
