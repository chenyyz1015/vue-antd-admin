import mockjs from "mockjs";
import type { MockMethod } from "vite-plugin-mock";

const { Random } = mockjs;

const userList = Array.from({ length: 50 }, (_, i) => ({
  id: String(i + 1),
  username: Random.word(5, 10),
  nickname: Random.cname(),
  status: Random.integer(0, 1),
  createTime: Random.datetime("yyyy-MM-dd HH:mm:ss")
}));

const roleList = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  roleName: ["管理员", "编辑员", "普通用户", "访客", "开发者"][i % 5],
  roleCode: ["admin", "editor", "user", "guest", "developer"][i % 5],
  status: Random.integer(0, 1),
  createTime: Random.datetime("yyyy-MM-dd HH:mm:ss")
}));

export default [
  {
    url: "/system/user/list",
    method: "get",
    response: ({ query }: any) => {
      const { page = 1, size = 10 } = query;
      const start = (page - 1) * size;
      const end = start + Number(size);

      return {
        code: 200,
        message: "获取成功",
        data: {
          records: userList.slice(start, end),
          total: userList.length,
          page: Number(page),
          size: Number(size)
        }
      };
    }
  },
  {
    url: "/system/user/add",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "添加成功",
        data: null
      };
    }
  },
  {
    url: "/system/user/update",
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
    url: "/system/user/delete/:id",
    method: "delete",
    response: () => {
      return {
        code: 200,
        message: "删除成功",
        data: null
      };
    }
  },
  {
    url: "/system/role/list",
    method: "get",
    response: ({ query }: any) => {
      const { page = 1, size = 10 } = query;
      const start = (page - 1) * size;
      const end = start + Number(size);

      return {
        code: 200,
        message: "获取成功",
        data: {
          records: roleList.slice(start, end),
          total: roleList.length,
          page: Number(page),
          size: Number(size)
        }
      };
    }
  }
] as MockMethod[];
