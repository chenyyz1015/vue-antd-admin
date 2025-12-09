import type { ModuleNamespace } from "vite/types/hot.js";
import type { RouteRecordRaw } from "vue-router";
import { createRouter, createWebHistory } from "vue-router";

// 静态路由
const staticModules = import.meta.glob<ModuleNamespace>("./modules/static/**/*.{js,ts}", { eager: true });
export const staticModuleRoutes: RouteRecordRaw[] = Object.entries(staticModules)
  .map(([, mod]) => mod.default)
  .flat();
console.log("staticModuleRoutes", staticModuleRoutes);

// 扩展路由(非内部使用 -> 供外部跳转)
const extensionalModules = import.meta.glob<ModuleNamespace>("./modules/extensional/**/*.{js,ts}", { eager: true });
export const extensionalModuleRoutes: RouteRecordRaw[] = Object.entries(extensionalModules)
  .map(([, mod]) => mod.default)
  .flat();
console.log("extensionalModuleRoutes", extensionalModuleRoutes);

// 动态路由
const dynamicModules = import.meta.glob<ModuleNamespace>("./modules/dynamic/**/*.{js,ts}", { eager: true });
export const dynamicModuleRoutes: RouteRecordRaw[] = Object.entries(dynamicModules)
  .map(([, mod]) => mod.default)
  .flat();
// 添加非注册路由异常匹配
dynamicModuleRoutes.push({ path: "/:pathMatch(.*)*", redirect: "/404" });
console.log("dynamicModuleRoutes", dynamicModuleRoutes);

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_URL),
  routes: staticModuleRoutes.concat(extensionalModuleRoutes),
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
