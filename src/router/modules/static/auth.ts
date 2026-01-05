import type { RouteRecordRaw } from "vue-router";

const authRoutes: RouteRecordRaw[] = [
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/layouts/AuthLayout.vue"),
    redirect: "/auth/login",
    meta: { title: "menu.auth", requiresAuth: false },
    children: [
      {
        path: "/auth/login",
        name: "Login",
        component: () => import("@/views/auth/login.vue"),
        meta: { title: "menu.auth.login", requiresAuth: false }
      },
      {
        path: "/auth/register",
        name: "Register",
        component: () => import("@/views/auth/register.vue"),
        meta: { title: "menu.auth.register", requiresAuth: false }
      }
    ]
  }
];

export default authRoutes;
