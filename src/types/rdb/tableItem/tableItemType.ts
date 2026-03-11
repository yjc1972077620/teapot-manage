import type { IdsParam } from '../../common/params';
import type { RdbColumnItem } from '../columnItem/columnItemType';

export interface RdbTableItemParam {
  dbName?: string;
  mappingAll?: boolean;
  master?: boolean;
  needSync?: boolean;
  orgIdColumnName?: string;
  otherCondition?: string;
  primaryKey?: string;
  srcDsId?: number;
  tableName?: string;
  targetPrimaryKey?: string;
  targetTableName?: string;
  topic?: string;
  updateTimeColumnName?: string;
}

export interface RdbTableItemUpdateParam {
  dbName?: string;
  id?: number;
  mappingAll?: boolean;
  master?: boolean;
  needSync?: boolean;
  orgIdColumnName?: string;
  otherCondition?: string;
  primaryKey?: string;
  srcDsId?: number;
  tableName?: string;
  targetPrimaryKey?: string;
  targetTableName?: string;
  topic?: string;
  updateTimeColumnName?: string;
}

export interface RdbTableItemRequest {
  instanceId?: number;
  mappingId?: number;
  tableItemList?: RdbTableItemParam[];
}

export interface RdbTableItemUpdateRequest {
  tableItemList?: RdbTableItemUpdateParam[];
}

export interface RdbTableItem {
  columnItemList?: RdbColumnItem[];
  createTime?: string;
  dbName?: string;
  id?: number;
  instanceId?: number;
  mappingAll?: boolean;
  mappingId?: number;
  master?: boolean;
  needSync?: boolean;
  orgIdColumnName?: string;
  otherCondition?: string;
  primaryKey?: string;
  shardedCount?: number;
  srcDsId?: number;
  tableName?: string;
  tableNameRegex?: string;
  targetPrimaryKey?: string;
  targetTableName?: string;
  topic?: string;
  updateTime?: string;
  updateTimeColumnName?: string;
}

export type { IdsParam };
