import { post } from '../../client';
import type { PageableResponse, RemoteResponse } from '../../../types/response';
import type { DeleteParam } from '../../../types/common/params';
import type { DsInfoPageQuery, DsInfoPageVO, DsInfoParam, DsInfoQuery, DsInfoVO } from '../../../types/crud/dsInfo/dsInfoType';

const dsInfoService = {
  /** 接口：更新DsInfo */
  update(params?: DsInfoParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/dsInfo/update', params);
  },
  /** 接口：新增DsInfo */
  insert(params?: DsInfoParam): Promise<RemoteResponse<DsInfoVO>> {
    return post<RemoteResponse<DsInfoVO>>('/dsInfo/insert', params);
  },
  /** 接口：删除DsInfo */
  delete(params?: DeleteParam): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/dsInfo/delete', params);
  },
  /** 接口：id 查询DsInfo */
  detail(params?: DsInfoQuery): Promise<RemoteResponse<DsInfoVO>> {
    return post<RemoteResponse<DsInfoVO>>('/dsInfo/getDsInfo', params);
  },
  /** 接口：查询数据源信息 */
  queryById(params?: DsInfoQuery): Promise<RemoteResponse<DsInfoVO>> {
    return post<RemoteResponse<DsInfoVO>>('/dsInfo/queryById', params);
  },
  /** 接口：数据源连通性校验 */
  connectCheck(params?: DsInfoQuery): Promise<RemoteResponse<boolean>> {
    return post<RemoteResponse<boolean>>('/dsInfo/connectCheck', params);
  },
  /** 接口：查询数据源下所有表 */
  queryTablesByDsId(params?: DsInfoQuery): Promise<RemoteResponse<string[]>> {
    return post<RemoteResponse<string[]>>('/dsInfo/tableNames', params);
  },
  /** 接口：DsInfo 分页查询 */
  queryByPage(params?: DsInfoPageQuery): Promise<PageableResponse<DsInfoPageVO>> {
    return post<PageableResponse<DsInfoPageVO>>('/dsInfo/page', params);
  },
};

export default dsInfoService;
