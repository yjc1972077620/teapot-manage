import { post } from '../../client';
import type { PageableResponse, RemoteResponse } from '../../../types/response';
import type { DeleteParam } from '../../../types/common/params';
import type { EtlSyncLogParam, EtlSyncLogPageQuery, EtlSyncLogQuery, EtlSyncLogVO } from '../../../types/crud/etlSyncLog/etlSyncLogType';

const etlSyncLogService = {
  /** 接口：更新EtlSyncLog */
  update(params?: EtlSyncLogParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/etlSyncLog/update', params);
  },
  /** 接口：新增EtlSyncLog */
  insert(params?: EtlSyncLogParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/etlSyncLog/insert', params);
  },
  /** 接口：删除EtlSyncLog */
  delete(params?: DeleteParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/etlSyncLog/delete', params);
  },
  /** 接口：id 查询EtlSyncLog */
  queryById(params?: EtlSyncLogQuery): Promise<RemoteResponse<EtlSyncLogVO>> {
    return post<RemoteResponse<EtlSyncLogVO>>('/etlSyncLog/getEtlSyncLog', params);
  },
  /** 接口：EtlSyncLog 分页查询 */
  queryByPage(params?: EtlSyncLogPageQuery): Promise<PageableResponse<EtlSyncLogVO>> {
    return post<PageableResponse<EtlSyncLogVO>>('/etlSyncLog/page', params);
  },
};

export default etlSyncLogService;
