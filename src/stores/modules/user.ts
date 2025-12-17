import * as userApi from "@/api/modules/user";
import router from "@/router";
import { removeToken, setToken } from "@/utils/auth";

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
}

export const useUserStore = defineStore(
  "user",
  () => {
    const token = ref("");
    const userInfo = ref<UserInfo>({} as UserInfo);
    const permissions = ref<string[]>([]);
    const roles = ref<string[]>([]);

    const login = async (data: { username: string; password: string }) => {
      const res = await userApi.login(data);
      token.value = res.token;
      setToken(res.token);
      return res;
    };

    const getInfo = async () => {
      const res = await userApi.getUserInfo();
      userInfo.value = res.user;
      permissions.value = res.permissions || [];
      roles.value = res.roles || [];
      return res;
    };

    const logout = async () => {
      try {
        await userApi.logout();
      } finally {
        token.value = "";
        userInfo.value = {} as UserInfo;
        permissions.value = [];
        roles.value = [];
        removeToken();
        router.push("/login");
      }
    };

    return {
      token,
      userInfo,
      permissions,
      roles,
      login,
      getInfo,
      logout
    };
  },
  {
    persist: {
      pick: ["token"]
    }
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
