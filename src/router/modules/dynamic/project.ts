// src/router/modules/dynamic/project.ts
import type { RouteRecordRaw } from "vue-router";

const projectRoutes: RouteRecordRaw[] = [
  {
    path: "/project",
    name: "Project",
    component: () => import("@/layouts/AdminLayout.vue"),
    redirect: "/project/list",
    meta: {
      title: "项目管理",
      icon: "menu",
      roles: ["admin"],
      requiresAuth: true
    },
    children: [
      {
        path: "list",
        name: "ProjectList",
        component: () => import("@/views/project/list/index.vue"),
        meta: {
          title: "项目列表",
          icon: "menu",
          roles: ["admin"],
          requiresAuth: true
        }
      }
    ]
  }
];

export default projectRoutes;
