import type { RouteRecordRaw } from "vue-router";

const systemRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    name: "System",
    component: () => import("@/layouts/AdminLayout.vue"),
    redirect: "/system/user",
    meta: {
      title: "系统管理",
      icon: "menu",
      roles: ["admin"],
      requiresAuth: true
    },
    children: [
      {
        path: "user",
        name: "SystemUser",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          title: "用户管理",
          icon: "user",
          roles: ["admin"],
          requiresAuth: true
        }
      },
      {
        path: "role",
        name: "SystemRole",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          title: "角色管理",
          icon: "role",
          roles: ["admin"],
          requiresAuth: true
        }
      }
    ]
  }
];

export default systemRoutes;
