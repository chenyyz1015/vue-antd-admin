import request from "../request";
import type { PageParams, PageResult } from "../types";
import type {
  AddAdminAccountParams,
  AdminAccount,
  Project,
  ProjectApplication,
  ProjectFormData,
  ResourceRecord
} from "../types/project";

// 获取项目列表
export function getProjectList(params: PageParams): Promise<PageResult<Project>> {
  return request({
    url: "/project/list",
    method: "get",
    params
  });
}

// 添加项目
export function addProject(data: ProjectFormData) {
  return request({
    url: "/project/add",
    method: "post",
    data
  });
}

// 更新项目
export function updateProject(id: string, data: Partial<ProjectFormData>) {
  return request({
    url: `/project/update/${id}`,
    method: "put",
    data
  });
}

// 删除项目
export function deleteProject(id: string) {
  return request({
    url: `/project/delete/${id}`,
    method: "delete"
  });
}

// 获取项目详情
export function getProjectDetail(id: string): Promise<Project> {
  return request({
    url: `/project/detail/${id}`,
    method: "get"
  });
}

// 更新项目资源
export function updateProjectResource(id: string, data: any) {
  return request({
    url: `/project/resource/${id}`,
    method: "put",
    data
  });
}

// 获取资源操作记录
export function getResourceRecords(projectId: string): Promise<ResourceRecord[]> {
  return request({
    url: `/project/resource/records/${projectId}`,
    method: "get"
  });
}

// 获取项目应用列表
export function getProjectApplications(projectId: string): Promise<ProjectApplication> {
  return request({
    url: `/project/applications/${projectId}`,
    method: "get"
  });
}

// 更新项目应用
export function updateProjectApplications(projectId: string, data: any) {
  return request({
    url: `/project/applications/${projectId}`,
    method: "put",
    data
  });
}

// 获取管理员账号列表
export function getAdminAccounts(): Promise<AdminAccount[]> {
  return request({
    url: "/admin/accounts",
    method: "get"
  });
}

// 新增管理员账号
export function addAdminAccount(data: AddAdminAccountParams): Promise<AdminAccount> {
  return request({
    url: "/admin/account/add",
    method: "post",
    data
  });
}
