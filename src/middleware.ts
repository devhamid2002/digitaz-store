import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Matches the sign-in route with or without a locale prefix.
const SIGN_IN_PATH = /^\/(?:en|fa)?\/?auth\/sign-in\/?$/;

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A signed-in visitor has no reason to see the login form.
  if (SIGN_IN_PATH.test(pathname)) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      const [firstSegment] = pathname.split("/").filter(Boolean);
      const locale = routing.locales.includes(firstSegment as "en" | "fa")
        ? firstSegment
        : routing.defaultLocale;

      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API, Next internals, and static files; locale routing applies to pages only
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};