import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import {
  normalizeIdentifier,
  OtpError,
  verifyOtp,
} from "./otp";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "One-Time Code",
      credentials: {
        identifier: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        const rawIdentifier = credentials?.identifier?.toString() ?? "";
        const code = credentials?.code?.toString() ?? "";

        if (!rawIdentifier || !code) {
          throw new Error("OTP_MISSING");
        }

        const identifier = normalizeIdentifier(rawIdentifier);

        try {
          // Throws OtpError (OTP_NOT_FOUND / OTP_EXPIRED / OTP_INVALID / ...)
          await verifyOtp(identifier, code);
        } catch (error) {
          // Re-throw the machine-readable code so the sign-in form can
          // resolve it to a localized message instead of English text.
          if (error instanceof OtpError) throw new Error(error.code);
          throw error;
        }

        let user = await prisma.user.findUnique({
          where: { phone: identifier },
        });

        // First successful OTP verification == signup: auto-create the user.
        if (!user) {
          user = await prisma.user.create({
            data: { phone: identifier, name: "NO_NAME" },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Carry the avatar through the JWT so the session can expose it.
        if (typeof user.image === "string") {
          token.picture = user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = (token.id as string | undefined) ?? token.sub;
        if (typeof token.picture === "string") {
          session.user.image = token.picture;
        }
      }
      return session;
    },
  },
  pages: {
    // Non-localized path; the next-intl locale prefixing runs in src/proxy.ts
    signIn: "/auth/sign-in",
    error: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}

// Session getter in the next-auth v5 `auth()` shape, so feature actions can
// just `import { auth } from "@/lib/auth"` without touching authOptions.
export function auth() {
  return getServerAuthSession();
}
