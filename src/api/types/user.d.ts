export interface LoginParams {
  username?: string;
  phone?: string;
  password?: string;
  grantType: "password" | "sms";
  rememberPassword?: boolean;
}

export interface LoginResult {
  token: string;
}

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar: string;
}

export interface UserInfoResult {
  user: UserInfo;
  permissions: string[];
  roles: string[];
}
