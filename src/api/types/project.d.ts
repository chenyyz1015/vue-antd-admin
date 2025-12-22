export interface Project {
  id: string;
  projectId: string;
  projectName: string;
  contractProjectName: string; // 合同项目名称
  partyA: string; // 甲方单位
  signStatus: string; // 签约状态
  status: number; // 0-禁用 1-启用
  region: string; // 行政区域
  projectType: string;
  responsible: string;
  phone: string;
  adminAccounts: string[]; // 相关管理员账号
  projectCenter: string; // 项目中心
  cabinetAuth: number; // 物流柜授权台数 (-1表示不限制)
  droneAuth: number; // 无人机授权台数
  storageLimit: number; // 存储上限(G)
  smsLimit: number; // 短信上限(条)
  expiryDate: string; // 项目到期日
  features: string[]; // 开通功能
  applications: Application[]; // 项目应用列表
  systemUrl: string; // 系统地址
  createTime: string;
}

export interface ProjectFormData {
  projectName: string;
  contractProjectName: string;
  partyA: string;
  signStatus: string;
  region: string;
  projectType: string;
  responsible: string;
  phone: string;
  adminAccounts: string[];
  projectCenter: string;
  cabinetAuth: number;
  droneAuth: number;
  storageLimit: number;
  smsLimit: number;
  expiryDate: string;
  expiryType: "limited" | "unlimited"; // 限期类型
  features: string[];
  applications: Application[];
}

export interface ResourceRecord {
  id: string;
  time: string;
  operator: string;
  operation: string; // 操作项
  operationType: "add" | "delete"; // 新增/删除
  beforeCount: number;
  afterCount: number;
  changeCount: number;
}

export interface Application {
  id: string;
  appName: string;
  appCode: string;
  appIcon: string;
  appType: "system" | "custom"; // 系统应用/自定义应用
  status: number; // 0-关闭 1-开启
  routeUrl: string;
  remark: string;
  source: string; // 来源：系统应用/自定义应用
}

export interface ProjectApplication {
  projectId: string;
  applications: Application[];
}

// 管理员账号
export interface AdminAccount {
  id: string;
  username: string;
  nickname: string;
}

// 新增管理员账号请求参数
export interface AddAdminAccountParams {
  username: string;
  nickname: string;
  password: string;
}
