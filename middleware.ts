import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/builder", "/new-project", "/library"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) return NextResponse.next();

  // Accept either the Supabase session cookie OR our simple auth cookie
  const hasAuth = request.cookies.get("evermade-auth")?.value === "true";
  // Supabase SSR stores session in cookies like sb-[ref]-auth-token
  const hasSupabaseSession = [...request.cookies.getAll()].some(
    (c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token")
  );

  if (hasAuth || hasSupabaseSession) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/builder/:path*", "/new-project/:path*", "/library/:path*"],
};
