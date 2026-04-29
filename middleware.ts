import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/auth";

const PROTECTED = ["/dashboard", "/builder", "/new-project", "/library"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!isProtected) return NextResponse.next();

  // Build a mutable response so Supabase SSR can refresh session cookies
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Apply refreshed session cookies to both the request and response
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() refreshes the session if the access token is expired
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Ensure the simple auth cookie stays in sync
    if (!request.cookies.get(AUTH_COOKIE)) {
      response.cookies.set(AUTH_COOKIE, "true", {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: false,
      });
    }
    return response;
  }

  // Fallback: accept the simple cookie (demo / email login users)
  if (request.cookies.get(AUTH_COOKIE)?.value === "true") {
    return response;
  }

  // Not authenticated — redirect to login
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/dashboard/:path*", "/builder/:path*", "/new-project/:path*", "/library/:path*"],
};
