import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { CanalInstanceCreateVO, CanalInstanceStatisticRequest, CreateCanalInstanceParam } from '../../../types/server/instance/instanceType';

const instanceService = {
  /** 接口：根据同步实例创建canal实例 */
  createCanalInstance(params?: CreateCanalInstanceParam): Promise<RemoteResponse<CanalInstanceCreateVO[]>> {
    return post<RemoteResponse<CanalInstanceCreateVO[]>>('/instance/support/createCanalInstance', params);
  },
  /** 接口：查询实例统计信息 */
  canalInstanceStatistic(params?: CanalInstanceStatisticRequest): Promise<RemoteResponse<string>> {
    return post<RemoteResponse<string>>('/instance/support/canalInstanceStatistic', params);
  },
  /** 接口：实例单位订阅详细信息excel */
  orgSubscribeExcel(params?: void): Promise<RemoteResponse<string>> {
    return post<RemoteResponse<string>>('/instance/support/localDeploy/orgSubscribeExcel', params);
  },
};

export default instanceService;
