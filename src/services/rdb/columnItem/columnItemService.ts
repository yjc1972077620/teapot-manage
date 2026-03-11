import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { ColumnMappingInfo, IdsParam, MappingColumnParam, RdbColumnItem, RdbColumnItemRequest, RdbColumnItemUpdateRequest } from '../../../types/rdb/columnItem/columnItemType';

const columnItemService = {
  /** 接口：获取mappingAll列映射信息 */
  getMappingAllColumnItem(params?: MappingColumnParam): Promise<RemoteResponse<ColumnMappingInfo[]>> {
    return post<RemoteResponse<ColumnMappingInfo[]>>('/rdb/columnItem/mappingAll', params);
  },
  /** 接口：批量新增列映射信息 */
  insertColumnItem(params?: RdbColumnItemRequest): Promise<RemoteResponse<RdbColumnItem[]>> {
    return post<RemoteResponse<RdbColumnItem[]>>('/rdb/columnItem/insert', params);
  },
  /** 接口：批量更新列映射信息 */
  updateColumnItem(params?: RdbColumnItemUpdateRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/rdb/columnItem/update', params);
  },
  /** 接口：删除列映射信息 */
  deleteColumnItem(params?: IdsParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/rdb/columnItem/delete', params);
  },
};

export default columnItemService;
