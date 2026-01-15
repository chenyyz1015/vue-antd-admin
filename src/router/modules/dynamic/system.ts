import type { RouteRecordRaw } from "vue-router";

const systemRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    name: "SystemManage",
    component: () => import("@/layouts/AdminLayout.vue"),
    redirect: "/system/maptalks-gl",
    meta: {
      title: "menu.system",
      icon: "menu/common",
      sort: 4,
      roles: ["admin"],
      requiresAuth: true
    },
    children: [
      {
        path: "/system/maptalks-gl",
        name: "MaptalksGL",
        component: () => import("@/views/system/maptalks/index.vue"),
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
