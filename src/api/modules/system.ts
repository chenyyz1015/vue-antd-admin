import request from "../request";
import type { PageParams, PageResult, User } from "../types";

export function getUserList(params: PageParams): Promise<PageResult<User>> {
  return request({
    url: "/system/user/list",
    method: "get",
    params
  });
}

export function addUser(data: Partial<User>) {
  return request({
    url: "/system/user/add",
    method: "post",
    data
  });
}

export function updateUser(data: Partial<User>) {
  return request({
    url: "/system/user/update",
    method: "put",
    data
  });
}

export function deleteUser(id: string) {
  return request({
    url: `/system/user/delete/${id}`,
    method: "delete"
  });
}
