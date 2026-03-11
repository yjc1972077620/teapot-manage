import type { ColumnMappingInfo, MappingColumnParam } from '../../common/mapping';
import type { IdsParam } from '../../common/params';

export interface RdbColumnItemParam {
  foreignKey?: boolean;
  mainTableFk?: string;
  needData?: boolean;
  primaryKey?: boolean;
  srcColumnName?: string;
  srcDataType?: number;
  targetColumnName?: string;
  targetDataType?: number;
}

export interface RdbColumnItemUpdateParam {
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

export interface RdbColumnItemRequest {
  columnItemList?: RdbColumnItemParam[];
  tableItemId?: number;
}

export interface RdbColumnItemUpdateRequest {
  columnItemList?: RdbColumnItemUpdateParam[];
}

export interface RdbColumnItem {
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
