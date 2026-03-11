import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { EtlInfoVO, EtlProgressSnapshot, EtlSnapShotQuery, EtlSyncParam } from '../../../types/server/etl/etlType';

const etlService = {
  /** 接口：查询实例还在同步中的快照信息 */
  latestSnapshot(params?: EtlSnapShotQuery): Promise<RemoteResponse<EtlProgressSnapshot[]>> {
    return post<RemoteResponse<EtlProgressSnapshot[]>>('/etl/latestSnapshot', params);
  },
  /** 接口：开启全量同步任务 */
  startEtl(params?: EtlSyncParam): Promise<RemoteResponse<EtlInfoVO>> {
    return post<RemoteResponse<EtlInfoVO>>('/etl/startEtl', params);
  },
  /** 接口：ETL断点续传 */
  breakpointEtl(params?: EtlSyncParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/etl/breakpointEtl', params);
  },
  /** 接口：批量获取全量同步快照 */
  listBySnapshotIds(params?: EtlSnapShotQuery): Promise<RemoteResponse<EtlProgressSnapshot[]>> {
    return post<RemoteResponse<EtlProgressSnapshot[]>>('/etl/listBySnapshotIds', params);
  },
};

export default etlService;
