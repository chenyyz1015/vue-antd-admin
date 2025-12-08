import request from "../request";
import type { LoginParams, LoginResult, UserInfoResult } from "../types";

export function login(data: LoginParams) {
  return request<LoginResult>({
    url: "/auth/login",
    method: "post",
    data
  });
}

export function getUserInfo() {
  return request<UserInfoResult>({
    url: "/auth/userInfo",
    method: "get"
  });
}

export function logout() {
  return request({
    url: "/auth/logout",
    method: "post"
  });
}
