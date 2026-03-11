import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { SyncInstanceFullCopyParam, SyncInstanceVO } from '../../../types/server/nonToken/nonTokenType';

const nonTokenService = {
  /** 接口：执行实例复制的整个流程（用于配合/instance/copy接口，仅用于该接口进行http请求） */
  doInstanceCopy(params?: SyncInstanceFullCopyParam): Promise<RemoteResponse<SyncInstanceVO>> {
    return post<RemoteResponse<SyncInstanceVO>>('/nonToken/doInstanceCopy', params);
  },
};

export default nonTokenService;
