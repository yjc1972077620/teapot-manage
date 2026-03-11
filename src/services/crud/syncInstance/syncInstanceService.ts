import { post } from '../../client';
import type { PageableResponse, RemoteResponse } from '../../../types/response';
import type { DeleteParam } from '../../../types/common/params';
import type { SyncInstanceCopyParam, SyncInstanceLogConfigParam, SyncInstancePageQuery, SyncInstancePageVO, SyncInstanceParam, SyncInstancePublishVO, SyncInstanceQuery, SyncInstanceStatusParam, SyncInstanceUpdateParam, SyncInstanceVO } from '../../../types/crud/syncInstance/syncInstanceType';

const syncInstanceService = {
  /** 接口：更新SyncInstance */
  update(params?: SyncInstanceUpdateParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/syncInstance/update', params);
  },
  /** 接口：新增SyncInstance */
  insert(params?: SyncInstanceParam): Promise<RemoteResponse<SyncInstanceVO>> {
    return post<RemoteResponse<SyncInstanceVO>>('/syncInstance/insert', params);
  },
  /** 接口：删除SyncInstance */
  delete(params?: DeleteParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/syncInstance/delete', params);
  },
  /** 接口：复制SyncInstance到指定环境 */
  copy(params?: SyncInstanceCopyParam): Promise<RemoteResponse<SyncInstanceVO>> {
    return post<RemoteResponse<SyncInstanceVO>>('/syncInstance/copy', params);
  },
  /** 接口：SyncInstance发布 */
  publish(params?: SyncInstanceQuery): Promise<RemoteResponse<SyncInstancePublishVO>> {
    return post<RemoteResponse<SyncInstancePublishVO>>('/syncInstance/publish', params);
  },
  /** 接口：id 查询SyncInstance */
  queryById(params?: SyncInstanceQuery): Promise<RemoteResponse<SyncInstanceVO>> {
    return post<RemoteResponse<SyncInstanceVO>>('/syncInstance/getSyncInstance', params);
  },
  /** 接口：SyncInstance日志启停 */
  logConfig(params?: SyncInstanceLogConfigParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/syncInstance/log/config', params);
  },
  /** 接口：SyncInstance启停 */
  changeStatus(params?: SyncInstanceStatusParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/syncInstance/status', params);
  },
  /** 接口：SyncInstance 分页查询 */
  queryByPage(params?: SyncInstancePageQuery): Promise<PageableResponse<SyncInstancePageVO>> {
    return post<PageableResponse<SyncInstancePageVO>>('/syncInstance/page', params);
  },
};

export default syncInstanceService;
