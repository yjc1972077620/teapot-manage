import type { IdsParam } from '../../common/params';
import type { DorisColumnItem } from '../columnItem/columnItemType';

export interface DorisTableItemParam {
  dorisDbName?: string;
  dorisTableName?: string;
  dbName?: string;
  master?: boolean;
  otherCondition?: string;
  primaryKey?: string;
  shardedCount?: number;
  srcDsId?: number;
  tableName?: string;
  tableNameRegex?: string;
  topic?: string;
  updateTimeColumnName?: string;
}

export interface DorisTableItemUpdateParam {
  dorisDbName?: string;
  dorisTableName?: string;
  dbName?: string;
  id?: number;
  master?: boolean;
  otherCondition?: string;
  primaryKey?: string;
  shardedCount?: number;
  srcDsId?: number;
  tableName?: string;
  tableNameRegex?: string;
  topic?: string;
  updateTimeColumnName?: string;
}

export interface DorisTableItemRequest {
  instanceId?: number;
  mappingId?: number;
  tableItemList?: DorisTableItemParam[];
}

export interface DorisTableItemUpdateRequest {
  tableItemList?: DorisTableItemUpdateParam[];
}

export interface DorisTableItem {
  dorisDbName?: string;
  dorisTableName?: string;
  columnItemList?: DorisColumnItem[];
  createTime?: string;
  dbName?: string;
  id?: number;
  instanceId?: number;
  mappingId?: number;
  master?: boolean;
  otherCondition?: string;
  primaryKey?: string;
  shardedCount?: number;
  srcDsId?: number;
  tableName?: string;
  tableNameRegex?: string;
  topic?: string;
  updateTime?: string;
  updateTimeColumnName?: string;
}

export type { IdsParam };
