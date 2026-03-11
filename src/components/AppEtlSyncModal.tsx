import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import localDeployService from '../services/rdb/localDeploy/localDeployService';
import type { LocalDeployOrgConfigRequest, LocalDeployOrgConfigVO } from '../types/rdb/localDeploy/localDeployType';
import type { EtlSyncParam } from '../types/server/etl/etlType';

const AliasesActionType = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  REMOVE_INDEX: 'REMOVE_INDEX'
} as const;

type AliasActionType = typeof AliasesActionType[keyof typeof AliasesActionType];

type AliasAction = {
  index: string;
  aliasList: string[];
  type: AliasActionType;
};

type EsAliasParam = {
  actionList: AliasAction[];
};

type SyncParams = {
  needEtlCondition: boolean;
  needSwitchAlias: boolean;
  conditionsType: number;
  conditionsContent: string;
  esAliasParam: EsAliasParam;
};

type BaseParams = {
  instanceId?: number | string;
  orgId?: number;
  instanceName?: string;
  [key: string]: unknown;
};

type EtlSyncModalProps = {
  visible: boolean;
  onCancel?: () => void;
  onConfirm?: (params: EtlSyncParam) => void;
  baseParams?: BaseParams;
  syncType?: number;
};

const createAliasAction = (indexList: string[], aliasList: string[], type: AliasActionType): AliasAction => ({
  index: indexList[0],
  aliasList: aliasList || [],
  type: type || AliasesActionType.ADD
});

const initSyncModalParams = (): SyncParams => ({
  needEtlCondition: false,
  needSwitchAlias: false,
  conditionsType: 1,
  conditionsContent: '',
  esAliasParam: {
    actionList: []
  }
});

