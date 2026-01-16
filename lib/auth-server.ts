import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Get the current session (server-side)
 */
export async function getSession() {
  return getServerSession(authOptions);
}

/**
 * Require authentication - throws error if not authenticated
 * Use in server components or API routes
 */
export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    throw new Error("Unauthorized: Authentication required");
  }

  return session;
}

/**
 * Require admin role - throws error if not admin
 */
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }

  return session;
}
