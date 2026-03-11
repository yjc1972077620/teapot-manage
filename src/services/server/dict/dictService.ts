import { post } from '../../client';
import type { RemoteResponse } from '../../../types/response';
import type { EnumItemVOjava_lang_Stringjava_lang_Integer, EnumItemVOjava_lang_Stringjava_lang_Long, EnumItemVOjava_lang_Stringjava_lang_String } from '../../../types/server/dict/dictType';

const dictService = {
  /** 接口：团队类型枚举 */
  teamDict(params?: void): Promise<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_String[]>> {
    return post<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_String[]>>('/dict/team', params);
  },
  /** 接口：数据源字典 */
  dsInfoDict(params?: void): Promise<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Long[]>> {
    return post<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Long[]>>('/dict/dsInfo', params);
  },
  /** 接口：同步类型枚举 */
  syncTypeDict(params?: void): Promise<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Integer[]>> {
    return post<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Integer[]>>('/dict/syncType', params);
  },
  /** 接口：实例状态枚举 */
  instanceStatusDict(params?: void): Promise<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Integer[]>> {
    return post<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Integer[]>>('/dict/instanceStatus', params);
  },
  /** 接口：ES-表映射类型 */
  esMappingTypeDict(params?: void): Promise<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Integer[]>> {
    return post<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Integer[]>>('/dict/esMappingType', params);
  },
  /** 接口：字段JAVA数据类型 */
  dataTypeDict(params?: void): Promise<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Integer[]>> {
    return post<RemoteResponse<EnumItemVOjava_lang_Stringjava_lang_Integer[]>>('/dict/dataType', params);
  },
};

export default dictService;
