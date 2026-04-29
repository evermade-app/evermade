import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/builder", "/new-project", "/library"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── OAuth code rescue ─────────────────────────────────────────────────────
  // Supabase sends the OAuth ?code= to the Site URL (/) when /auth/callback
  // isn't yet whitelisted. Forward ALL params (code + state) to our handler.
  if (pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const callbackUrl = new URL("/auth/callback", request.url);
    request.nextUrl.searchParams.forEach((value, key) => {
      callbackUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(callbackUrl);
  }

  // ── Protected routes ──────────────────────────────────────────────────────
  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) return NextResponse.next();

  const hasAuth = request.cookies.get("evermade-auth")?.value === "true";
  const hasSupabaseSession = request.cookies.getAll().some(
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
  matcher: [
    "/",
    "/dashboard/:path*",
    "/builder/:path*",
    "/new-project/:path*",
    "/library/:path*",
  ],
};
