import { post } from '../../client';
import type { SyncTypeDictRequest, SyncTypeDictResponse } from '../../../types/server/ping/pingType';

const pingService = {
  /** 接口：syncTypeDict */
  syncTypeDict(params?: SyncTypeDictRequest): Promise<SyncTypeDictResponse> {
    return post<SyncTypeDictResponse>('/ping', params);
  },
};

export default pingService;
