import { NextResponse, type NextRequest } from "next/server";

// ==========================================
// Next.js Middleware — Route Protection
// ==========================================

/**
 * Protected routes require a valid firebase-token cookie.
 * Admin routes additionally require admin role (verified in API routes).
 *
 * Middleware runs on the Edge runtime so we can only check for cookie
 * presence here — full token verification happens in API routes.
 */

// Routes that require authentication
const PROTECTED_PREFIXES = ["/dashboard", "/classroom"];

// Routes that require admin access (cookie check here, role check in API)
const ADMIN_PREFIXES = ["/admin"];

// Routes that are always public
const PUBLIC_PATHS = ["/", "/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const firebaseToken = request.cookies.get("firebase-token")?.value;

  // Check if the path is a public route
  const isPublicPath = PUBLIC_PATHS.includes(pathname);

  // Check if the path is a protected route
  const isProtectedPath = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // Check if the path is an admin route
  const isAdminPath = ADMIN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  // If accessing a protected or admin route without a token, redirect to login
  if ((isProtectedPath || isAdminPath) && !firebaseToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is logged in and tries to access /login, redirect to dashboard
  if (pathname === "/login" && firebaseToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow all other requests (public routes, API routes, static files)
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on.
 * Excludes API routes, static files, and Next.js internals.
 */
export const config = {
  matcher: [
    "/",
    "/login",
    "/dashboard/:path*",
    "/classroom/:path*",
    "/admin/:path*",
  ],
};
