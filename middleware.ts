import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROUTES } from "@/constants";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // This middleware only runs for /admin/* routes (login is excluded from matcher)
  // Check authentication for all admin routes
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  // Require admin role for admin routes
  if (!token || token.role !== "ADMIN") {
    return NextResponse.redirect(new URL(ROUTES.ADMIN_LOGIN, req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match admin routes but explicitly exclude login to prevent redirect loops
    "/admin/:path((?!login$).*)",
  ],
};
