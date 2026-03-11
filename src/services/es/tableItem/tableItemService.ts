import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { EsTableItem, EsTableItemRequest, EsTableItemUpdateRequest, IdsParam } from '../../../types/es/tableItem/tableItemType';

const tableItemService = {
  /** 接口：更新表结构信息 */
  updateTableItem(params?: EsTableItemUpdateRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/es/tableItem/update', params);
  },
  /** 接口：批量新增表结构信息 */
  insertTableItem(params?: EsTableItemRequest): Promise<RemoteResponse<EsTableItem[]>> {
    return post<RemoteResponse<EsTableItem[]>>('/es/tableItem/insert', params);
  },
  /** 接口：批量删除表结构信息 */
  deleteTableItem(params?: IdsParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/es/tableItem/delete', params);
  },
};

export default tableItemService;
