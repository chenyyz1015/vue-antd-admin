import router from "./index";
import { useUserStore } from "@/stores/modules/user";
import { usePermissionStore } from "@/stores/modules/permission";
import { message } from "ant-design-vue";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  document.title = to.meta.title ? `${to.meta.title} - Vue Antd Admin` : "Vue Antd Admin";

  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  if (userStore.token) {
    if (to.path === "/login") {
      next("/");
      NProgress.done();
    } else {
      if (userStore.permissions.length === 0) {
        try {
          await userStore.getInfo();
          const accessRoutes = await permissionStore.generateRoutes(userStore.permissions);
          accessRoutes.forEach((route) => router.addRoute(route));
          next({ ...to, replace: true });
        } catch (error) {
          console.error("router beforeEach error", error);
          await userStore.logout();
          message.error("获取用户信息失败");
          next(`/login?redirect=${to.path}`);
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
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
