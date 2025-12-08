import { defineStore } from "pinia";
import { ref } from "vue";
import type { RouteRecordRaw } from "vue-router";
import { constantRoutes, asyncRoutes } from "@/router";
import { hasPermission } from "@/utils/permission";

function filterAsyncRoutes(routes: RouteRecordRaw[], permissions: string[]): RouteRecordRaw[] {
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
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref<RouteRecordRaw[]>([]);
  const addRoutes = ref<RouteRecordRaw[]>([]);

  const generateRoutes = (permissions: string[]): Promise<RouteRecordRaw[]> => {
    return new Promise((resolve) => {
      let accessedRoutes: RouteRecordRaw[];

      if (permissions.includes("*:*:*")) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, permissions);
      }

      addRoutes.value = accessedRoutes;
      routes.value = constantRoutes.concat(accessedRoutes);
      resolve(accessedRoutes);
    });
  };

  return {
    routes,
    addRoutes,
    generateRoutes
  };
});
