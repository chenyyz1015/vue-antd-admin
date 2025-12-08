import { useUserStore } from "@/stores/modules/user";

export function hasPermission(permission: string | string[]): boolean {
  const userStore = useUserStore();
  const permissions = userStore.permissions;

  if (!permission) return true;
  if (permissions.includes("*:*:*")) return true;

  if (Array.isArray(permission)) {
    return permission.some((p) => permissions.includes(p));
  }

  return permissions.includes(permission);
}

export function hasRole(role: string | string[]): boolean {
  const userStore = useUserStore();
  const roles = userStore.roles;

  if (!role) return true;
  if (roles.includes("admin")) return true;

  if (Array.isArray(role)) {
    return role.some((r) => roles.includes(r));
  }

  return roles.includes(role);
}
