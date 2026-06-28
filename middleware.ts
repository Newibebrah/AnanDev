import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    const { auth } = await import("@/app/lib/auth");
    const session = await auth();

    if (pathname.startsWith("/admin") && !session?.user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname === "/login" && session?.user) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
