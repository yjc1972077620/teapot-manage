export interface DsInfoParam {
  id?: number;
  name?: string;
  password?: string;
  properties?: Record<string, unknown>;
  type?: number;
  url?: string;
  userName?: string;
}

export interface DsInfoPageQuery {
  createTimeEnd?: string;
  createTimeStart?: string;
  idList?: number[];
  name?: string;
  pageNo?: number;
  pageSize?: number;
  type?: number;
}

export interface DsInfoQuery {
  id?: number;
}

export interface DsInfoPageVO {
  createTime?: string;
  id?: number;
  name?: string;
  properties?: string;
  type?: number;
  updateTime?: string;
  url?: string;
}

export interface DsInfoVO {
  createTime?: string;
  id?: number;
  name?: string;
  password?: string;
  properties?: string;
  type?: number;
  updateTime?: string;
  url?: string;
  userName?: string;
}
