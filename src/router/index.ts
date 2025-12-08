import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import BasicLayout from "@/layouts/BasicLayout.vue";

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", hidden: true }
  },
  {
    path: "/",
    component: BasicLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "首页", icon: "dashboard", affix: true }
      }
    ]
  }
];

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    component: BasicLayout,
    redirect: "/system/user",
    meta: { title: "系统管理", icon: "system", permissions: ["system:view"] },
    children: [
      {
        path: "user",
        name: "SystemUser",
        component: () => import("@/views/system/user/index.vue"),
        meta: { title: "用户管理", permissions: ["system:user:view"] }
      },
      {
        path: "role",
        name: "SystemRole",
        component: () => import("@/views/system/role/index.vue"),
        meta: { title: "角色管理", permissions: ["system:role:view"] }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/error/404.vue"),
    meta: { hidden: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
