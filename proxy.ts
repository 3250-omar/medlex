import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "ar"] as const;
const defaultLocale = "en";

/** Segment-level paths that require authentication (no locale prefix). */
const PROTECTED_ROUTES = ["academy", "courses", "profile"] as const;

function isProtectedRoute(pathname: string, locale: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) =>
      pathname === `/${locale}/${route}` ||
      pathname.startsWith(`/${locale}/${route}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    /\.(.*)$/.test(pathname);
  if (isPublicAsset) return NextResponse.next();

  const locale = locales.find(
    (candidate) =>
      pathname === `/${candidate}` || pathname.startsWith(`/${candidate}/`),
  );
  if (!locale) {
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname}`, request.url),
    );
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-next-intl-locale", locale);
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const isProtected = isProtectedRoute(pathname, locale);

  if (!supabaseUrl || !supabaseKey) {
    return isProtected
      ? NextResponse.redirect(new URL(`/${locale}?auth=sign-in`, request.url))
      : response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        response = NextResponse.next({ request: { headers: requestHeaders } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (isProtected && !user) {
    return NextResponse.redirect(
      new URL(`/${locale}?auth=sign-in`, request.url),
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
