import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    redirect: "/auth/login",
    meta: { title: "认证", requiresAuth: false },
    children: [
      {
        path: "/auth/login",
        name: "Login",
        component: () => import("@/views/auth/login.vue"),
        meta: { title: "登录", requiresAuth: false }
      },
      {
        path: "/auth/register",
        name: "Register",
        component: () => import("@/views/auth/register.vue"),
        meta: { title: "注册", requiresAuth: false }
      }
    ]
  }
];

export default authRoutes;
