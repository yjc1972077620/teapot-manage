import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { ColumnMappingInfo, EsColumnItem, EsColumnItemRequest, EsColumnItemUpdateRequest, IdsParam, MappingColumnParam } from '../../../types/es/columnItem/columnItemType';

const columnItemService = {
  /** 接口：批量更新列映射信息 */
  updateColumnItem(params?: EsColumnItemUpdateRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/es/columnItem/update', params);
  },
  /** 接口：删除列映射信息 */
  deleteColumnItem(params?: IdsParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/es/columnItem/delete', params);
  },
  /** 接口：批量新增列映射信息 */
  insertColumnItem(params?: EsColumnItemRequest): Promise<RemoteResponse<EsColumnItem[]>> {
    return post<RemoteResponse<EsColumnItem[]>>('/es/columnItem/insert', params);
  },
  /** 接口：获取mappingAll列映射信息 */
  getMappingAllColumnItem(params?: MappingColumnParam): Promise<RemoteResponse<ColumnMappingInfo[]>> {
    return post<RemoteResponse<ColumnMappingInfo[]>>('/es/columnItem/mappingAll', params);
  },
};

export default columnItemService;
