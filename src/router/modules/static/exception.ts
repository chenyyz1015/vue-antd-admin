import type { RouteRecordRaw } from "vue-router";

const exceptionRoutes: RouteRecordRaw[] = [
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/views/exception/404.vue"),
    meta: { hidden: true }
  }
];

export default exceptionRoutes;
