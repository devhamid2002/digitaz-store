import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Optional locale prefix built from the configured locales, e.g. (?:/(?:en|fa))?
const LOCALE_PREFIX = `(?:/(?:${routing.locales.join("|")}))?`;

// Matches the sign-in route with or without a locale prefix.
const SIGN_IN_PATH = new RegExp(`^${LOCALE_PREFIX}/auth/sign-in/?$`);

// Routes that require a signed-in user (with or without a locale prefix).
const PROTECTED_PATH = new RegExp(
  `^${LOCALE_PREFIX}/(?:shipping|payment-method|place-order|profile|user|order|admin)(?:/|$)`
);

function getLocale(pathname: string): string {
  const [firstSegment] = pathname.split("/").filter(Boolean);
  return (routing.locales as readonly string[]).includes(firstSegment)
    ? firstSegment
    : routing.defaultLocale;
}

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
  const { pathname, search } = request.nextUrl;

  const isSignIn = SIGN_IN_PATH.test(pathname);
  const isProtected = PROTECTED_PATH.test(pathname);

  if (isSignIn || isProtected) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // A signed-in visitor has no reason to see the login form.
    if (isSignIn && token) {
      return NextResponse.redirect(
        new URL(`/${getLocale(pathname)}`, request.url)
      );
    }

    // Signed-out visitors can't reach protected pages; send them to sign-in
    // and bring them back afterwards.
    if (isProtected && !token) {
      const signInUrl = new URL(
        `/${getLocale(pathname)}/auth/sign-in`,
        request.url
      );
      signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
      return NextResponse.redirect(signInUrl);
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