import { redirect } from "next/navigation";
import { auth } from "./auth";

// API routes cannot redirect; they need a null result to answer with 401.
export async function getAdminSession() {
  const session = await auth();

  return session?.user.role === "admin" ? session : null;
}

export async function requireAdmin(locale: string) {
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/auth/sign-in`);
  }

  if (session.user.role !== "admin") {
    redirect(`/${locale}/unauthorized`);
  }

  return session;
}
