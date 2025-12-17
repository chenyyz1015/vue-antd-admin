import type { MockMethod } from "vite-plugin-mock";

const tokens = {
  admin: "admin-token-123456",
  editor: "editor-token-123456"
};

const users = {
  "admin-token-123456": {
    user: {
      id: "1",
      username: "admin",
      nickname: "管理员",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
    },
    permissions: ["*:*:*"],
    roles: ["admin"]
  },
  "editor-token-123456": {
    user: {
      id: "2",
      username: "editor",
      nickname: "编辑员",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=editor"
    },
    permissions: ["system:user:view", "system:role:view"],
    roles: ["editor"]
  }
};

export default [
  {
    url: "/auth/login",
    method: "post",
    response: ({ body }: any) => {
      const { username, password } = body;
      if (!username || !password) {
        return {
          code: 400,
          message: "用户名或密码不能为空",
          data: null
        };
      }

      const token = tokens[username as keyof typeof tokens];
      if (!token) {
        return {
          code: 401,
          message: "用户名或密码错误",
          data: null
        };
      }

      return {
        code: 200,
        message: "登录成功",
        data: { token }
      };
    }
  },
  {
    url: "/auth/userInfo",
    method: "get",
    response: ({ headers }: any) => {
      const token = headers.authorization?.replace("Bearer ", "");
      const userInfo = users[token as keyof typeof users];

      if (!userInfo) {
        return {
          code: 401,
          message: "用户未登录",
          data: null
        };
      }

      return {
        code: 200,
        message: "获取成功",
        data: userInfo
      };
    }
  },
  {
    url: "/auth/logout",
    method: "post",
    response: () => {
      return {
        code: 200,
        message: "退出成功",
        data: null
      };
    }
  }
] as MockMethod[];
