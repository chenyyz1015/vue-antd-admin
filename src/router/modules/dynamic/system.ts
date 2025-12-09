import BasicLayout from "@/layouts/BasicLayout.vue";
import type { RouteRecordRaw } from "vue-router";

const systemRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    component: BasicLayout,
    redirect: "/system/user",
    meta: { title: "系统管理", icon: "system", permissions: ["system:view"] },
    children: [
      {
        path: "user",
        name: "SystemUser",
        component: () => import("@/views/system/user/index.vue"),
        meta: { title: "用户管理", permissions: ["system:user:view"] }
      },
      {
        path: "role",
        name: "SystemRole",
        component: () => import("@/views/system/role/index.vue"),
        meta: { title: "角色管理", permissions: ["system:role:view"] }
      }
    ]
  }
];

export default systemRoutes;
