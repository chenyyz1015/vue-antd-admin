import type { RouteRecordRaw } from "vue-router";

const homeRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/index.vue"),
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: { title: "首页", icon: "HomeOutlined", affix: true }
      }
    ]
  }
];

export default homeRoutes;
