export interface RemoteResponse<T> {
  code: number;
  msg?: string;
  data?: T;
}

export interface PageableResponse<T> {
  code: number;
  msg?: string;
  data?: T[];
  pageNo?: number;
  pageSize?: number;
  total?: number;
}
