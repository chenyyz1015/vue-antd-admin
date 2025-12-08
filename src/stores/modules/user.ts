import { defineStore } from "pinia";
import { ref } from "vue";
import { login as loginApi, getUserInfo, logout as logoutApi } from "@/api/modules/user";
import { setToken, removeToken } from "@/utils/auth";
import router from "@/router";

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
      const res = await loginApi(data);
      token.value = res.token;
      setToken(res.token);
      return res;
    };

    const getInfo = async () => {
      const res = await getUserInfo();
      userInfo.value = res.user;
      permissions.value = res.permissions || [];
      roles.value = res.roles || [];
      return res;
    };

    const logout = async () => {
      try {
        await logoutApi();
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
      paths: ["token"]
    }
  }
);
