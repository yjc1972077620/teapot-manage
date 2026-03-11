import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { DorisTableItem, DorisTableItemRequest, DorisTableItemUpdateRequest, IdsParam } from '../../../types/doris/tableItem/tableItemType';

const tableItemService = {
  /** 接口：批量新增表结构信息 */
  insertTableItem(params?: DorisTableItemRequest): Promise<RemoteResponse<DorisTableItem[]>> {
    return post<RemoteResponse<DorisTableItem[]>>('/doris/tableItem/insert', params);
  },
  /** 接口：更新表结构信息 */
  updateTableItem(params?: DorisTableItemUpdateRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/doris/tableItem/update', params);
  },
  /** 接口：批量删除表结构信息 */
  deleteTableItem(params?: IdsParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/doris/tableItem/delete', params);
  },
};

export default tableItemService;
