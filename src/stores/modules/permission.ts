import { usePermission } from "@/composables";
import { dynamicModuleRoutes, extensionalModuleRoutes, staticModuleRoutes } from "@/router";
import type { RouteRecordRaw } from "vue-router";

const filterAsyncRoutes = (routes: RouteRecordRaw[], permissions: string[]): RouteRecordRaw[] => {
  const { hasPermission } = usePermission();
  const result: RouteRecordRaw[] = [];

  routes.forEach((route) => {
    const tmp = { ...route };
    if (!tmp.meta?.permissions || hasPermission(tmp.meta.permissions as string[])) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, permissions);
      }
      result.push(tmp);
    }
  });

  return result;
};

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([]);
  const addRoutes = ref<RouteRecordRaw[]>([]);

  const generateRoutes = (permissions: string[]): Promise<RouteRecordRaw[]> => {
    return new Promise((resolve) => {
      let accessedRoutes: RouteRecordRaw[];

      if (permissions.includes("*:*:*")) {
        accessedRoutes = dynamicModuleRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(dynamicModuleRoutes, permissions);
      }

      addRoutes.value = accessedRoutes;
      routes.value = staticModuleRoutes.concat(extensionalModuleRoutes).concat(accessedRoutes);
      resolve(accessedRoutes);
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
