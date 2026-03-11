export interface ColumnMappingInfo {
  srcColumnName?: string;
  srcDataType?: number;
  targetColumnName?: string;
  targetDataType?: number;
}

export interface MappingColumnParam {
  dsInfoId?: number;
  tableName?: string;
}
