import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faArrowLeft, faSave } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AppNotification, { type NotificationType } from '../../components/AppNotification';
import syncInstanceService from '../../services/crud/syncInstance/syncInstanceService';
import dictService from '../../services/server/dict/dictService';
import type { ClickhouseMappingParam, DorisMappingParam, DorisMappingUpdateParam, EsMappingParam, EsMappingUpdateParam, RdbMappingParam, SyncInstanceParam, SyncInstanceQuery, SyncInstanceUpdateParam, SyncInstanceVO } from '../../types/crud/syncInstance/syncInstanceType';
import type { EnumItemVOjava_lang_Stringjava_lang_Integer, EnumItemVOjava_lang_Stringjava_lang_Long, EnumItemVOjava_lang_Stringjava_lang_String } from '../../types/server/dict/dictType';
import loginAPI from '../../utils/auth';
import TableMappingComponent from './TableMappingComponent';
import AppConfigurableForm from '../../components/AppConfigurableForm';
import { FormConfiguration, FieldConfig, LayoutConfig, FieldType, DataType } from '../../components/AppConfigurableForm';

type DictOption = {
  key: string;
  value: number | string;
};

type DictData = {
  teamOptions: DictOption[];
  instanceStatusOptions: DictOption[];
  dsOptions: DictOption[];
  syncTypeOptions: DictOption[];
  dataTypeOptions: DictOption[];
  esMappingTypeOptions: DictOption[];
};

type InstanceBaseData = {
  instanceId?: number | string;
  instanceName?: string;
  syncType?: number | string;
  status?: number | string;
  team?: number | string;
  createUserGuid?: string;
  indexName?: string;
  esIndexId?: string;
  etlCondition?: string;
};

type MappingData = {
  syncType?: number;
  instanceId?: number;
  mappingJson?: Record<string, unknown>;
};

