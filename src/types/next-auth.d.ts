import { DefaultSession } from "next-auth";

// Extend the session and token with the user id propagated by auth callbacks
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
