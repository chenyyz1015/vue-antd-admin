import type { RouteRecordRaw } from "vue-router";

const exceptionRoutes: RouteRecordRaw[] = [
  {
    path: "/exception",
    name: "Exception",
    component: () => import("@/layouts/DefaultLayout.vue"),
    redirect: "/exception/404",
    meta: { title: "系统异常", requiresAuth: false },
    children: [
      {
        path: "403",
        name: "Forbidden",
        component: () => import("@/views/exception/403.vue"),
        meta: { title: "403", requiresAuth: false }
      },
      {
        path: "404",
        name: "NotFound",
        component: () => import("@/views/exception/404.vue"),
        meta: { title: "404", requiresAuth: false }
      },
      {
        path: "500",
        name: "ServerError",
        component: () => import("@/views/exception/500.vue"),
        meta: { title: "500", requiresAuth: false }
      }
    ]
  }
];

export default exceptionRoutes;
