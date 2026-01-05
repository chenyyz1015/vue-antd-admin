import i18n from "@/locales";
import { usePermissionStore, useUserStore } from "@/stores";
import { getToken } from "@/utils/auth";
import { message } from "ant-design-vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import router from "./index";

NProgress.configure({ showSpinner: false });

const whiteList = ["/auth/login", "/auth/register"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const accessToken = getToken();
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  if (accessToken) {
    if (to.path === "/auth/login") {
      next("/");
    } else {
      if (userStore.roles.length === 0) {
        try {
          await userStore.getInfo();
          const accessRoutes = await permissionStore.generateRoutes(userStore.roles);
          accessRoutes.forEach((route) => router.addRoute(route));
          next({ ...to, replace: true });
        } catch (error) {
          console.error("router beforeEach error", error);
          message.error("获取用户信息失败");
          await userStore.logout();
          next();
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
    }
  }
});

router.afterEach((to) => {
  NProgress.done();

  const { t } = i18n.global;

  const appTitle = import.meta.env.VITE_APP_TITLE;
  document.title = to.meta.title ? `${t(to.meta.title)} - ${appTitle}` : appTitle;
});
