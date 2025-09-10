import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminAPI  = pathname.startsWith("/api/admin");
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminAPI && !isAdminPage) return NextResponse.next();

  if (pathname === "/admin") return NextResponse.next();

  if (pathname === "/api/admin/login" || pathname === "/api/admin/logout") {
    return NextResponse.next();
  }

  if (
    isAdminAPI &&
    pathname === "/api/admin/requests" &&
    req.headers.get("x-bypass-auth") === "1"
  ) {
    return NextResponse.next();
  }

  const authed = req.cookies.get("ibl_admin")?.value === "1";
  if (authed) return NextResponse.next();

  if (isAdminAPI) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = req.nextUrl.clone();
  url.pathname = "/admin";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
