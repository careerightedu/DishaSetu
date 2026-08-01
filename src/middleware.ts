import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define route categories
  const isAuthRoute = ["/login", "/signup", "/forgot-password"].some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = ["/api"].some((route) =>
    pathname.startsWith(route)
  );

  // Exclude static files and next assets
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".");

  if (isStaticAsset || isPublicRoute) {
    return NextResponse.next();
  }

  // Read auth cookies
  const sessionToken = request.cookies.get("session")?.value;
  const onboardingCompleted = request.cookies.get("onboarding_completed")?.value === "true";

  // If user is not logged in
  if (!sessionToken) {
    // Redirect to login if trying to access protected route
    if (!isAuthRoute) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // User is logged in
    if (isAuthRoute) {
      // Redirect to onboarding or home
      if (!onboardingCompleted) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect to onboarding if not completed and not already there
    if (!onboardingCompleted && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    // Redirect home if onboarding is done and user tries to access /onboarding
    if (onboardingCompleted && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
