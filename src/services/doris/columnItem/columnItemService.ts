import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { DorisColumnItem, DorisColumnItemRequest, DorisColumnItemUpdateRequest, ColumnMappingInfo, IdsParam, MappingColumnParam } from '../../../types/doris/columnItem/columnItemType';

const columnItemService = {
  /** 接口：获取mappingAll列映射信息 */
  getMappingAllColumnItem(params?: MappingColumnParam): Promise<RemoteResponse<ColumnMappingInfo[]>> {
    return post<RemoteResponse<ColumnMappingInfo[]>>('/doris/columnItem/mappingAll', params);
  },
  /** 接口：批量新增列映射信息 */
  insertColumnItem(params?: DorisColumnItemRequest): Promise<RemoteResponse<DorisColumnItem[]>> {
    return post<RemoteResponse<DorisColumnItem[]>>('/doris/columnItem/insert', params);
  },
  /** 接口：批量更新列映射信息 */
  updateColumnItem(params?: DorisColumnItemUpdateRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/doris/columnItem/update', params);
  },
  /** 接口：删除列映射信息 */
  deleteColumnItem(params?: IdsParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/doris/columnItem/delete', params);
  },
};

export default columnItemService;
