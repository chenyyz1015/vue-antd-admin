import type { RouteRecordRaw } from "vue-router";

const exceptionRoutes: RouteRecordRaw[] = [
  {
    path: "/exception",
    name: "Exception",
    component: () => import("@/layouts/DefaultLayout.vue"),
    redirect: "/exception/404",
    meta: { title: "menu.exception", requiresAuth: false },
    children: [
      {
        path: "/exception/403",
        name: "Forbidden",
        component: () => import("@/views/exception/403.vue"),
        meta: { title: "menu.exception.403", requiresAuth: false }
      },
      {
        path: "/exception/404",
        name: "NotFound",
        component: () => import("@/views/exception/404.vue"),
        meta: { title: "menu.exception.404", requiresAuth: false }
      },
      {
        path: "/exception/500",
        name: "ServerError",
        component: () => import("@/views/exception/500.vue"),
        meta: { title: "menu.exception.500", requiresAuth: false }
      }
    ]
  }
];

export default exceptionRoutes;
