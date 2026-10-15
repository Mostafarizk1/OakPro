import createIntlMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area: refresh the Supabase session and require a signed-in user (except the login page).
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL, anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) return new NextResponse("Admin is not configured (missing Supabase env vars).", { status: 503 });
    let res = NextResponse.next({ request: req });
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    });
    const { data: { user } } = await supabase.auth.getUser();
    const isLogin = pathname === "/admin/login";
    if (!user && !isLogin) return NextResponse.redirect(new URL("/admin/login", req.url));
    if (user && isLogin) return NextResponse.redirect(new URL("/admin", req.url));
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  return intl(req);
}

export const config = { matcher: ["/", "/(ar|en)/:path*", "/admin", "/admin/:path*"] };
