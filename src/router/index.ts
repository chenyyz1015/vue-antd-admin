import type { ModuleNamespace } from "vite/types/hot.js";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

type RouteModule = "static" | "extensional" | "dynamic";

/**
 * 加载路由模块
 * @param {RouteModule} mod
 * @returns {RouteRecordRaw[]}
 */
const loadSyncRoutes = (mod: RouteModule): RouteRecordRaw[] => {
  const staticModule = import.meta.glob<ModuleNamespace>("./modules/static/**/*.{js,ts}", { eager: true });
  const extensionalModule = import.meta.glob<ModuleNamespace>("./modules/extensional/**/*.{js,ts}", { eager: true });
  const dynamicModule = import.meta.glob<ModuleNamespace>("./modules/dynamic/**/*.{js,ts}", { eager: true });
  const routeModuleMap: Record<string, Record<string, ModuleNamespace>> = {
    static: staticModule,
    extensional: extensionalModule,
    dynamic: dynamicModule
  };
  const module = routeModuleMap[mod];
  if (module) {
    return Object.entries(module)
      .map(([, mod]) => mod.default)
      .flat();
  }
  return [];
};

// 静态路由
export const staticModuleRoutes: RouteRecordRaw[] = loadSyncRoutes("static");
// 扩展路由(非内部使用 -> 供外部跳转)
export const extensionalModuleRoutes: RouteRecordRaw[] = loadSyncRoutes("extensional");
// 动态路由
export const dynamicModuleRoutes: RouteRecordRaw[] = loadSyncRoutes("dynamic");

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: staticModuleRoutes.concat(extensionalModuleRoutes),
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
