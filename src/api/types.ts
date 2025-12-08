export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
}

export interface UserInfoResult {
  user: UserInfo;
  permissions: string[];
  roles: string[];
}

export interface PageParams {
  page: number;
  pageSize: number;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  page: number;
  pageSize: number;
}
