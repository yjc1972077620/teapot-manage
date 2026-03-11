import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { EsAliasParam } from '../../../types/es/index/indexType';

const indexService = {
  /** 接口：切换别名 */
  changeAlias(params?: EsAliasParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/es/index/changeAlias', params);
  },
};

export default indexService;
