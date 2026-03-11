import type { IdsParam } from '../../common/params';
import type { EsColumnItem } from '../columnItem/columnItemType';

export interface EsTableItemParam {
  dbName?: string;
  delimiter?: string;
  master?: boolean;
  nestedKey?: string;
  otherCondition?: string;
  primaryKey?: string;
  shardedCount?: number;
  srcDsId?: number;
  tableName?: string;
  tableNameRegex?: string;
  topic?: string;
  type?: number;
  updateTimeColumnName?: string;
}

export interface EsTableItemUpdateParam {
  dbName?: string;
  delimiter?: string;
  id?: number;
  master?: boolean;
  nestedKey?: string;
  otherCondition?: string;
  primaryKey?: string;
  shardedCount?: number;
  srcDsId?: number;
  tableName?: string;
  tableNameRegex?: string;
  topic?: string;
  type?: number;
  updateTimeColumnName?: string;
}

export interface EsTableItemRequest {
  instanceId?: number;
  mappingId?: number;
  tableItemList?: EsTableItemParam[];
}

export interface EsTableItemUpdateRequest {
  tableItemList?: EsTableItemUpdateParam[];
}

export interface EsTableItem {
  columnItemList?: EsColumnItem[];
  createTime?: string;
  dbName?: string;
  delimiter?: string;
  id?: number;
  instanceId?: number;
  mappingId?: number;
  master?: boolean;
  nestedKey?: string;
  otherCondition?: string;
  primaryKey?: string;
  shardedCount?: number;
  srcDsId?: number;
  tableName?: string;
  tableNameRegex?: string;
  topic?: string;
  type?: number;
  updateTime?: string;
  updateTimeColumnName?: string;
}

export type { IdsParam };
