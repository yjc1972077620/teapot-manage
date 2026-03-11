import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { ClickhouseTableItem, ClickhouseTableItemRequest, ClickhouseTableItemUpdateRequest, IdsParam } from '../../../types/clickhouse/tableItem/tableItemType';

const tableItemService = {
  /** 接口：批量新增表结构信息 */
  insertTableItem(params?: ClickhouseTableItemRequest): Promise<RemoteResponse<ClickhouseTableItem[]>> {
    return post<RemoteResponse<ClickhouseTableItem[]>>('/clickhouse/tableItem/insert', params);
  },
  /** 接口：更新表结构信息 */
  updateTableItem(params?: ClickhouseTableItemUpdateRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/clickhouse/tableItem/update', params);
  },
  /** 接口：批量删除表结构信息 */
  deleteTableItem(params?: IdsParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/clickhouse/tableItem/delete', params);
  },
};

export default tableItemService;
