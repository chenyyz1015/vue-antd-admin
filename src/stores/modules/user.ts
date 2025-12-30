import type { LoginParams, UserInfo } from "@/api";
import * as userApi from "@/api/modules/user";
import router from "@/router";
import { removeToken, setToken } from "@/utils/auth";
import { message } from "ant-design-vue";

export const useUserStore = defineStore("user", () => {
  const userInfo = ref<UserInfo>({
    id: "",
    username: "",
    nickname: "",
    avatar: ""
  });
  const permissions = ref<string[]>([]);
  const roles = ref<string[]>([]);

  const login = async (data: LoginParams) => {
    const res = await userApi.login(data);
    setToken(res.token);
    message.success("登录成功");
    router.push("/");
  };

  const getInfo = async () => {
    const res = await userApi.getUserInfo();
    userInfo.value = res.user;
    permissions.value = res.permissions || ["*:*:*"];
    roles.value = res.roles || ["admin"];
  };

  const logout = async (api?: boolean) => {
    if (api) {
      try {
        await userApi.logout();
      } catch (error) {
        console.error(error);
      }
    }
    userInfo.value = {
      id: "",
      username: "",
      nickname: "",
      avatar: ""
    };
    permissions.value = [];
    roles.value = [];
    removeToken();
    router.push({ path: "/auth/login" });
  };

  return {
    userInfo,
    permissions,
    roles,
    login,
    getInfo,
    logout
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
