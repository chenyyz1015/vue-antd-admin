// src/mock/project.ts
import mockjs from "mockjs";
import type { MockMethod } from "vite-plugin-mock";

const { Random } = mockjs;

const projectTypes = ["城市安全", "智慧社区", "园区管理", "校园安防"];
const signStatuses = ["未签约", "已签约", "执行中", "已完成", "已终止"];
const features = ["靓马空递", "业务中台", "数据分析", "智能监控"];
const adminAccounts = ["zhangsan", "lisi", "wangwu"];
const projectCenters = ["华东中心", "华南中心", "华北中心", "西南中心"];

const projectList = Array.from({ length: 30 }, (_, i) => ({
  id: String(i + 1),
  projectId: `PRJ${String(i + 1).padStart(6, "0")}`,
  projectName: `${Random.city()}${projectTypes[i % 4]}项目`,
  contractProjectName: `${Random.city()}${projectTypes[i % 4]}项目合同`,
  partyA: `${Random.city()}${Random.pick(["科技有限公司", "发展集团", "建设公司", "管理中心"])}`,
  signStatus: signStatuses[i % 5],
  status: Random.integer(0, 1),
  region: `${Random.province()}/${Random.city()}/${Random.county()}`,
  projectType: projectTypes[i % 4],
  responsible: Random.cname(),
  phone: `1${Random.integer(3, 9)}${Random.integer(100000000, 999999999)}`,
  adminAccounts: Random.shuffle(adminAccounts).slice(0, Random.integer(1, 3)),
  projectCenter: projectCenters[i % 4],
  cabinetAuth: Random.pick([1, 3, 5, 10, -1]),
  droneAuth: Random.pick([1, 3, 5, 10, -1]),
  storageLimit: Random.pick([200, 400, 600, 1000, -1]),
  smsLimit: Random.pick([1000, 2000, 5000, 10000, -1]),
  expiryDate: Random.integer(0, 1) === 0 ? Random.datetime("yyyy.MM.dd HH:mm:ss") : "2099.12.31 23:59:59",
  features: Random.shuffle(features).slice(0, Random.integer(1, 3)),
  applications: [
    {
      id: "1",
      appName: "靓马空递",
      appCode: "lm_delivery",
      appIcon: "📦",
      appType: "system",
      status: Random.integer(0, 1),
      routeUrl: "/delivery",
      remark: "物流配送系统",
      source: "系统应用"
    },
    {
      id: "2",
      appName: "业务中台",
      appCode: "business_platform",
      appIcon: "🏢",
      appType: "system",
      status: Random.integer(0, 1),
      routeUrl: "/business",
      remark: "业务管理平台",
      source: "系统应用"
    }
  ],
  systemUrl: "https://wuliu.lmyfhk.com",
  createTime: Random.datetime("yyyy-MM-dd HH:mm:ss")
}));

const resourceRecords: any[] = [];
projectList.forEach((project) => {
  const count = Random.integer(3, 8);
  for (let i = 0; i < count; i++) {
    const operation = Random.pick(["物流柜授权", "无人机授权", "存储上限", "短信上限"]);
    const operationType = Random.pick(["add", "delete"]);
    const beforeCount = Random.integer(1, 10);
    const changeCount = Random.integer(1, 5);
    resourceRecords.push({
      id: `${project.id}-${i}`,
      projectId: project.id,
      time: Random.datetime("yyyy.MM.dd HH:mm:ss"),
      operator: Random.cname(),
      operation,
      operationType,
      beforeCount,
      afterCount: operationType === "add" ? beforeCount + changeCount : beforeCount - changeCount,
      changeCount
    });
  }
});

const systemApplications = [
  {
    id: "1",
    appName: "靓马空递",
    appCode: "lm_delivery",
    appIcon: "📦",
    appType: "system",
    status: 0,
    routeUrl: "/delivery",
    remark: "物流配送系统",
    source: "系统应用"
  },
  {
    id: "2",
    appName: "业务中台",
    appCode: "business_platform",
    appIcon: "🏢",
    appType: "system",
    status: 0,
    routeUrl: "/business",
    remark: "业务管理平台",
    source: "系统应用"
  },
  {
    id: "3",
    appName: "数据分析",
    appCode: "data_analysis",
    appIcon: "📊",
    appType: "system",
    status: 0,
    routeUrl: "/analysis",
    remark: "数据分析系统",
    source: "系统应用"
  }
];

