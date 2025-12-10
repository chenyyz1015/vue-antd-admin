import { useUserStore } from "@/stores/modules/user";

export const usePermission = () => {
  const userStore = useUserStore();

  const hasPermission = (permission: string | string[]) => {
    const permissions = userStore.permissions;
    if (permissions.includes("*:*:*")) return true;

    if (Array.isArray(permission)) {
      return permission.some((p) => permissions.includes(p));
    }

    return permissions.includes(permission);
  };

  const hasRole = (role: string | string[]) => {
    const roles = userStore.roles;
    if (roles.includes("admin")) return true;

    if (Array.isArray(role)) {
      return role.some((r) => roles.includes(r));
    }

    return roles.includes(role);
  };

  return { hasPermission, hasRole };
};
