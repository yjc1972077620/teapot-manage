import type { ColumnMappingInfo, MappingColumnParam } from '../../common/mapping';
import type { IdsParam } from '../../common/params';

export interface ClickhouseColumnItemParam {
  foreignKey?: boolean;
  mainTableFk?: string;
  needData?: boolean;
  primaryKey?: boolean;
  srcColumnName?: string;
  srcDataType?: number;
  targetColumnName?: string;
  targetDataType?: number;
}

export interface ClickhouseColumnItemUpdateParam {
  foreignKey?: boolean;
  id?: number;
  mainTableFk?: string;
  needData?: boolean;
  primaryKey?: boolean;
  srcColumnName?: string;
  srcDataType?: number;
  targetColumnName?: string;
  targetDataType?: number;
}

export interface ClickhouseColumnItemRequest {
  columnItemList?: ClickhouseColumnItemParam[];
  tableItemId?: number;
}

export interface ClickhouseColumnItemUpdateRequest {
  columnItemList?: ClickhouseColumnItemUpdateParam[];
}

export interface ClickhouseColumnItem {
  createTime?: string;
  foreignKey?: boolean;
  id?: number;
  mainTableFk?: string;
  needData?: boolean;
  primaryKey?: boolean;
  srcColumnName?: string;
  srcDataType?: number;
  tableItemId?: number;
  targetColumnName?: string;
  targetDataType?: number;
  updateTime?: string;
}

export type { ColumnMappingInfo, MappingColumnParam, IdsParam };
