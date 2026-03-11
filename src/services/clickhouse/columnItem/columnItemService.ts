import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { ClickhouseColumnItem, ClickhouseColumnItemRequest, ClickhouseColumnItemUpdateRequest, ColumnMappingInfo, IdsParam, MappingColumnParam } from '../../../types/clickhouse/columnItem/columnItemType';

const columnItemService = {
  /** 接口：获取mappingAll列映射信息 */
  getMappingAllColumnItem(params?: MappingColumnParam): Promise<RemoteResponse<ColumnMappingInfo[]>> {
    return post<RemoteResponse<ColumnMappingInfo[]>>('/clickhouse/columnItem/mappingAll', params);
  },
  /** 接口：批量新增列映射信息 */
  insertColumnItem(params?: ClickhouseColumnItemRequest): Promise<RemoteResponse<ClickhouseColumnItem[]>> {
    return post<RemoteResponse<ClickhouseColumnItem[]>>('/clickhouse/columnItem/insert', params);
  },
  /** 接口：批量更新列映射信息 */
  updateColumnItem(params?: ClickhouseColumnItemUpdateRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/clickhouse/columnItem/update', params);
  },
  /** 接口：删除列映射信息 */
  deleteColumnItem(params?: IdsParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/clickhouse/columnItem/delete', params);
  },
};

export default columnItemService;
