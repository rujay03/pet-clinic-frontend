import type { MeResponse } from "@/types/auth";

/**
 * Get the dashboard route based on user roles
 */
export function getDashboardRoute(user: MeResponse): string {
  const roles = user.roles.map((r) => r.replace("ROLE_", "").toUpperCase());

  if (roles.includes("PETOWNER")) {
    return "/petowner/dashboard";
  } else if (roles.includes("DOCTOR")) {
    return "/doctor/dashboard";
  } else if (roles.includes("PHARMACIST")) {
    return "/pharmacy-staff/dashboard";
  } else if (roles.includes("ADMIN")) {
    return "/pharmacy-staff/dashboard"; // Admin also goes to pharmacy dashboard
  }

  // Default fallback
  return "/";
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: MeResponse | null, role: string): boolean {
  if (!user) return false;
  const roles = user.roles.map((r) => r.replace("ROLE_", "").toUpperCase());
  return roles.includes(role.toUpperCase());
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: MeResponse | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.some((role) => hasRole(user, role));
}