const SyncInstanceCreate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state as { syncType?: number | string; id?: number | string } | null;
  const queryParams = new URLSearchParams(location.search);
  const querySyncType = queryParams.get('syncType');
  const initialSyncType = routeState?.syncType != null ? Number(routeState.syncType) : (querySyncType ? Number(querySyncType) : null);
  // 从路由参数中获取实例ID
  const { id } = useParams();
  // 从路由状态获取实例ID，如果没有则从查询参数获取
  const editInstanceIdRaw = id || routeState?.id || queryParams.get('id');
  const editInstanceId = editInstanceIdRaw ? Number(editInstanceIdRaw) : null;

  // 状态定义
  const [formConfiguration, setFormConfiguration] = useState<FormConfiguration | null>(null);
  // 数据字典
  const [dictData, setDictData] = useState<DictData>({
    teamOptions: [],
    instanceStatusOptions: [],
    dsOptions: [],
    syncTypeOptions: [],
    dataTypeOptions: [],
    esMappingTypeOptions: []
  });
  const [loading, setLoading] = useState(false);
  const [dictLoading, setDictLoading] = useState(true);
  const [instanceId, setInstanceId] = useState<number | null>(null);
  const [mappingId, setMappingId] = useState<number | null>(null);
  const [showTableMapping, setShowTableMapping] = useState(false);
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: NotificationType;
  }>({
    visible: false,
    message: '',
    type: 'success'
  });
 
  // 实例基础信息
  const [instanceBaseData, setInstanceBaseData] = useState<InstanceBaseData | null>(null);
  // 映射数据
  const [mappingData, setMappingData] = useState<MappingData | null>(null);
  // 字典数据加载状态
  const [dictDataLoaded, setDictDataLoaded] = useState(false);

  // 获取同步类型标题
  const getTitleBySyncType = (syncType: number | string | null, syncTypeOptions: DictOption[]) => {
    if (!syncType || !syncTypeOptions) {
      return editInstanceId ? '编辑同步实例' : '创建同步实例';
    }
    // 同步类型标题配置
    const syncTypeTitles = {
      '1': editInstanceId ? '编辑RDB同步实例' : '创建RDB同步实例',
      '2': editInstanceId ? '编辑ES同步实例' : '创建ES同步实例',
      '3': editInstanceId ? '编辑ClickHouse同步实例' : '创建ClickHouse同步实例',
      '6': editInstanceId ? '编辑Doris同步实例' : '创建Doris同步实例'
    };

    if (syncTypeTitles[syncType]) {
      return syncTypeTitles[syncType];
    }

    const syncTypeObj = syncTypeOptions.find(option => option.value === syncType);
    return syncTypeObj ? `${editInstanceId ? '编辑' : '创建'}${syncTypeObj.key}同步实例` : `${editInstanceId ? '编辑' : '创建'}同步实例`;
  };

  // 创建基础字段配置
  const createBaseFields = (initialData: InstanceBaseData) => {
    const syncTypeKey = initialData.syncType !== undefined && initialData.syncType !== null ? String(initialData.syncType) : '';
    return [
      new FieldConfig({
        name: 'instanceId',
        label: '实例id',
        type: FieldType.NUMBER,
        defaultValue: initialData.instanceId || '',
        hidden: true,
        required: true
      }),
      new FieldConfig({
        name: 'instanceName',
        label: '实例名称',
        type: FieldType.TEXT,
        placeholder: '请输入实例名称',
        required: true
      }),
      new FieldConfig({
        name: 'syncType',
        label: '同步类型',
        type: FieldType.SELECT,
        dataType: DataType.NUMBER,
        defaultValue: syncTypeKey ? dictData.syncTypeOptions.find(option => String(option.value) === syncTypeKey)?.key : '',
        required: true,
        disabled: true,
        options: dictData.syncTypeOptions
      }),
      new FieldConfig({
        name: 'status',
        label: '状态',
        type: FieldType.SELECT,
        dataType: DataType.NUMBER,
        disabled: true,
        defaultValue: dictData.instanceStatusOptions.find(option => option.key === initialData.status)?.key || 0,
        options: dictData.instanceStatusOptions
      }),
      new FieldConfig({
        name: 'team',
        label: '所属团队',
        type: FieldType.SELECT,
        placeholder: '请选择团队',
        disabled: editInstanceId === null ? false : true,
        defaultValue: initialData.team || '',
        required: true,
        options: dictData.teamOptions
      }),
      new FieldConfig({
        name: 'createUserGuid',
        label: '创建人',
        type: FieldType.TEXT,
        disabled: true
      })
    ];
  };

  // 创建同步类型特定字段
  const createSyncTypeSpecificFields = (initialData: InstanceBaseData) => {
    const syncTypeValue = initialData.syncType ?? initialSyncType;
    const syncType = syncTypeValue !== undefined && syncTypeValue !== null && syncTypeValue !== '' ? Number(syncTypeValue) : null;
    const fields = [];
    if (syncType === 2) { // ES
      fields.push(
        new FieldConfig({
          name: 'indexName',
          label: '索引名',
          disabled: true,
          type: FieldType.TEXT,
          defaultValue: initialData.indexName,
          placeholder: '请输入索引名'
        }),
        new FieldConfig({
          name: 'esIndexId',
          label: 'ES主键字段名',
          type: FieldType.TEXT,
          disabled: true,
          defaultValue: initialData.esIndexId,
          placeholder: '请输入ES主键字段名'
        }),
        new FieldConfig({
          name: 'etlCondition',
          label: '全量同步额外条件',
          type: FieldType.TEXT,
          defaultValue: initialData.etlCondition,
          placeholder: '请输入全量同步额外条件'
        })
      );
    }

    return fields;
  };

  // 创建完整表单配置
  const createFormConfig = (dictData: DictData, initialData: InstanceBaseData = {}) => {
    // 合并所有字段
    const allFields = [];
    const baseFields = createBaseFields(initialData)
    allFields.push(...baseFields);
    const syncTypeSpecificFields = createSyncTypeSpecificFields(initialData);
    allFields.push(...syncTypeSpecificFields);

    // 创建表单配置
    return new FormConfiguration({
      fields: allFields,
      layout: new LayoutConfig({ fieldsPerRow: 4, layoutType: 'grid' }),
      otherConfig: {},
      initialData: initialData,
      submitConfig: {
        text: editInstanceId ? '保存修改' : '提交创建',
        show: true,
        onClick: handleSubmit
      },
      cancelConfig: {
        show: false
      },
      dictData: dictData,
      loading: false,
      disabled: false
    });
  };

  const getMappingMeta = (mappingJson?: Record<string, unknown>) => {
    if (!mappingJson || typeof mappingJson !== 'object') {
      return {};
    }
    return mappingJson as {
      id?: number;
      indexName?: string;
      esIndexId?: string;
      etlCondition?: string;
    };
  };

  const buildBaseData = (instanceDetail: SyncInstanceVO): InstanceBaseData => {
    const teamOption = dictData.teamOptions.find(option => option.key === instanceDetail.team);
    const baseData: InstanceBaseData = {
      instanceName: instanceDetail.instanceName || '',
      syncType: instanceDetail.syncType || '',
      status: instanceDetail.status || '',
      team: teamOption?.value ?? instanceDetail.team ?? '',
      createUserGuid: instanceDetail.createUserGuid || '',
      instanceId: instanceDetail.id || ''
    };

    if (instanceDetail.syncType === 2) {
      const mappingMeta = getMappingMeta(instanceDetail.mappingJson);
      baseData.indexName = mappingMeta.indexName || '';
      baseData.esIndexId = mappingMeta.esIndexId || '';
      baseData.etlCondition = mappingMeta.etlCondition || '';
    }

    return baseData;
  };

  // 获取实例详情数据（用于编辑）
  const fetchInstanceDetail = async (instanceId: number) => {
    try {
      setLoading(true);
      const query: SyncInstanceQuery = {
        id: instanceId
      };
      const response = await syncInstanceService.queryById(query);
      console.log('获取实例详情用于编辑展示:', response);
      if (response.code === 200 && response.data) {
        return response.data;
      } else {
        throw new Error(response.msg || '获取实例详情失败');
      }
    } catch (error) {
      console.error('获取实例详情失败:', error);
      setNotification({ visible: true, message: error instanceof Error ? error.message : '获取实例详情失败', type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  const initData = async () => {
    try {
      let syncInstanceBaseData: InstanceBaseData = {};
      if (editInstanceId) {
        // 编辑模式：获取实例详情
        const instanceDetail = await fetchInstanceDetail(editInstanceId);
        if (instanceDetail) {
          syncInstanceBaseData = buildBaseData(instanceDetail);
          // 设置实例基础信息
          setInstanceBaseData(syncInstanceBaseData);

          // 映射信息
          if (instanceDetail.mappingJson) {
            const mappingData = {
              syncType: instanceDetail.syncType != null ? Number(instanceDetail.syncType) : undefined,
              instanceId: instanceDetail.id != null ? Number(instanceDetail.id) : undefined,
              mappingJson: instanceDetail.mappingJson || {}
            }
            // 设置表映射信息
            setMappingData(mappingData);
          }

          setInstanceId(instanceDetail.id);
          setMappingId(getMappingMeta(instanceDetail.mappingJson).id || null);
          // 编辑模式下默认显示映射组件
          setShowTableMapping(true);
        }
      } else {
        const currentUser = loginAPI.getCurrentUser();
        // 创建模式：设置初始数据
        syncInstanceBaseData = {
          status: 0,
          syncType: initialSyncType || '',
          // team: curGroup || '',
          createUserGuid: currentUser ? (currentUser.user_name || currentUser.user_id.toString()) : ''
        };
        setInstanceBaseData(syncInstanceBaseData);
      }
    } catch (error) {
      console.error('初始化数据失败:', error);
      setNotification({ visible: true, message: '初始化数据失败', type: 'error' });
    } finally {
      setDictLoading(false);
    }
  };


  // 初始化数据
  const initDictData = async () => {
    try {
      setDictLoading(true);

      // 获取字典数据
      const [syncTypeResponse, instanceStatusResponse, teamResponse, dsInfoResponse, dataTypeResponse, esMappingTypeResponse] = await Promise.all([
        dictService.syncTypeDict(),
        dictService.instanceStatusDict(),
        dictService.teamDict(),
        dictService.dsInfoDict(),
        dictService.dataTypeDict(),
        dictService.esMappingTypeDict()
      ]);
      // 处理字典数据
      const syncTypeOptions = syncTypeResponse.data ? syncTypeResponse.data.map((item: EnumItemVOjava_lang_Stringjava_lang_Integer) => ({
        key: item.key || '',
        value: item.val ?? ''
      })) : [];

      const instanceStatusOptions = instanceStatusResponse.data ? instanceStatusResponse.data.map((item: EnumItemVOjava_lang_Stringjava_lang_Integer) => ({
        key: item.key || '',
        value: item.val ?? ''
      })) : [];

      const teamOptions = teamResponse.data ? teamResponse.data.map((item: EnumItemVOjava_lang_Stringjava_lang_String) => ({
        key: item.key || '',
        value: item.val ?? ''
      })) : [];

      const dsOptions = dsInfoResponse.data ? dsInfoResponse.data.map((item: EnumItemVOjava_lang_Stringjava_lang_Long) => ({
        key: item.key || '',
        value: item.val ?? ''
      })) : [];

      const dataTypeOptions = dataTypeResponse.data ? dataTypeResponse.data.map((item: EnumItemVOjava_lang_Stringjava_lang_Integer) => ({
        key: item.key || '',
        value: item.val ?? ''
      })) : [];

      const esMappingTypeOptions = esMappingTypeResponse.data ? esMappingTypeResponse.data.map((item: EnumItemVOjava_lang_Stringjava_lang_Integer) => ({
        key: item.key || '',
        value: item.val ?? ''
      })) : [];

      const newDictData = {
        teamOptions,
        instanceStatusOptions,
        dsOptions,
        syncTypeOptions,
        dataTypeOptions,
        esMappingTypeOptions
      };
      // 标记字典数据加载完成
      setDictData(newDictData);
      setDictDataLoaded(true);
    } catch (error) {
      console.error('初始化数据失败:', error);
      setNotification({ visible: true, message: '初始化数据失败', type: 'error' });
    } finally {
      setDictLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    // 初始化字典
    initDictData();
  }, [editInstanceId]);

  // 只有当字典数据加载完成且有实例数据时，才创建表单配置
  useEffect(() => {
    if (dictDataLoaded) {
      // 初始化实例详情表单数据
      initData();
      if (instanceBaseData) {
        const config = createFormConfig(dictData, instanceBaseData);
        setFormConfiguration(config);
        // 重置加载完成标记，避免重复创建
        setDictDataLoaded(false);
      }
    }
  }, [dictDataLoaded, dictData, instanceBaseData]);


  const getListPathBySyncType = (syncType?: number | null) => {
    if (syncType === 1) return '/local-deploy';
    if (syncType === 3) return '/clickhouse-sync';
    if (syncType === 6) return '/doris-sync';
    return '/es-sync';
  };

  const getCurrentSyncType = () => {
    const syncTypeValue = instanceBaseData?.syncType ?? formConfiguration?.initialData?.syncType ?? initialSyncType;
    if (syncTypeValue === undefined || syncTypeValue === null || syncTypeValue === '') {
      return null;
    }
    const numericSyncType = Number(syncTypeValue);
    return Number.isNaN(numericSyncType) ? null : numericSyncType;
  };

  // 处理返回列表
  const handleBack = () => {
    const syncType = getCurrentSyncType();
    navigate(getListPathBySyncType(syncType));
  };

  // 保存所有数据
  const handleSubmit = async (e: unknown, formData: Record<string, any>) => {
    try {
      setLoading(true);
      const formSyncType = Number(formData.syncType ?? initialSyncType);

      if (editInstanceId) {
        // 编辑模式：只获取变更的数据，构建SyncInstanceUpdateParam
        const updateData: SyncInstanceUpdateParam = {
          id: editInstanceId,
          instanceName: formData.instanceName
        };

        // 根据syncType添加相应的映射参数
        if (formSyncType === 2) {
          // ES类型，构建EsMappingUpdateParam
          const updateParam: EsMappingUpdateParam = {
            id: mappingId ?? undefined,
            etlCondition: formData.etlCondition || ''
          };
          updateData.esMappingUpdateParam = updateParam;
        } else if (formSyncType === 6) {
          // Doris类型，构建DorisMappingUpdateParam
          const updateParam: DorisMappingUpdateParam = {
            id: mappingId ?? undefined
          };
          updateData.dorisMappingUpdateParam = updateParam;
        }

        // 调用更新接口
        const updateResponse = await syncInstanceService.update(updateData);

        if (updateResponse.code === 200) {
          setNotification({ visible: true, message: '更新成功', type: 'success' });
          // 更新成功后刷新页面数据
          const updatedInstanceData = await fetchInstanceDetail(editInstanceId);
          if (updatedInstanceData) {
            const baseData = buildBaseData(updatedInstanceData);
            setInstanceBaseData(baseData);
            // 更新表单配置
            if (formConfiguration) {
              const config = createFormConfig(dictData, baseData);
              setFormConfiguration(config);
            }
          }
        } else {
          throw new Error(updateResponse.msg || '更新实例失败');
        }
      } else {
        // 创建模式：获取表单全部数据，构建SyncInstanceParam
        const createData: SyncInstanceParam = {
          instanceName: formData.instanceName,
          syncType: formSyncType,
          team: formData.team,
          createUserGuid: formData.createUserGuid
        };

        // 根据syncType添加相应的映射参数
        if (formSyncType === 2) {
          // ES类型，构建EsMappingParam
          const esMappingParam: EsMappingParam = {
            indexName: formData.indexName || '',
            esIndexId: formData.esIndexId || '',
            etlCondition: formData.etlCondition || ''
          };
          createData.esMappingParam = esMappingParam;
        } else if (formSyncType === 1) {
          // RDB类型，构建RdbMappingParam
          const rdbMappingParam: RdbMappingParam = {
            etlCondition: formData.etlCondition || ''
          };
          createData.rdbMappingParam = rdbMappingParam;
        } else if (formSyncType === 3 ) {
          // Clickhouse类型，构建ClickhouseMappingParam
          const clickhouseMappingParam: ClickhouseMappingParam = {};
          createData.clickhouseMappingParam = clickhouseMappingParam;
        } else if (formSyncType === 6) {
          // Doris类型，构建DorisMappingParam
          const dorisMappingParam: DorisMappingParam = {};
          createData.dorisMappingParam = dorisMappingParam;
        }

        // 调用创建接口
        const createResponse = await syncInstanceService.insert(createData);

        if (createResponse.code === 200 && createResponse.data) {
          // 创建成功，使用返回的数据进行回显
          const createdData = createResponse.data;
          const baseData = buildBaseData(createdData);
          const mappingMeta = getMappingMeta(createdData.mappingJson);

          setNotification({ visible: true, message: '创建成功', type: 'success' });

          // 设置实例ID和映射ID
          setInstanceId(createdData.id);
          setMappingId(mappingMeta.id || null);

          // 更新全局实例数据
          setInstanceBaseData(baseData);

          // 更新表单配置，使用创建后的数据进行回显
          if (formConfiguration) {
            const config = createFormConfig(dictData, baseData);
            setFormConfiguration(config);
          }

          // 显示映射组件
          setShowTableMapping(true);
        } else {
          throw new Error(createResponse.msg || '创建实例失败');
        }
      }
    } catch (error) {
      console.error(editInstanceId ? '更新实例失败:' : '创建实例失败:', error);
      setNotification({ visible: true, message: error instanceof Error ? error.message : (editInstanceId ? '更新失败，请重试' : '创建失败，请重试'), type: 'error' });
    } finally {
      // 恢复加载状态
      if (formConfiguration) {
        formConfiguration.setLoading(false);
        setFormConfiguration(new FormConfiguration(formConfiguration)); // 触发重新渲染
      }
      setLoading(false);
    }
  };


  // 处理跳转到详情
  const handleGoToDetail = () => {
    if (instanceId) {
      const currentSyncType = getCurrentSyncType();
      const query = currentSyncType ? "?syncType=" + currentSyncType : "";
      navigate("/instance/detail/" + instanceId + query, {
        state: currentSyncType ? { syncType: currentSyncType } : undefined
      });
    } else {
      setNotification({
        visible: true,
        message: '获取实例ID失败，请重试',
        type: 'error'
      });
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* 顶部导航栏 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          返回列表
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {getTitleBySyncType(formConfiguration?.initialData?.syncType, dictData.syncTypeOptions)}
        </h1>
        <div></div> {/* 占位，保持标题居中 */}
      </div>

      {/* 主要内容区域 */}
      <div className="bg-white rounded-lg shadow w-full overflow-hidden">
        <div className="p-6">
          {/* 基础信息部分 */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">实例基础信息</h2>

            {dictLoading ? (
              <div className="text-center py-8 text-gray-500">
                <FontAwesomeIcon icon={faSpinner} className="mx-auto h-8 w-8 text-gray-400 animate-spin" />
                <p className="mt-2">加载中...</p>
              </div>
            ) : formConfiguration ? (
              <AppConfigurableForm
                formConfiguration={formConfiguration}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>表单配置加载失败</p>
              </div>
            )}
          </div>

          {/* 映射关系模块 - 使用独立的TableMappingComponent组件 */}
          {showTableMapping && (
            <TableMappingComponent
              mappingData={mappingData}
              dictData={dictData}
              setNotification={setNotification}
              refreshInstanceData={async () => {
                if (instanceId) {
                  await fetchInstanceDetail(instanceId);
                }
              }}
            />
          )}

          {/* 操作按钮 - 当显示映射组件时可能需要添加其他按钮 */}
          {showTableMapping && (
            <div className="flex justify-center pt-6">
              <button
                type="button"
                onClick={handleGoToDetail}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                完成配置，查看详情
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 通知组件 */}
      <AppNotification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ ...notification, visible: false })}
      />
    </div>
  );
};

export default SyncInstanceCreate;
