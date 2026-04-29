import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/builder", "/new-project", "/library"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── OAuth code rescue ─────────────────────────────────────────────────────
  // Supabase sends the OAuth ?code= to the Site URL (/) when /auth/callback
  // isn't yet whitelisted. Forward it to our callback handler transparently.
  if (pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const code = request.nextUrl.searchParams.get("code")!;
    return NextResponse.redirect(
      new URL(`/auth/callback?code=${encodeURIComponent(code)}`, request.url)
    );
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
