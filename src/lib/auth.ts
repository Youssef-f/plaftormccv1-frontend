"use client";

export type UserRole = "admin" | "user" | "unknown";

type JwtPayload = {
  role?: string | string[];
  roles?: string | string[];
  authorities?: string | string[];
  permissions?: string | string[];
  scope?: string;
  scopes?: string | string[];
  isAdmin?: boolean;
};

function decodeBase64Url(segment: string) {
  try {
    const padded =
      segment.length % 4 === 2
        ? `${segment}==`
        : segment.length % 4 === 3
          ? `${segment}=`
          : segment;
    const normalized = padded.replace(/-/g, "+").replace(/_/g, "/");
    return atob(normalized);
  } catch {
    return null;
  }
}

function parseJwt(token: string): JwtPayload | null {
  const payload = token.split(".")[1];
  if (!payload) return null;

  const decoded = decodeBase64Url(payload);
  if (!decoded) return null;

  try {
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function normalizeRoles(value?: JwtPayload[keyof JwtPayload]) {
  if (!value) return [] as string[];
  if (Array.isArray(value)) return value.map((r) => String(r));
  return String(value)
    .split(/[,\s]+/)
    .filter(Boolean);
}

export function detectRoleFromToken(token: string | null): UserRole {
  if (!token) return "unknown";
  const payload = parseJwt(token);
  if (!payload) return "unknown";

  if (payload.isAdmin) return "admin";

  const roles = normalizeRoles(
    payload.role ||
      payload.roles ||
      payload.authorities ||
      payload.permissions ||
      payload.scopes ||
      payload.scope
  ).map((r) => r.toLowerCase());

  if (roles.some((r) => r.includes("admin"))) return "admin";
  if (roles.some((r) => r.includes("user"))) return "user";

  return "unknown";
}

export function persistSession(token: string, role: UserRole) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}
