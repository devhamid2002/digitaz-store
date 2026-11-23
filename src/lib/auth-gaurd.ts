import { auth } from "./auth";

// API routes and server actions cannot redirect; they need a null result to
// answer with 401/403.
export async function getAdminSession() {
  const session = await auth();

  return session?.user.role === "admin" ? session : null;
}
