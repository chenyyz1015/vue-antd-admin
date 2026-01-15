export interface ResponseData<T = any> {
  code: number;
  msg: string;
  data: T;
}

export interface HttpStatusMap {
  [key: string | number]: string;
  400: string;
  401: string;
  403: string;
  404: string;
  405: string;
  408: string;
  409: string;
  410: string;
  413: string;
  414: string;
  415: string;
  422: string;
  429: string;
  500: string;
  501: string;
  502: string;
  503: string;
  504: string;
  505: string;
  network: string;
  timeout: string;
  cancel: string;
  config: string;
  unknown: string;
}

export interface PageParams {
  pageNum: number;
  pageSize: number;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  current: number;
  size: number;
  pages: number;
}
