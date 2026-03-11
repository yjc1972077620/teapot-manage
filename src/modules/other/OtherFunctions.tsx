import { useMemo, useState } from 'react';
import { Button, Card, Col, Descriptions, Divider, Form, Row, Select, Space, Switch, Table, Typography } from 'antd';
import {
  ProFormDependency,
  ProFormDigit,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm
} from '@ant-design/pro-components';
import type { ColumnsType } from 'antd/es/table';
import instanceService from '../../services/server/instance/instanceService';
import syncInstanceService from '../../services/crud/syncInstance/syncInstanceService';
import AppNotification, { type NotificationType } from '../../components/AppNotification';
import type { CanalInstanceCreateVO } from '../../types/server/instance/instanceType';
import type { SyncInstanceCopyParam, SyncInstancePageVO, SyncInstanceVO } from '../../types/crud/syncInstance/syncInstanceType';

const { Title, Paragraph, Text } = Typography;

// 实例复制表单类型
type SyncInstanceCopyForm = {
  env?: string;
  id?: number;
  instanceName?: string;
  dataSourceMode?: 'existing' | 'new';
  tableMode?: 'same' | 'different';
  sameDsId?: number;
  tableNameDsIdMap?: { tableName?: string; dsId?: number }[];
  tableNameDsInfoParamList?: TableNameDsInfoItem[];
};

// Canal实例创建表单类型
type CreateCanalInstanceForm = {
  bindTopic?: boolean;
  instanceId?: number;
  localDeploy?: boolean;
  singleTable?: boolean;
};

// Canal统计表单类型
type CanalStatisticForm = {
  env?: string;
};

type TableNameDsIdMapItem = {
  tableName?: string;
  dsId?: number;
};

type TableNameDsInfoItem = {
  tableNameList?: string[];
  dsInfoParam?: {
    id?: number;
    name?: string;
    url?: string;
    userName?: string;
    password?: string;
    type?: number;
    properties?: string;
  };
};

type InstanceOption = {
  label: string;
  value: number;
  instanceName?: string;
};

const ENV_OPTIONS = [
  { label: 'test', value: 'test' },
  { label: 'prod', value: 'prod' }
];

