import request from "../request";
import type { LoginParams, LoginResult, UserInfoResult } from "../types";

export function login(data: LoginParams): Promise<LoginResult> {
  return request({
    url: "/auth/login",
    method: "post",
    data
  });
}

export function getUserInfo(): Promise<UserInfoResult> {
  return request({
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
