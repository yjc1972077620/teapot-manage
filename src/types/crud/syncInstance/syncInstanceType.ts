import type { DsInfoParam } from '../dsInfo/dsInfoType';

export type ClickhouseMappingParam = Record<string, unknown>;
export type DorisMappingParam = Record<string, unknown>;

export interface DorisMappingUpdateParam {
  id?: number;
}

export interface EsMappingParam {
  esIndexId?: string;
  etlCondition?: string;
  indexName?: string;
  methodMappings?: Record<string, unknown>;
}

export interface EsMappingUpdateParam {
  etlCondition?: string;
  id?: number;
  methodMappings?: Record<string, unknown>;
}

export interface RdbMappingParam {
  etlCondition?: string;
}

export interface RdbMappingUpdateParam {
  id?: number;
}

export interface SyncInstanceCopyParam {
  env?: string;
  id?: number;
  instanceName?: string;
  sameDsId?: number;
  tableNameDsIdMap?: {
  [key: string]: number;
};
  tableNameDsInfoParamList?: SyncInstanceCopyParam_TableNameDsInfoParam[];
}

export interface SyncInstanceCopyParam_TableNameDsInfoParam {
  dsInfoParam?: DsInfoParam;
  tableNameList?: string[];
}

export interface SyncInstanceLogConfigParam {
  enableLog?: boolean;
  ids?: number[];
}

export interface SyncInstanceParam {
  clickhouseMappingParam?: ClickhouseMappingParam;
  dorisMappingParam?: DorisMappingParam;
  createUserGuid?: string;
  esMappingParam?: EsMappingParam;
  id?: number;
  instanceName?: string;
  rdbMappingParam?: RdbMappingParam;
  syncType?: number;
  team?: string;
}

export interface SyncInstanceStatusParam {
  id?: number;
  status?: number;
}

export interface SyncInstanceUpdateParam {
  dorisMappingUpdateParam?: DorisMappingUpdateParam;
  esMappingUpdateParam?: EsMappingUpdateParam;
  id?: number;
  instanceName?: string;
  rdbMappingUpdateParam?: RdbMappingUpdateParam;
}

export interface SyncInstancePageQuery {
  createTimeEnd?: string;
  createTimeStart?: string;
  createUserGuid?: string;
  enableLog?: number;
  idList?: number[];
  instanceName?: string;
  pageNo?: number;
  pageSize?: number;
  status?: number;
  syncType?: number;
  team?: string;
}

export interface SyncInstanceQuery {
  id?: number;
  idList?: number[];
}

export interface SyncInstancePageVO {
  createTime?: string;
  enableLog?: number;
  id?: number;
  instanceName?: string;
  srcTableName?: string;
  status?: number;
  syncType?: number;
  targetTableName?: string;
  team?: string;
  updateTime?: string;
}

export interface SyncInstancePublishVO {
  checkError?: string;
  success?: boolean;
}

export interface SyncInstanceVO {
  createTime?: string;
  createUserGuid?: string;
  enableLog?: number;
  id?: number;
  instanceName?: string;
  mappingId?: number;
  mappingJson?: Record<string, unknown>;
  pushType?: number;
  srcDsIdList?: string;
  srcTableName?: string;
  status?: number;
  syncType?: number;
  targetTableName?: string;
  team?: string;
  topicList?: string;
  updateTime?: string;
}
