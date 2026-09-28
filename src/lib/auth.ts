import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import {
  isEmailIdentifier,
  normalizeIdentifier,
  OtpError,
  verifyOtp,
} from "./otp";

/**
 * OTP-only auth (next-auth v4).
 *
 * Flow:
 *  1. Client calls POST /api/auth/otp/request with { identifier } (phone or email).
 *  2. Client calls signIn("otp", { identifier, code, callbackUrl }) —
 *     `authorize` below verifies the code and auto-creates the user on
 *     first successful verification, so login and signup share one step.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "One-Time Code",
      credentials: {
        identifier: { label: "Phone or email", type: "text" },
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

        const isEmail = isEmailIdentifier(identifier);

        let user = await prisma.user.findFirst({
          where: isEmail ? { email: identifier } : { phone: identifier },
        });

        // First successful OTP verification == signup: auto-create the user.
        if (!user) {
          user = await prisma.user.create({
            data: isEmail
              ? { email: identifier, name: "NO_NAME" }
              : { phone: identifier, name: "NO_NAME" },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = (token.id as string | undefined) ?? token.sub;
      }
      return session;
    },
  },
  pages: {
    // Non-localized path; the next-intl middleware prefixes the active locale
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
