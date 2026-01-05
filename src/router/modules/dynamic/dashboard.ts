import type { RouteRecordRaw } from "vue-router";

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("@/layouts/AdminLayout.vue"),
    redirect: "/dashboard/workplace",
    meta: {
      title: "menu.dashboard",
      icon: "menu/dashboard",
      sort: 1,
      roles: ["admin"],
      requiresAuth: true
    },
    children: [
      {
        path: "/dashboard/workplace",
        name: "Workplace",
        component: () => import("@/views/dashboard/workplace.vue"),
        meta: {
          title: "menu.dashboard.workplace",
          icon: "menu/workplace",
          roles: ["admin"],
          requiresAuth: true
        }
      },
      {
        path: "/dashboard/analysis",
        name: "Analysis",
        component: () => import("@/views/dashboard/analysis.vue"),
        meta: {
          title: "menu.dashboard.analysis",
          icon: "menu/analysis",
          roles: ["admin"],
          requiresAuth: true
        }
      }
    ]
  }
];

export default dashboardRoutes;
