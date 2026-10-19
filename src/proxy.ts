import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Matches the sign-in route with or without a locale prefix.
const SIGN_IN_PATH = /^\/(?:en|fa)?\/?auth\/sign-in\/?$/;

// Session-cart cookie: mint a sessionCartId when a request lacks one.
// Originally written as a callbacks.authorize snippet, but next-auth v4 never
// invokes that callback — this proxy helper is its runnable form.
// Kept module-private: the proxy file must export a single function.
// Returns null when the cookie is already present.
function ensureSessionCartCookie(
  request: NextRequest
): NextResponse | null {
  if (request.cookies.get("sessionCartId")) {
    return null;
  }

  const sessionCartId = crypto.randomUUID();

  const newReaquestHeaders = new Headers(request.headers);

  const response = NextResponse.next({
    request: {
      headers: newReaquestHeaders,
    },
  });
  response.cookies.set("sessionCartId", sessionCartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // Matches the 30-day JWT session
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}

// Next.js 16: the middleware convention was renamed to proxy; the entry
// function must be named `proxy` (even as a default export).
export default async function proxy(request: NextRequest) {
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

  // Session-cart: mint the cookie on the first page visit while keeping
  // locale routing — carry the minted cookie onto the intl response.
  const cartResponse = ensureSessionCartCookie(request);
  if (cartResponse) {
    const intlResponse = intlMiddleware(request);
    for (const cookie of cartResponse.cookies.getAll()) {
      intlResponse.cookies.set(cookie);
    }
    return intlResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip API, Next internals, and static files; locale routing applies to pages only
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};