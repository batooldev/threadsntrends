import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Admin routes protection
    if (path.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Auth routes protection
    if (path.startsWith("/auth") && token.role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*", "/dashboard/:path*"],
};