const OtherFunctions = () => {
  // 通知组件状态
  const [notification, setNotification] = useState<{ visible: boolean; message: string; type: NotificationType }>({
    visible: false,
    message: '',
    type: 'info'
  });

  // 实例复制相关状态
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyResult, setCopyResult] = useState<SyncInstanceVO | null>(null);
  const [copyForm] = Form.useForm<SyncInstanceCopyForm>();
  const [instanceOptions, setInstanceOptions] = useState<InstanceOption[]>([]);
  const [instanceSelectLoading, setInstanceSelectLoading] = useState(false);

  // Canal实例创建相关状态
  const [createLoading, setCreateLoading] = useState(false);
  const [createResult, setCreateResult] = useState<CanalInstanceCreateVO[]>([]);
  const [createForm] = Form.useForm<CreateCanalInstanceForm>();

  // Canal统计相关状态
  const [statLoading, setStatLoading] = useState(false);
  const [statResult, setStatResult] = useState<string>('');
  const [statFileName, setStatFileName] = useState<string>('');
  const [statForm] = Form.useForm<CanalStatisticForm>();

  // 订阅导出相关状态
  const [exportLoading, setExportLoading] = useState(false);
  const [exportResult, setExportResult] = useState<string>('');
  const [exportFileName, setExportFileName] = useState<string>('');

  // 统一通知展示
  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ visible: true, message, type });
  };

  // 拉取实例列表（支持按名称模糊搜索）
  const fetchInstanceOptions = async (instanceName?: string) => {
    try {
      setInstanceSelectLoading(true);
      const response = await syncInstanceService.queryByPage({
        instanceName: instanceName || undefined,
        pageNo: 1,
        pageSize: 200
      });
      if (response.code !== 200) {
        throw new Error(response.msg || '获取实例列表失败');
      }
      const optionMap = new Map<number, InstanceOption>();
      (response.data || []).forEach((item: SyncInstancePageVO) => {
        if (!item.id) {
          return;
        }
        optionMap.set(item.id, {
          label: `${item.instanceName || '未命名实例'} (#${item.id ?? '-'})`,
          value: item.id,
          instanceName: item.instanceName
        });
      });
      setInstanceOptions(Array.from(optionMap.values()));
    } catch (error) {
      const message = error instanceof Error ? error.message : '获取实例列表失败';
      showNotification(message, 'error');
    } finally {
      setInstanceSelectLoading(false);
    }
  };

  // 下载链接中文文件名解析
  const decodeFileName = (fileName?: string) => {
    if (!fileName) {
      return '';
    }
    try {
      return decodeURIComponent(fileName);
    } catch (error) {
      return fileName;
    }
  };

  // 从链接中提取文件名
  const getFileNameFromUrl = (url?: string) => {
    if (!url) {
      return '';
    }
    try {
      const parsed = new URL(url, window.location.origin);
      const nameFromParam =
        parsed.searchParams.get('fileName') ||
        parsed.searchParams.get('filename') ||
        parsed.searchParams.get('name') ||
        '';
      if (nameFromParam) {
        return decodeFileName(nameFromParam);
      }
      const pathname = parsed.pathname || '';
      const fileName = pathname.split('/').filter(Boolean).pop() || '';
      return decodeFileName(fileName);
    } catch (error) {
      const fallback = url.split('?')[0].split('/').pop() || '';
      return decodeFileName(fallback);
    }
  };

  // 触发浏览器下载
  const triggerDownload = (url?: string, fileName?: string) => {
    if (!url) {
      showNotification('暂无可下载的链接', 'warning');
      return;
    }
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName || '';
    anchor.rel = 'noopener';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  // JSON字段解析助手
  const parseJsonField = <T,>(value?: string, label?: string): T | undefined => {
    if (!value) {
      return undefined;
    }
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      throw new Error(`${label || 'JSON字段'}格式不正确，请输入合法JSON`);
    }
  };

  // JSON字段预览解析（不抛错）
  const safePreviewJson = <T,>(value?: string): T | string | undefined => {
    if (!value) {
      return undefined;
    }
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return value;
    }
  };

  // 组装 tableNameDsIdMap
  const buildTableNameDsIdMap = (items?: TableNameDsIdMapItem[]) => {
    if (!items || items.length === 0) {
      return undefined;
    }
    return items.reduce<Record<string, number>>((acc, item) => {
      if (item.tableName && item.dsId !== undefined && item.dsId !== null) {
        acc[item.tableName] = item.dsId;
      }
      return acc;
    }, {});
  };

  // 组装 tableNameDsInfoParamList
  const buildTableNameDsInfoParamList = (items?: TableNameDsInfoItem[]) => {
    if (!items || items.length === 0) {
      return undefined;
    }
    return items.map((item) => ({
      tableNameList: item.tableNameList,
      dsInfoParam: item.dsInfoParam
        ? {
            id: item.dsInfoParam.id,
            name: item.dsInfoParam.name,
            url: item.dsInfoParam.url,
            userName: item.dsInfoParam.userName,
            password: item.dsInfoParam.password,
            type: item.dsInfoParam.type,
            properties: parseJsonField<Record<string, unknown>>(
              item.dsInfoParam.properties,
              '数据源扩展配置'
            )
          }
        : undefined
    }));
  };

  // 组装实例复制请求预览
  const copyFormValues = Form.useWatch([], copyForm);
  const copyPreview = useMemo(() => ({
    env: copyFormValues?.env,
    id: copyFormValues?.id,
    instanceName: copyFormValues?.instanceName,
    tableNameDsInfoParamList: (copyFormValues?.tableNameDsInfoParamList || []).map((item) => ({
      tableNameList: item?.tableNameList,
      dsInfoParam: item?.dsInfoParam
        ? {
            ...item.dsInfoParam,
            properties: safePreviewJson<Record<string, unknown>>(item.dsInfoParam.properties)
          }
        : undefined
    })),
    tableNameDsIdMap: buildTableNameDsIdMap(copyFormValues?.tableNameDsIdMap),
    sameDsId: copyFormValues?.sameDsId
  }), [copyFormValues]);

  // 组装创建Canal实例请求预览
  const createFormValues = Form.useWatch([], createForm);
  const createPreview = useMemo(() => ({
    instanceId: createFormValues?.instanceId,
    bindTopic: createFormValues?.bindTopic,
    localDeploy: createFormValues?.localDeploy,
    singleTable: createFormValues?.singleTable
  }), [createFormValues]);

  // 参数预览格式化
  const formatPreviewJson = (entries: { key: string; value: unknown; hint: string }[]) => {
    const lines: string[] = ['{'];
    entries.forEach((entry, index) => {
      const isLast = index === entries.length - 1;
      const jsonValue = JSON.stringify(entry.value ?? null, null, 2);
      const valueLines = (jsonValue || 'null').split('\n');
      if (valueLines.length === 1) {
        lines.push(`  "${entry.key}": ${valueLines[0]}${isLast ? '' : ','} // ${entry.hint}`);
      } else {
        lines.push(`  "${entry.key}": ${valueLines[0]} // ${entry.hint}`);
        valueLines.slice(1).forEach((line, lineIndex) => {
          const isLastLine = lineIndex === valueLines.length - 2;
          lines.push(`  ${line}${isLastLine && !isLast ? ',' : ''}`);
        });
      }
    });
    lines.push('}');
    return lines.join('\n');
  };

  // 实例复制提交
  const handleCopySubmit = async (values: SyncInstanceCopyForm) => {
    try {
      setCopyLoading(true);

      const isExisting = values.dataSourceMode !== 'new';
      const isSameTable = values.tableMode !== 'different';

      if (!isExisting) {
        if (values.sameDsId || (values.tableNameDsIdMap && values.tableNameDsIdMap.length > 0)) {
          throw new Error('新建数据源模式下不需要填写 sameDsId 或 tableNameDsIdMap');
        }
      }

      if (isExisting && isSameTable && values.tableNameDsIdMap && values.tableNameDsIdMap.length > 0) {
        throw new Error('同一数据源场景无需配置表名-数据源ID映射');
      }

      if (isExisting && !isSameTable && values.sameDsId) {
        throw new Error('不同数据源场景无需配置 sameDsId');
      }

      const tableNameDsIdMap = isExisting && !isSameTable
        ? buildTableNameDsIdMap(values.tableNameDsIdMap)
        : undefined;
      const tableNameDsInfoParamList = !isExisting
        ? buildTableNameDsInfoParamList(values.tableNameDsInfoParamList)
        : undefined;
      const sameDsId = isExisting && isSameTable ? values.sameDsId : undefined;

      const payload: SyncInstanceCopyParam = {
        env: values.env,
        id: values.id,
        instanceName: values.instanceName,
        sameDsId,
        tableNameDsIdMap,
        tableNameDsInfoParamList
      };

      const response = await syncInstanceService.copy(payload);
      if (response.code !== 200) {
        throw new Error(response.msg || '实例复制失败');
      }

      setCopyResult(response.data || null);
      showNotification('实例复制成功', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : '实例复制失败';
      showNotification(message, 'error');
    } finally {
      setCopyLoading(false);
    }
  };

  // Canal实例创建提交
  const handleCreateSubmit = async (values: CreateCanalInstanceForm) => {
    try {
      setCreateLoading(true);

      const response = await instanceService.createCanalInstance({
        bindTopic: values.bindTopic,
        instanceId: values.instanceId,
        localDeploy: values.localDeploy,
        singleTable: values.singleTable
      });

      if (response.code !== 200) {
        throw new Error(response.msg || 'Canal实例创建失败');
      }

      setCreateResult(response.data || []);
      showNotification('Canal实例创建完成', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Canal实例创建失败';
      showNotification(message, 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  // Canal统计提交
  const handleStatisticSubmit = async (values: CanalStatisticForm) => {
    try {
      setStatLoading(true);
      const response = await instanceService.canalInstanceStatistic({ env: values.env });
      if (response.code !== 200) {
        throw new Error(response.msg || '实例统计查询失败');
      }
      const link = response.data || '';
      setStatResult(link);
      setStatFileName(getFileNameFromUrl(link));
      showNotification('实例统计查询成功', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : '实例统计查询失败';
      showNotification(message, 'error');
    } finally {
      setStatLoading(false);
    }
  };

  // 订阅信息导出
  const handleExport = async () => {
    try {
      setExportLoading(true);
      const response = await instanceService.orgSubscribeExcel();
      if (response.code !== 200) {
        throw new Error(response.msg || '订阅信息导出失败');
      }
      const link = response.data || '';
      setExportResult(link);
      setExportFileName(getFileNameFromUrl(link));
      showNotification('订阅信息导出成功', 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : '订阅信息导出失败';
      showNotification(message, 'error');
    } finally {
      setExportLoading(false);
    }
  };

  // Canal实例创建结果表格列
  const createColumns: ColumnsType<CanalInstanceCreateVO> = [
    {
      title: '实例名称',
      dataIndex: 'canalInstanceName',
      key: 'canalInstanceName',
      render: (value) => value || '-'
    },
    {
      title: '创建结果',
      dataIndex: 'createCanalInstanceSuccess',
      key: 'createCanalInstanceSuccess',
      render: (value) => (value ? <span className="text-green-600">成功</span> : <span className="text-red-500">失败</span>)
    },
    {
      title: 'Topic结果',
      dataIndex: 'createTopicSuccess',
      key: 'createTopicSuccess',
      render: (value) => (value ? <span className="text-green-600">成功</span> : <span className="text-red-500">失败</span>)
    },
    {
      title: '数据库',
      dataIndex: 'dbName',
      key: 'dbName',
      render: (value) => value || '-'
    },
    {
      title: '失败原因',
      dataIndex: 'createInstanceFailReason',
      key: 'createInstanceFailReason',
      render: (value) => value || '-'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Card bordered={false} className="shadow-sm">
        <Title level={3} className="!mb-2">其他功能</Title>
        <Paragraph className="text-gray-600">
          汇总实例复制、Canal实例创建、统计查询与订阅导出能力，便于统一运维操作。
        </Paragraph>
      </Card>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <Title level={4} className="!mb-1">实例管理类</Title>
          <Paragraph className="text-gray-500">
            涉及实例复制与 Canal 实例创建的核心能力，请按需填写参数。
          </Paragraph>
        </div>
        <Divider className="!my-2" />
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card bordered={false} className="shadow-sm border border-gray-100">
              <div className="mb-3">
                <Title level={5} className="!mb-1">实例复制</Title>
                <Paragraph className="text-gray-500 !mb-0">
                  复制现有同步实例到指定环境，可按需配置数据源映射与表信息。
                </Paragraph>
              </div>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                  <StepsForm<SyncInstanceCopyForm>
                    formProps={{
                      form: copyForm,
                      layout: 'vertical',
                      initialValues: { env: 'test', dataSourceMode: 'existing', tableMode: 'same' }
                    }}
                    stepsProps={{ size: 'small' }}
                    onFinish={async (values) => {
                      await handleCopySubmit(values);
                      return false;
                    }}
                    submitter={{
                      submitButtonProps: {
                        loading: copyLoading
                      },
                      render: (_, dom) => [
                        ...dom,
                        <Button
                          key="copy-reset"
                          onClick={() => {
                            copyForm.resetFields();
                            setCopyResult(null);
                          }}
                        >
                          重置
                        </Button>
                      ]
                    }}
                  >
                    <StepsForm.StepForm<SyncInstanceCopyForm> title="基础信息">
                      <Row gutter={[12, 12]}>
                        <Col xs={24} md={12}>
                          <ProFormSelect
                            label="目标环境"
                            name="env"
                            options={ENV_OPTIONS}
                            placeholder="请选择目标环境"
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <ProFormSelect
                            label="实例ID"
                            name="id"
                            options={instanceOptions}
                            fieldProps={{
                              showSearch: true,
                              allowClear: true,
                              placeholder: '请选择实例ID',
                              loading: instanceSelectLoading,
                              filterOption: false,
                              onSearch: (value) => fetchInstanceOptions(value),
                              onDropdownVisibleChange: (open) => {
                                if (open && instanceOptions.length === 0) {
                                  fetchInstanceOptions();
                                }
                              },
                              onChange: (value) => {
                                const target = instanceOptions.find((item) => item.value === value);
                                if (target?.instanceName) {
                                  copyForm.setFieldValue('instanceName', target.instanceName);
                                }
                              }
                            }}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <ProFormText
                            label="目标实例名"
                            name="instanceName"
                            placeholder="复制后的实例名称，可手动修改"
                          />
                        </Col>
                      </Row>
                    </StepsForm.StepForm>

                    <StepsForm.StepForm<SyncInstanceCopyForm> title="数据源策略">
                      <Row gutter={[12, 12]}>
                        <Col xs={24} md={12}>
                          <ProFormRadio.Group
                            label="数据源配置方式"
                            name="dataSourceMode"
                            extra="请先选择目标环境是否已有数据源"
                            options={[
                              { label: '已有数据源', value: 'existing' },
                              { label: '新建数据源', value: 'new' }
                            ]}
                            fieldProps={{
                              onChange: () => {
                                copyForm.setFieldValue('sameDsId', undefined);
                                copyForm.setFieldValue('tableNameDsIdMap', []);
                                copyForm.setFieldValue('tableNameDsInfoParamList', []);
                              }
                            }}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <ProFormDependency name={['dataSourceMode']}>
                            {({ dataSourceMode }) => dataSourceMode === 'existing' ? (
                              <ProFormRadio.Group
                                label="表分布方式"
                                name="tableMode"
                                extra="选择所有表是否在同一数据源"
                                options={[
                                  { label: '所有表同一数据源', value: 'same' },
                                  { label: '表分布在不同数据源', value: 'different' }
                                ]}
                                fieldProps={{
                                  onChange: () => {
                                    copyForm.setFieldValue('sameDsId', undefined);
                                    copyForm.setFieldValue('tableNameDsIdMap', []);
                                  }
                                }}
                              />
                            ) : null}
                          </ProFormDependency>
                        </Col>
                      </Row>
                    </StepsForm.StepForm>

                    <StepsForm.StepForm<SyncInstanceCopyForm> title="映射配置">
                      <ProFormDependency name={['dataSourceMode', 'tableMode']}>
                        {({ dataSourceMode, tableMode }) => {
                          if (dataSourceMode === 'existing' && tableMode !== 'different') {
                            return (
                              <ProFormDigit
                                label="复用数据源ID"
                                name="sameDsId"
                                extra="目标环境存在数据源且实例中所有表都来自同一库时填写。"
                                placeholder="目标环境存在数据源且实例中表都为同一个库"
                                fieldProps={{ style: { width: '100%' } }}
                              />
                            );
                          }

                          if (dataSourceMode === 'existing' && tableMode === 'different') {
                            return (
                              <ProFormList
                                name="tableNameDsIdMap"
                                label="表名-数据源ID映射"
                                copyIconProps={false}
                                creatorButtonProps={{
                                  creatorButtonText: '添加表名映射',
                                  type: 'dashed',
                                  block: true
                                }}
                              >
                                <Row gutter={[12, 12]}>
                                  <Col xs={24} md={14}>
                                    <ProFormText
                                      name="tableName"
                                      label="表名"
                                      placeholder="表名"
                                    />
                                  </Col>
                                  <Col xs={24} md={10}>
                                    <ProFormDigit
                                      name="dsId"
                                      label="数据源ID"
                                      placeholder="数据源ID"
                                      fieldProps={{ style: { width: '100%' } }}
                                    />
                                  </Col>
                                </Row>
                              </ProFormList>
                            );
                          }

                          if (dataSourceMode === 'new') {
                            return (
                              <ProFormList
                                name="tableNameDsInfoParamList"
                                label="表名-数据源详情列表"
                                copyIconProps={false}
                                creatorButtonProps={{
                                  creatorButtonText: '添加数据源配置',
                                  type: 'dashed',
                                  block: true
                                }}
                              >
                                <ProFormSelect
                                  label="实例表名列表"
                                  name="tableNameList"
                                  fieldProps={{ mode: 'tags' }}
                                  placeholder="输入表名，回车分隔"
                                />
                                <Row gutter={[12, 12]}>
                                  <Col xs={24} md={12}>
                                    <ProFormDigit
                                      label="数据源ID"
                                      name={['dsInfoParam', 'id']}
                                      placeholder="目标数据源ID"
                                      fieldProps={{ style: { width: '100%' } }}
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <ProFormText
                                      label="数据源名称"
                                      name={['dsInfoParam', 'name']}
                                      placeholder="数据源名称"
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <ProFormText
                                      label="连接URL"
                                      name={['dsInfoParam', 'url']}
                                      placeholder="jdbc://..."
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <ProFormText
                                      label="用户名"
                                      name={['dsInfoParam', 'userName']}
                                      placeholder="user"
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <ProFormText
                                      label="密码"
                                      name={['dsInfoParam', 'password']}
                                      fieldProps={{ type: 'password' }}
                                      placeholder="password"
                                    />
                                  </Col>
                                  <Col xs={24} md={12}>
                                    <ProFormDigit
                                      label="数据源类型"
                                      name={['dsInfoParam', 'type']}
                                      placeholder="1 mysql / 2 es ..."
                                      fieldProps={{ style: { width: '100%' } }}
                                    />
                                  </Col>
                                  <Col xs={24}>
                                    <ProFormTextArea
                                      label="扩展配置"
                                      name={['dsInfoParam', 'properties']}
                                      extra='JSON格式，例如：{"timezone":"UTC"}'
                                      fieldProps={{ rows: 3 }}
                                      placeholder="输入JSON配置"
                                    />
                                  </Col>
                                </Row>
                              </ProFormList>
                            );
                          }

                          return <Text className="text-gray-500">请先完成上一步配置。</Text>;
                        }}
                      </ProFormDependency>
                    </StepsForm.StepForm>
                  </StepsForm>
                </Col>
                <Col xs={24} lg={10}>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 h-full">
                    <Text className="text-gray-500">参数预览</Text>
                    <pre className="mt-3 text-xs text-gray-700 whitespace-pre-wrap break-all">
                      {formatPreviewJson([
                        { key: 'id', value: copyPreview.id, hint: '实例id' },
                        { key: 'env', value: copyPreview.env, hint: '环境 prod / test' },
                        { key: 'instanceName', value: copyPreview.instanceName, hint: '指定新实例的名字，可为空' },
                        { key: 'tableNameDsInfoParamList', value: copyPreview.tableNameDsInfoParamList, hint: '跨环境迁移，补全表对应的数据源信息' },
                        { key: 'tableNameDsIdMap', value: copyPreview.tableNameDsIdMap, hint: '目标环境有数据源但表分布在不同数据源时使用' },
                        { key: 'sameDsId', value: copyPreview.sameDsId, hint: '所有表都在同一数据源时使用' }
                      ])}
                    </pre>
                  </div>
                </Col>
              </Row>

              {copyResult && (
                <div className="mt-4">
                  <Descriptions title="复制结果" bordered size="small" column={1}>
                    <Descriptions.Item label="实例ID">{copyResult.id || '-'}</Descriptions.Item>
                    <Descriptions.Item label="实例名称">{copyResult.instanceName || '-'}</Descriptions.Item>
                    <Descriptions.Item label="同步类型">{copyResult.syncType ?? '-'}</Descriptions.Item>
                    <Descriptions.Item label="状态">{copyResult.status ?? '-'}</Descriptions.Item>
                    <Descriptions.Item label="团队">{copyResult.team || '-'}</Descriptions.Item>
                  </Descriptions>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card bordered={false} className="shadow-sm border border-gray-100">
              <div className="mb-3">
                <Title level={5} className="!mb-1">创建 Canal 实例</Title>
                <Paragraph className="text-gray-500 !mb-0">
                  根据同步实例信息创建对应的 Canal 实例，并可选择是否绑定Topic。
                </Paragraph>
              </div>
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={14}>
                  <Form form={createForm} layout="vertical" onFinish={handleCreateSubmit}>
                    <Row gutter={[12, 12]}>
                      <Col xs={24} md={12}>
                        <Form.Item label="实例ID" name="instanceId">
                          <Select
                            showSearch
                            allowClear
                            placeholder="请选择实例ID"
                            loading={instanceSelectLoading}
                            options={instanceOptions}
                            filterOption={false}
                            onSearch={(value) => fetchInstanceOptions(value)}
                            onDropdownVisibleChange={(open) => {
                              if (open && instanceOptions.length === 0) {
                                fetchInstanceOptions();
                              }
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="绑定Topic" name="bindTopic" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="本地部署" name="localDeploy" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={8}>
                        <Form.Item label="单表模式" name="singleTable" valuePropName="checked">
                          <Switch />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Space>
                      <Button type="primary" htmlType="submit" loading={createLoading}>
                        创建实例
                      </Button>
                      <Button
                        onClick={() => {
                          createForm.resetFields();
                          setCreateResult([]);
                        }}
                      >
                        重置
                      </Button>
                    </Space>
                  </Form>

                  <div className="mt-4">
                    <Table
                      size="small"
                      rowKey={(record, index) => record.canalInstanceId || String(index)}
                      columns={createColumns}
                      dataSource={createResult}
                      pagination={false}
                      locale={{ emptyText: '暂无创建记录' }}
                    />
                  </div>
                </Col>
                <Col xs={24} lg={10}>
                  <div className="rounded-lg border border-gray-100 bg-gray-50 p-4 h-full">
                    <Text className="text-gray-500">参数预览</Text>
                    <pre className="mt-3 text-xs text-gray-700 whitespace-pre-wrap break-all">
                      {formatPreviewJson([
                        { key: 'instanceId', value: createPreview.instanceId, hint: '同步实例ID' },
                        { key: 'bindTopic', value: createPreview.bindTopic, hint: '是否自动创建并绑定Topic' },
                        { key: 'localDeploy', value: createPreview.localDeploy, hint: '是否本地部署实例' },
                        { key: 'singleTable', value: createPreview.singleTable, hint: '是否单表模式' }
                      ])}
                    </pre>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
        <div>
          <Title level={4} className="!mb-1">统计与导出</Title>
          <Paragraph className="text-gray-500">
            输出统计与订阅导出文件链接，可直接下载并展示中文文件名。
          </Paragraph>
        </div>
        <Divider className="!my-2" />
        <Row gutter={[16, 16]}>
          <Col xs={24} xl={12}>
            <Card bordered={false} className="shadow-sm h-full border border-gray-100">
              <div className="mb-3">
                <Title level={5} className="!mb-1">实例统计</Title>
                <Paragraph className="text-gray-500 !mb-0">
                  查询指定环境的实例统计信息，支持快速核对实例状态。
                </Paragraph>
              </div>
              <Form form={statForm} layout="vertical" onFinish={handleStatisticSubmit} initialValues={{ env: 'test' }}>
                <Form.Item label="环境" name="env">
                  <Select options={ENV_OPTIONS} placeholder="请选择环境" />
                </Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" loading={statLoading}>
                    查询统计
                  </Button>
                  <Button
                    onClick={() => {
                      statForm.resetFields();
                      setStatResult('');
                      setStatFileName('');
                    }}
                  >
                    重置
                  </Button>
                </Space>
              </Form>

              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <Text className="text-gray-600">统计结果：</Text>
                <div className="mt-2 space-y-2">
                  <div className="text-gray-900 break-all">{statResult || '暂无数据'}</div>
                  {statResult && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Text className="text-gray-500">文件名：</Text>
                      <Text className="text-gray-700">{statFileName || '未知文件名'}</Text>
                      <Button size="small" onClick={() => triggerDownload(statResult, statFileName)}>
                        下载
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} xl={12}>
            <Card bordered={false} className="shadow-sm h-full border border-gray-100">
              <div className="mb-3">
                <Title level={5} className="!mb-1">订阅信息导出</Title>
                <Paragraph className="text-gray-500 !mb-0">
                  导出实例订阅信息Excel文件，便于线下分析与归档。
                </Paragraph>
              </div>
              <Space>
                <Button type="primary" onClick={handleExport} loading={exportLoading}>
                  开始导出
                </Button>
                <Button
                  onClick={() => {
                    setExportResult('');
                    setExportFileName('');
                  }}
                >
                  清空结果
                </Button>
              </Space>

              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <Text className="text-gray-600">导出结果：</Text>
                <div className="mt-2 space-y-2">
                  <div className="text-gray-900 break-all">{exportResult || '暂无导出记录'}</div>
                  {exportResult && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Text className="text-gray-500">文件名：</Text>
                      <Text className="text-gray-700">{exportFileName || '未知文件名'}</Text>
                      <Button size="small" onClick={() => triggerDownload(exportResult, exportFileName)}>
                        下载
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      <AppNotification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
};

export default OtherFunctions;
