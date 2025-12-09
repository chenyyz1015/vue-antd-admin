import router from "@/router";
import { useUserStore } from "@/stores/modules/user";
import { message } from "ant-design-vue";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data, msg } = response.data;

    if (code === 200) {
      return data;
    } else if (code === 401) {
      message.error("登录已过期，请重新登录");
      const userStore = useUserStore();
      userStore.logout();
      router.push("/login");
      return Promise.reject(new Error(msg || "Token 过期"));
    } else {
      message.error(msg || "请求失败");
      return Promise.reject(new Error(msg || "请求失败"));
    }
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        message.error("登录已过期，请重新登录");
        const userStore = useUserStore();
        userStore.logout();
        router.push("/login");
      } else if (status === 403) {
        message.error("没有权限访问该资源");
      } else if (status === 500) {
        message.error("服务器错误");
      } else {
        message.error(data?.msg || "请求失败");
      }
    } else if (error.request) {
      message.error("网络连接失败，请检查网络");
    } else {
      message.error("请求配置错误");
    }
    return Promise.reject(error);
  }
);

export default request;
