import { usePermissionStore, useUserStore } from "@/stores";
import { message } from "ant-design-vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from "./index";

NProgress.configure({ showSpinner: false });

const whiteList = ["/auth/login", "/auth/register"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  if (userStore.token) {
    if (to.path === "/auth/login") {
      next("/");
      NProgress.done();
    } else {
      if (userStore.roles.length === 0) {
        try {
          await userStore.getInfo();
          const accessRoutes = await permissionStore.generateRoutes(userStore.roles);
          accessRoutes.forEach((route) => router.addRoute(route));
          next({ ...to, replace: true });
        } catch (error) {
          console.error("router beforeEach error", error);
          await userStore.logout();
          message.error("获取用户信息失败");
          next({ path: "/auth/login", query: { redirect: to.fullPath } });
          NProgress.done();
        }
      } else {
        next();
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next({ path: "/auth/login", query: { redirect: to.fullPath } });
      NProgress.done();
    }
  }
});

router.afterEach((to) => {
  NProgress.done();
  const appTitle = import.meta.env.VITE_APP_TITLE;
  document.title = to.meta.title ? `${to.meta.title} - ${appTitle}` : appTitle;
});
