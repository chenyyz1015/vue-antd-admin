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

  const login = async (params: LoginParams) => {
    const res = await userApi.login(params);
    setToken(res.token);
    message.success("登录成功");
    router.push("/");
  };

  const getInfo = async () => {
    const result = await userApi.getUserInfo();
    userInfo.value = result.user;
    permissions.value = result.permissions || ["*:*:*"];
    roles.value = result.roles || ["admin"];
  };

  const logout = async (api: boolean = true) => {
    if (api) {
      try {
        await userApi.logout();
      } catch (error) {
        console.error(error);
      }
    }
    removeToken();
    userInfo.value = {
      id: "",
      username: "",
      nickname: "",
      avatar: ""
    };
    permissions.value = [];
    roles.value = [];
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