const AppEtlSyncModal = ({ visible, onCancel, onConfirm, baseParams, syncType = 2 }: EtlSyncModalProps) => {
  const [syncParams, setSyncParams] = useState<SyncParams>(initSyncModalParams());
  const [aliasAction, setAliasAction] = useState<{
    indexList: string;
    aliasList: string;
    type: AliasActionType;
  }>({
    indexList: '',
    aliasList: '',
    type: AliasesActionType.ADD
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoadingOrgSubscribeList, setIsLoadingOrgSubscribeList] = useState(false);
  const [orgSubscribeList, setOrgSubscribeList] = useState<LocalDeployOrgConfigVO[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) {
      setSyncParams(initSyncModalParams());
      setAliasAction({
        indexList: '',
        aliasList: '',
        type: AliasesActionType.ADD
      });
      setErrors([]);
      setSelectedOrgId(null);
    }
  }, [visible]);

  useEffect(() => {
    if (syncType === 1 && baseParams?.instanceId) {
      fetchOrgSubscribeList(baseParams.instanceId);
    }
  }, [syncType, baseParams?.instanceId]);

  const fetchOrgSubscribeList = async (instanceId: number | string) => {
    setIsLoadingOrgSubscribeList(true);
    try {
      const numericInstanceId = typeof instanceId === 'string' ? Number(instanceId) : instanceId;
      const params: LocalDeployOrgConfigRequest = { instanceIdList: numericInstanceId != null ? [numericInstanceId] : undefined };
      const response = await localDeployService.orgSubscribeList(params);
      if (response.code === 200) {
        setOrgSubscribeList(response.data || []);
      } else {
        setErrors([response.msg || '获取订阅单位列表失败']);
      }
    } catch (error) {
      setErrors(['获取订阅单位列表失败']);
    } finally {
      setIsLoadingOrgSubscribeList(false);
    }
  };

  const handleAddAliasAction = () => {
    if (!aliasAction.indexList || !aliasAction.aliasList) {
      setErrors(['请输入索引列表和别名列表']);
      return;
    }
    const indexList = aliasAction.indexList.split(',').map(item => item.trim());
    const aliasList = aliasAction.aliasList.split(',').map(item => item.trim());
    const action = createAliasAction(indexList, aliasList, aliasAction.type);

    setSyncParams(prev => ({
      ...prev,
      esAliasParam: {
        actionList: [...prev.esAliasParam.actionList, action]
      }
    }));

    setAliasAction({
      indexList: '',
      aliasList: '',
      type: AliasesActionType.ADD
    });
  };

  const handleRemoveAliasAction = (index: number) => {
    setSyncParams(prev => ({
      ...prev,
      esAliasParam: {
        actionList: prev.esAliasParam.actionList.filter((_, i) => i !== index)
      }
    }));
  };

  const handleConfirm = () => {
    const newErrors: string[] = [];

    if (syncType === 1 && !selectedOrgId) {
      newErrors.push('请选择订阅单位');
    }

    if (syncParams.needEtlCondition && !syncParams.conditionsContent) {
      newErrors.push('请输入过滤条件');
    }

    if (syncParams.needSwitchAlias && syncParams.esAliasParam.actionList.length === 0) {
      newErrors.push('请添加至少一个别名操作');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const params: EtlSyncParam = {
      ...baseParams,
      ...syncParams,
      orgId: syncType === 1 ? selectedOrgId ?? undefined : baseParams?.orgId,
      instanceId: baseParams?.instanceId ? (typeof baseParams.instanceId === 'string' ? Number(baseParams.instanceId) : baseParams.instanceId) : undefined
    };

    onConfirm?.(params);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={960}
      // 保持遮罩点击关闭的交互
      maskClosable
    >
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                全量同步配置{baseParams?.instanceName ? `(${baseParams.instanceName})` : ''}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onCancel}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-2 space-y-4">
              {syncType === 1 && (
                <div className="border border-gray-200 rounded-md">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <label className="block text-sm font-medium text-gray-700">
                      已订阅单位
                    </label>
                  </div>
                  {isLoadingOrgSubscribeList ? (
                    <div className="p-4 text-sm text-gray-500">加载中...</div>
                  ) : orgSubscribeList.length > 0 ? (
                    <div className="max-h-80 overflow-y-auto">
                      {orgSubscribeList.map(org => (
                        <div
                          key={org.orgId}
                          className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            selectedOrgId === org.orgId ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => setSelectedOrgId(org.orgId)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  id={`org-${org.orgId}`}
                                  name="selectedOrg"
                                  value={org.id}
                                  checked={selectedOrgId === org.orgId}
                                  onChange={() => setSelectedOrgId(org.orgId)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`org-${org.id}`} className="ml-2 block text-sm font-medium text-gray-900">
                                  单位ID: {org.orgId}
                                </label>
                              </div>
                              {org.pushTopic && (
                                <div className="ml-6 mt-1 text-sm text-gray-600">
                                  推送Topic: {org.pushTopic}
                                </div>
                              )}
                              {org.dataCondition && (
                                <div className="ml-6 mt-1 text-sm text-gray-600">
                                  数据条件: {org.dataCondition}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-red-500">
                      当前实例没有订阅任何单位
                    </div>
                  )}
                </div>
              )}

              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center">
                  <input
                    id="needEtlCondition"
                    name="needEtlCondition"
                    type="checkbox"
                    checked={syncParams.needEtlCondition}
                    onChange={(e) => setSyncParams({ ...syncParams, needEtlCondition: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="needEtlCondition" className="ml-2 block text-sm text-gray-900">
                    需要ETL条件过滤
                  </label>
                </div>

                {syncParams.needEtlCondition && (
                  <div className="mt-3 ml-6 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">条件类型</label>
                      <div className="mt-1 space-y-2">
                        <div className="flex items-center">
                          <input
                            id="conditionsType1"
                            name="conditionsType"
                            type="radio"
                            checked={syncParams.conditionsType === 1}
                            onChange={() => setSyncParams({ ...syncParams, conditionsType: 1 })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="conditionsType1" className="ml-2 block text-sm text-gray-700">
                            SQL过滤
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="conditionsType2"
                            name="conditionsType"
                            type="radio"
                            checked={syncParams.conditionsType === 2}
                            onChange={() => setSyncParams({ ...syncParams, conditionsType: 2 })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <label htmlFor="conditionsType2" className="ml-2 block text-sm text-gray-700">
                            ETL过滤
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="conditionsContent" className="block text-sm font-medium text-gray-700">
                        {syncParams.conditionsType === 1 ? 'SQL过滤条件' : 'ETL过滤条件'}
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="conditionsContent"
                          rows={3}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                          value={syncParams.conditionsContent}
                          onChange={(e) => setSyncParams({ ...syncParams, conditionsContent: e.target.value })}
                          placeholder={syncParams.conditionsType === 1 ? '请输入SQL过滤条件' : '请输入ETL过滤条件'}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {syncType === 2 && (
                <div>
                  <div className="flex items-center">
                    <input
                      id="needSwitchAlias"
                      name="needSwitchAlias"
                      type="checkbox"
                      checked={syncParams.needSwitchAlias}
                      onChange={(e) => setSyncParams({ ...syncParams, needSwitchAlias: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="needSwitchAlias" className="ml-2 block text-sm text-gray-900">
                      需要切换索引别名
                    </label>
                  </div>

                  {syncParams.needSwitchAlias && (
                    <div className="mt-3 ml-6 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">添加别名操作</h4>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label htmlFor="indexList" className="block text-sm font-medium text-gray-700">
                              索引列表（多个用逗号分隔）
                            </label>
                            <input
                              type="text"
                              id="indexList"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={aliasAction.indexList}
                              onChange={(e) => setAliasAction({ ...aliasAction, indexList: e.target.value })}
                              placeholder="请输入索引名称，多个用逗号分隔"
                            />
                          </div>

                          <div>
                            <label htmlFor="aliasList" className="block text-sm font-medium text-gray-700">
                              别名列表（多个用逗号分隔）
                            </label>
                            <input
                              type="text"
                              id="aliasList"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={aliasAction.aliasList}
                              onChange={(e) => setAliasAction({ ...aliasAction, aliasList: e.target.value })}
                              placeholder="请输入别名，多个用逗号分隔"
                            />
                          </div>

                          <div>
                            <label htmlFor="actionType" className="block text-sm font-medium text-gray-700">
                              操作类型
                            </label>
                            <select
                              id="actionType"
                              className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={aliasAction.type}
                              onChange={(e) => setAliasAction({ ...aliasAction, type: e.target.value as AliasActionType })}
                            >
                              <option value={AliasesActionType.ADD}>添加 (ADD)</option>
                              <option value={AliasesActionType.REMOVE}>移除 (REMOVE)</option>
                              <option value={AliasesActionType.REMOVE_INDEX}>移除索引 (REMOVE_INDEX)</option>
                            </select>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={handleAddAliasAction}
                            >
                              添加操作
                            </button>
                          </div>
                        </div>
                      </div>

                      {syncParams.esAliasParam.actionList.length > 0 && (
                        <div className="border border-gray-200 rounded-md">
                          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                            <h4 className="text-sm font-medium text-gray-900">已添加的别名操作</h4>
                          </div>
                          <div className="divide-y divide-gray-200">
                            {syncParams.esAliasParam.actionList.map((action, index) => (
                              <div key={index} className="px-4 py-3 flex justify-between items-center">
                                <div className="text-sm text-gray-900">
                                  <div>
                                    <span className="font-medium">索引:</span> {action.index}
                                  </div>
                                  <div>
                                    <span className="font-medium">别名:</span> {action.aliasList.join(', ')}
                                  </div>
                                  <div>
                                    <span className="font-medium">操作:</span> {action.type}
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleRemoveAliasAction(index)}
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleConfirm}
        >
          确认同步
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={onCancel}
        >
          取消
        </button>
      </div>
    </Modal>
  );
};

export default AppEtlSyncModal;
