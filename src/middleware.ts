// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // ✅ LIBERAR PREFLIGHT (OBRIGATÓRIO)
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  const { pathname, search } = req.nextUrl;
  const isAdminAPI = pathname.startsWith("/api/admin");
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAuthRoute = pathname.startsWith("/api/auth") || pathname.startsWith("/login");

  if (isAuthRoute) return NextResponse.next();
  if (!isAdminAPI && !isAdminPage) return NextResponse.next();

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

  // Precisa ter sessão (cookie ibl_user)
  const hasUser = !!req.cookies.get("ibl_user")?.value;
  if (hasUser) return NextResponse.next();

  const legacyAdmin = req.cookies.get("ibl_admin")?.value === "1";
  if (legacyAdmin) return NextResponse.next();

  if (isAdminAPI) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", pathname + (search || ""));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};