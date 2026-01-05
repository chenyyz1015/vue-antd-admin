import i18n from "@/locales";
import { getToken } from "@/utils/auth";
import { message } from "ant-design-vue";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { HTTP_STATUS_MAP } from "./constant";
import { handleErrorMessage, handleUnauthorized } from "./handler";
import type { ResponseData } from "./types";

const { t } = i18n.global;

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  timeout: Number(import.meta.env.VITE_APP_BASE_API_TIMEOUT || 60000),
  headers: {
    "Content-Type": "application/json"
  }
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getToken();
    if (accessToken) {
      config.headers["Authorization"] = accessToken;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    message.error(t(HTTP_STATUS_MAP.config));
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    const { code, data, message } = response.data;
    // 业务状态码处理
    if (code === 200) {
      return data;
    } else if (code === 401) {
      handleUnauthorized();
      return Promise.reject(new Error(message || t(HTTP_STATUS_MAP[401])));
    } else {
      handleErrorMessage(code, message);
      return Promise.reject(new Error(message || t(HTTP_STATUS_MAP.unknown)));
    }
  },
  (error) => {
    if (error.response) {
      // 请求已发出,但服务器响应状态码不在 2xx 范围
      const { status, data } = error.response;
      if (status === 401) {
        // 401状态码特殊处理
        handleUnauthorized();
      } else {
        handleErrorMessage(status, data.message || data.msg);
      }
    } else if (error.request) {
      // 请求已发出,但没有收到响应
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        // 判断是否为超时错误
        message.error(t(HTTP_STATUS_MAP.timeout));
      } else {
        message.error(t(HTTP_STATUS_MAP.network));
      }
    } else if (axios.isCancel(error)) {
      // 请求取消
      console.warn("Request cancelled:", error.message);
      message.warning(t(HTTP_STATUS_MAP.cancel));
    } else {
      // 其他错误
      message.error(t(HTTP_STATUS_MAP.config));
    }
    return Promise.reject(error);
  }
);

export default request;
