export interface EsColumnItemRequestDTO {
  columnItemList?: EsColumnItemRequestDTO_EsColumnItemDTO[];
  tableItemId?: number;
}

export interface EsColumnItemRequestDTO_EsColumnItemDTO {
  columnSql?: string;
  delimiter?: string;
  foreignKey?: boolean;
  mainTableFk?: string;
  needData?: boolean;
  primaryKey?: boolean;
  srcColumnName?: string;
  srcDataType?: number;
  targetColumnName?: string;
  targetDataType?: number;
}

export interface EsTableItemRequestDTO {
  instanceId?: number;
  mappingId?: number;
  tableItemList?: EsTableItemRequestDTO_EsTableItemDTO[];
}

export interface EsTableItemRequestDTO_EsTableItemDTO {
  dbName?: string;
  delimiter?: string;
  esColumnItemRequestDTO?: EsColumnItemRequestDTO;
  master?: boolean;
  nestedKey?: string;
  otherCondition?: string;
  primaryKey?: string;
  shardedCount?: number;
  srcDsId?: number;
  tableItemId?: number;
  tableName?: string;
  tableNameRegex?: string;
  topic?: string;
  type?: number;
  updateTimeColumnName?: string;
}

export interface RdbColumnItemRequestDTO {
  columnItemList?: RdbColumnItemRequestDTO_RdbColumnItemDTO[];
  tableItemId?: number;
}

export interface RdbColumnItemRequestDTO_RdbColumnItemDTO {
  foreignKey?: boolean;
  mainTableFk?: string;
  needData?: boolean;
  primaryKey?: boolean;
  srcColumnName?: string;
  srcDataType?: number;
  targetColumnName?: string;
  targetDataType?: number;
}

export interface RdbTableItemRequestDTO {
  instanceId?: number;
  mappingId?: number;
  tableItemList?: RdbTableItemRequestDTO_RdbTableItemDTO[];
}

export interface RdbTableItemRequestDTO_RdbTableItemDTO {
  dbName?: string;
  mappingAll?: boolean;
  master?: boolean;
  needSync?: boolean;
  orgIdColumnName?: string;
  otherCondition?: string;
  primaryKey?: string;
  rdbColumnItemRequestDTO?: RdbColumnItemRequestDTO;
  srcDsId?: number;
  tableName?: string;
  targetPrimaryKey?: string;
  targetTableName?: string;
  topic?: string;
  updateTimeColumnName?: string;
}

export type ClickhouseMappingParam = Record<string, unknown>;
export type DorisMappingParam = Record<string, unknown>;

export interface DsInfoParam {
  id?: number;
  name?: string;
  password?: string;
  properties?: Record<string, unknown>;
  type?: number;
  url?: string;
  userName?: string;
}

export interface EsMappingParam {
  esIndexId?: string;
  etlCondition?: string;
  indexName?: string;
  methodMappings?: Record<string, unknown>;
}

export interface RdbMappingParam {
  etlCondition?: string;
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

export interface SyncInstanceFullCopyParam {
  copyParam?: SyncInstanceCopyParam;
  esTableItemRequestDTO?: EsTableItemRequestDTO;
  rdbTableItemRequestDTO?: RdbTableItemRequestDTO;
  srcInstanceVO?: SyncInstanceVO;
  syncInstanceParam?: SyncInstanceParam;
  team?: string;
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
