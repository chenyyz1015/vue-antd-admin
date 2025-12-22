import type { RouteRecordRaw } from "vue-router";

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/layouts/AdminLayout.vue"),
    redirect: "/dashboard/workplace",
    meta: { title: "仪表盘", icon: "menu/dashboard", roles: ["admin"], requiresAuth: true },
    children: [
      {
        path: "/dashboard/workplace",
        name: "Workplace",
        component: () => import("@/views/dashboard/workplace.vue"),
        meta: { title: "工作台", icon: "menu/workplace", roles: ["admin"], requiresAuth: true }
      },
      {
        path: "/dashboard/analysis",
        name: "Analysis",
        component: () => import("@/views/dashboard/analysis.vue"),
        meta: { title: "分析页", icon: "menu/analysis", roles: ["admin"], requiresAuth: true }
      }
    ]
  }
];

export default dashboardRoutes;
