import type { HttpStatusMap } from "./types";

// HTTP状态码映射表
export const HTTP_STATUS_MAP: HttpStatusMap = {
  400: "http.error.400",
  401: "http.error.401",
  403: "http.error.403",
  404: "http.error.404",
  405: "http.error.405",
  408: "http.error.408",
  409: "http.error.409",
  410: "http.error.410",
  413: "http.error.413",
  414: "http.error.414",
  415: "http.error.415",
  422: "http.error.422",
  429: "http.error.429",
  500: "http.error.500",
  501: "http.error.501",
  502: "http.error.502",
  503: "http.error.503",
  504: "http.error.504",
  505: "http.error.505",
  network: "http.error.network",
  timeout: "http.error.timeout",
  cancel: "http.error.cancel",
  config: "http.error.config",
  unknown: "http.error.unknown"
};
