import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { ADMIN_COOKIE, verifySessionToken } from "./lib/admin-auth";

const intl = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const authed = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
    const isLogin = pathname === "/admin/login";
    if (!authed && !isLogin) return NextResponse.redirect(new URL("/admin/login", req.url));
    if (authed && isLogin) return NextResponse.redirect(new URL("/admin", req.url));
    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  return intl(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
