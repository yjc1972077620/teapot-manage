import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { LocalDeployOrgConfigRequest, LocalDeployOrgConfigVO } from '../../../types/rdb/localDeploy/localDeployType';

const localDeployService = {
  /** 接口：本地部署单位订阅同步实例 */
  orgSubscribe(params?: LocalDeployOrgConfigRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/rdb/localDeploy/orgSubscribe', params);
  },
  /** 接口：实例单位订阅配置列表 */
  orgSubscribeList(params?: LocalDeployOrgConfigRequest): Promise<RemoteResponse<LocalDeployOrgConfigVO[]>> {
    return post<RemoteResponse<LocalDeployOrgConfigVO[]>>('/rdb/localDeploy/orgSubscribeList', params);
  },
  /** 接口：修改本地部署单位订阅同步实例 */
  modifyOrgSubscribe(params?: LocalDeployOrgConfigRequest): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/rdb/localDeploy/modifyOrgSubscribe', params);
  },
};

export default localDeployService;
