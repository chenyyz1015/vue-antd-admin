import type { RouteRecordRaw } from "vue-router";

const systemRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    name: "SystemManage",
    component: () => import("@/layouts/AdminLayout.vue"),
    redirect: "/system/user",
    meta: {
      title: "menu.system",
      icon: "menu/common",
      sort: 2,
      roles: ["admin"],
      requiresAuth: true
    },
    children: [
      {
        path: "/system/user",
        name: "SystemUser",
        component: () => import("@/views/system/user/index.vue"),
        meta: {
          title: "menu.system.user",
          icon: "menu/user",
          roles: ["admin"],
          requiresAuth: true
        }
      },
      {
        path: "/system/role",
        name: "SystemRole",
        component: () => import("@/views/system/role/index.vue"),
        meta: {
          title: "menu.system.role",
          icon: "menu/role",
          roles: ["admin"],
          requiresAuth: true
        }
      },
      {
        path: "/system/maptalks-gl",
        name: "MaptalksGL",
        component: () => import("@/views/system/maptalks-gl/index.vue"),
        meta: {
          title: "menu.system.maptalks-gl",
          icon: "menu/map",
          roles: ["admin"],
          requiresAuth: true
        }
      }
    ]
  }
];

export default systemRoutes;
