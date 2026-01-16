"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Client-side logout utility
 */
export async function logout() {
  await signOut({ redirect: false });
  window.location.href = "/admin/login";
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const handleLogout = async () => {
    await signOut({ redirect: false });
    // Use window.location for a hard redirect to ensure session is cleared
    window.location.href = "/admin/login";
  };

  return { logout: handleLogout };
}
