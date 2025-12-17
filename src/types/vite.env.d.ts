/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 项目标题
   */
  readonly VITE_APP_TITLE: string;

  /**
   * 部署路径
   */
  readonly VITE_APP_BASE_URL: string;

  /**
   * 接口基础地址
   */
  readonly VITE_APP_BASE_API_URL: string;

  /**
   * 接口超时时间
   */
  readonly VITE_APP_BASE_API_TIMEOUT: string;

  /**
   * 是否开启 Mock
   */
  readonly VITE_APP_USE_MOCK: "true" | "false";

  /**
   * 开发端口
   */
  readonly VITE_DEV_PORT: string;

  /**
   * 是否自动打开
   */
  readonly VITE_DEV_OPEN: "true" | "false";

  /**
   * 打包时是否移除 console
   */
  readonly VITE_DROP_CONSOLE: "true" | "false";

  /**
   * 打包时是否移除 debugger
   */
  readonly VITE_DROP_DEBUGGER: "true" | "false";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
