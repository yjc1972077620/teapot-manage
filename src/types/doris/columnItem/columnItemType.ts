import type { ColumnMappingInfo, MappingColumnParam } from '../../common/mapping';
import type { IdsParam } from '../../common/params';

export interface DorisColumnItemParam {
  foreignKey?: boolean;
  mainTableFk?: string;
  needData?: boolean;
  primaryKey?: boolean;
  srcColumnName?: string;
  srcDataType?: number;
  targetColumnName?: string;
  targetDataType?: number;
}

export interface DorisColumnItemUpdateParam {
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

export interface DorisColumnItemRequest {
  columnItemList?: DorisColumnItemParam[];
  tableItemId?: number;
}

export interface DorisColumnItemUpdateRequest {
  columnItemList?: DorisColumnItemUpdateParam[];
}

export interface DorisColumnItem {
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
