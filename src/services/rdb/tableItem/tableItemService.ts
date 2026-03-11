import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { IdsParam, RdbTableItem, RdbTableItemRequest, RdbTableItemUpdateRequest } from '../../../types/rdb/tableItem/tableItemType';

const tableItemService = {
  /** 接口：批量新增rdb表结构信息 */
  insertTableItem(params?: RdbTableItemRequest): Promise<RemoteResponse<RdbTableItem[]>> {
    return post<RemoteResponse<RdbTableItem[]>>('/rdb/tableItem/insert', params);
  },
  /** 接口：批量更新rdb表结构信息 */
  updateTableItem(params?: RdbTableItemUpdateRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/rdb/tableItem/update', params);
  },
  /** 接口：批量删除表结构信息 */
  deleteTableItem(params?: IdsParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/rdb/tableItem/delete', params);
  },
};

export default tableItemService;
