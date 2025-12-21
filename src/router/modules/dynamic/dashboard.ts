import type { RouteRecordRaw } from "vue-router";

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/layouts/AdminLayout.vue"),
    redirect: "/dashboard/workplace",
    meta: { title: "仪表盘", icon: "dashboard", roles: ["admin"], requiresAuth: true },
    children: [
      {
        path: "workplace",
        name: "Workplace",
        component: () => import("@/views/dashboard/workplace.vue"),
        meta: { title: "工作台", roles: ["admin"], requiresAuth: true }
      }
    ]
  }
];

export default dashboardRoutes;
