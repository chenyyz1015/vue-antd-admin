import { usePermission } from "@/composables";
import { dynamicModuleRoutes, extensionalModuleRoutes, staticModuleRoutes } from "@/router";
import type { RouteRecordRaw } from "vue-router";

const filterAsyncRoutes = (routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] => {
  const { hasRole } = usePermission();
  const result: RouteRecordRaw[] = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (!tmp.meta?.roles || hasRole(tmp.meta.roles)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      result.push(tmp);
    }
  });

  return result;
};

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([]);
  const addRoutes = ref<RouteRecordRaw[]>([]);

  const generateRoutes = (roles: string[]): Promise<RouteRecordRaw[]> => {
    return new Promise((resolve) => {
      let accessedRoutes: RouteRecordRaw[];
      if (roles.includes("admin")) {
        accessedRoutes = dynamicModuleRoutes;
      } else {
        accessedRoutes = filterAsyncRoutes(dynamicModuleRoutes, roles);
      }
      // 重定向路由
      const redirectRoutes: RouteRecordRaw[] = [
        { path: "/", redirect: "/dashboard" },
        { path: "/:pathMatch(.*)*", redirect: "/404" }
      ];
      addRoutes.value = accessedRoutes;
      routes.value = [...staticModuleRoutes, ...extensionalModuleRoutes, ...accessedRoutes, ...redirectRoutes];
      resolve([...accessedRoutes, ...redirectRoutes]);
    });
  };

  return {
    routes,
    addRoutes,
    generateRoutes
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermissionStore, import.meta.hot));
}
