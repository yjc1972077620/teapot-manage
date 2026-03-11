import type { ColumnMappingInfo, MappingColumnParam } from '../../common/mapping';
import type { IdsParam } from '../../common/params';

export interface EsColumnItemParam {
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

export interface EsColumnItemUpdateParam {
  columnSql?: string;
  delimiter?: string;
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

export interface EsColumnItemRequest {
  columnItemList?: EsColumnItemParam[];
  tableItemId?: number;
}

export interface EsColumnItemUpdateRequest {
  columnItemList?: EsColumnItemUpdateParam[];
}

export interface EsColumnItem {
  columnSql?: string;
  createTime?: string;
  delimiter?: string;
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
