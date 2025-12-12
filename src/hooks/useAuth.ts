"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { detectRoleFromToken, persistSession, UserRole } from "@/lib/auth";

type UseAuthOptions = {
  requireAdmin?: boolean;
  redirectIfUnauthed?: string;
  redirectNonAdminTo?: string;
};

export function useAuth(options: UseAuthOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole>("unknown");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace(options.redirectIfUnauthed ?? "/login");
      return;
    }

    const detectedRole = detectRoleFromToken(token);
    setRole(detectedRole);
    persistSession(token, detectedRole);

    if (options.requireAdmin && detectedRole !== "admin") {
      router.replace(options.redirectNonAdminTo ?? "/dashboard");
    }
  }, [
    options.redirectIfUnauthed,
    options.requireAdmin,
    options.redirectNonAdminTo,
    pathname,
    router,
  ]);

  return {
    role,
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      router.replace("/login");
    },
  };
}