// 管理员账号列表
const adminAccountList = [
  { id: "1", username: "zhangsan", nickname: "张三" },
  { id: "2", username: "lisi", nickname: "李四" },
  { id: "3", username: "wangwu", nickname: "王五" },
  { id: "4", username: "zhaoliu", nickname: "赵六" }
];

export default [
  {
    url: "/project/list",
    method: "get",
    response: ({ query }: any) => {
      const { page = 1, size = 10 } = query;
      const start = (page - 1) * size;
      const end = start + Number(size);

      return {
        code: 200,
        message: "获取成功",
        data: {
          records: projectList.slice(start, end),
          total: projectList.length,
          page: Number(page),
          size: Number(size)
        }
      };
    }
  },
  {
    url: "/project/add",
    method: "post",
    response: ({ body }: any) => {
      const newProject = {
        id: String(projectList.length + 1),
        projectId: `PRJ${String(projectList.length + 1).padStart(6, "0")}`,
        ...body,
        status: 1,
        systemUrl: "https://wuliu.lmyfhk.com",
        createTime: new Date().toISOString()
      };
      projectList.push(newProject);
      return {
        code: 200,
        message: "添加成功",
        data: newProject
      };
    }
  },
  {
    url: "/project/update/:id",
    method: "put",
    response: ({ body, query }: any) => {
      const id = query.id;
      const index = projectList.findIndex((p) => p.id === id);
      if (index !== -1) {
        projectList[index] = { ...projectList[index], ...body };
      }
      return {
        code: 200,
        message: "更新成功",
        data: null
      };
    }
  },
  {
    url: "/project/delete/:id",
    method: "delete",
    response: ({ query }: any) => {
      const id = query.id;
      const index = projectList.findIndex((p) => p.id === id);
      if (index !== -1) {
        projectList.splice(index, 1);
      }
      return {
        code: 200,
        message: "删除成功",
        data: null
      };
    }
  },
  {
    url: "/project/detail/:id",
    method: "get",
    response: ({ query }: any) => {
      const id = query.id;
      const project = projectList.find((p) => p.id === id);
      return {
        code: 200,
        message: "获取成功",
        data: project
      };
    }
  },
  {
    url: "/project/resource/:id",
    method: "put",
    response: ({ body, query }: any) => {
      const id = query.id;
      const record = {
        id: String(resourceRecords.length + 1),
        projectId: id,
        time: new Date()
          .toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          })
          .replace(/\//g, "."),
        operator: "张三",
        ...body
      };
      resourceRecords.push(record);
      return {
        code: 200,
        message: "更新成功",
        data: null
      };
    }
  },
  {
    url: "/project/resource/records/:projectId",
    method: "get",
    response: ({ query }: any) => {
      const projectId = query.projectId;
      const records = resourceRecords.filter((r) => r.projectId === projectId);
      return {
        code: 200,
        message: "获取成功",
        data: records
      };
    }
  },
  {
    url: "/project/applications/:projectId",
    method: "get",
    response: ({ query }: any) => {
      return {
        code: 200,
        message: "获取成功",
        data: {
          projectId: query.projectId,
          applications: [...systemApplications]
        }
      };
    }
  },
  {
    url: "/project/applications/:projectId",
    method: "put",
    response: () => {
      return {
        code: 200,
        message: "更新成功",
        data: null
      };
    }
  },
  {
    url: "/admin/accounts",
    method: "get",
    response: () => {
      return {
        code: 200,
        message: "获取成功",
        data: adminAccountList
      };
    }
  },
  {
    url: "/admin/account/add",
    method: "post",
    response: ({ body }: any) => {
      const newAccount = {
        id: String(adminAccountList.length + 1),
        username: body.username,
        nickname: body.nickname
        // 注意：实际场景中密码不应该返回给前端
        // password: body.password
      };
      adminAccountList.push(newAccount);
      return {
        code: 200,
        message: "添加成功",
        data: newAccount
      };
    }
  }
] as MockMethod[];
