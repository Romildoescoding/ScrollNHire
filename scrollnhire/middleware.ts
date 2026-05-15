// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const matchRoute = (pathname: string, route: string) => {
  return pathname === route || pathname.startsWith(route + "/");
};

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/callback",
  "/privacy-policy",
  "/terms-and-conditions",
  "/careers",
];
const PUBLIC_PREFIXES = ["/reels"];

const AUTH_ROUTES = ["/login", "/signup"];

const COMMON_ROUTES = [
  "/onboarding",
  "/chat",
  "/explore",
  "/notifications",
  "/profile",
];

const STUDENT_ROUTES = ["/student", "/create", "/projects"];
const EMPLOYER_ROUTES = ["/employer", "/manage"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔥 EDGE SAFE TOKEN
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  console.log("TOKEN:", token);
  console.log(process.env.AUTH_SECRET);

  const isPublicRoute =
    PUBLIC_ROUTES.some((route) => matchRoute(pathname, route)) ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const isAuthRoute = AUTH_ROUTES.some((route) => matchRoute(pathname, route));

  const isStudentRoute = STUDENT_ROUTES.some((route) =>
    matchRoute(pathname, route),
  );

  const isEmployerRoute = EMPLOYER_ROUTES.some((route) =>
    matchRoute(pathname, route),
  );

  /**
   * 🔒 NOT LOGGED IN
   */
  if (!token) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  const role = token.role as "student" | "employer";

  // SAFE FALLBACK FOR NOT ROLES
  const isOnboardingRoute = matchRoute(pathname, "/onboarding");

  // SAFE FALLBACK FOR NO ROLE
  if (!role) {
    if (!isOnboardingRoute) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    return NextResponse.next();
  }

  // Prevent users with role from visiting onboarding again:
  if (role && isOnboardingRoute) {
    return NextResponse.redirect(
      new URL(role === "student" ? "/student" : "/employer", req.url),
    );
  }

  /**
   * 🔁 AUTH PAGES
   */
  if (isAuthRoute) {
    return NextResponse.redirect(
      new URL(role === "student" ? "/student" : "/employer", req.url),
    );
  }

  /**
   * 🚫 ROLE GUARDS
   */
  if (isEmployerRoute && role !== "employer") {
    return NextResponse.redirect(new URL("/student", req.url));
  }

  if (isStudentRoute && role !== "student") {
    return NextResponse.redirect(new URL("/employer", req.url));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|landing|videos).*)",
//   ],
// };

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
