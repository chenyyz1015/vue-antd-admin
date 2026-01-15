import type { RouteRecordRaw } from "vue-router";

const userRoutes: RouteRecordRaw[] = [
  {
    path: "/user",
    name: "UserManage",
    component: () => import("@/layouts/AdminLayout.vue"),
    redirect: "/user/list",
    meta: {
      title: "menu.user",
      icon: "menu/user",
      sort: 3,
      roles: ["admin"],
      requiresAuth: true
    },
    children: [
      {
        path: "/user/list",
        name: "UserList",
        component: () => import("@/views/user/list/index.vue"),
        meta: {
          title: "menu.user.list",
          icon: "menu/user",
          roles: ["admin"],
          requiresAuth: true
        }
      },
      {
        path: "/user/role",
        name: "UserRole",
        component: () => import("@/views/user/role/index.vue"),
        meta: {
          title: "menu.user.role",
          icon: "menu/role",
          roles: ["admin"],
          requiresAuth: true
        }
      }
    ]
  }
];

export default userRoutes;
