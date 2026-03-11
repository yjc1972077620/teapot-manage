import type { IdsParam } from '../../common/params';
import type { ClickhouseColumnItem } from '../columnItem/columnItemType';

export interface ClickhouseTableItemParam {
  clickhouseDbName?: string;
  clickhouseTableName?: string;
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

export interface ClickhouseTableItemUpdateParam {
  clickhouseDbName?: string;
  clickhouseTableName?: string;
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

export interface ClickhouseTableItemRequest {
  instanceId?: number;
  mappingId?: number;
  tableItemList?: ClickhouseTableItemParam[];
}

export interface ClickhouseTableItemUpdateRequest {
  tableItemList?: ClickhouseTableItemUpdateParam[];
}

export interface ClickhouseTableItem {
  clickhouseDbName?: string;
  clickhouseTableName?: string;
  columnItemList?: ClickhouseColumnItem[];
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
