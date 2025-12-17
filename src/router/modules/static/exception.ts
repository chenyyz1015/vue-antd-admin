import type { RouteRecordRaw } from "vue-router";

const exceptionRoutes: RouteRecordRaw[] = [
  {
    path: "/403",
    name: "Forbidden",
    component: () => import("@/views/exception/403.vue"),
    meta: { title: "403", hidden: true }
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/views/exception/404.vue"),
    meta: { title: "404", hidden: true }
  },
  {
    path: "/500",
    name: "ServerError",
    component: () => import("@/views/exception/500.vue"),
    meta: { title: "500", hidden: true }
  }
];

export default exceptionRoutes;
