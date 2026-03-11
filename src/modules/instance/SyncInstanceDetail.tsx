import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSyncAlt, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import syncInstanceService from '../../services/crud/syncInstance/syncInstanceService';
import dictService from '../../services/server/dict/dictService';
import type { SyncInstanceVO } from '../../types/crud/syncInstance/syncInstanceType';
import type { EnumItemVOjava_lang_Stringjava_lang_Integer, EnumItemVOjava_lang_Stringjava_lang_Long } from '../../types/server/dict/dictType';
import AppNotification, { type NotificationType } from '../../components/AppNotification';
import TableMappingDisplay from './TableMappingDisplay';

/**
 * 同步实例详情页面
 */
const SyncInstanceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 从路由参数中获取实例ID
  const { id } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const querySyncType = queryParams.get('syncType');
  const routeSyncType = location.state?.syncType != null ? Number(location.state.syncType) : (querySyncType ? Number(querySyncType) : null);

  // 从路由状态获取实例ID，如果没有则从查询参数获取
  const instanceId = id || location.state?.id || queryParams.get('id');
  
  // 状态管理
  const [instanceData, setInstanceData] = useState<SyncInstanceVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 字典数据状态
  const [dataTypeDict, setDataTypeDict] = useState<EnumItemVOjava_lang_Stringjava_lang_Integer[]>([]); // 数据类型字典
  const [dsInfoDict, setDsInfoDict] = useState<EnumItemVOjava_lang_Stringjava_lang_Long[]>([]); // 数据源字典
  const [esMappingTypeDict, setEsMappingTypeDict] = useState<EnumItemVOjava_lang_Stringjava_lang_Integer[]>([]); // ES映射类型字典
  
  // 可折叠面板状态
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({});
  
  // 通知状态
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: NotificationType;
  }>({
    visible: false,
    message: '',
    type: 'info'
  });

  // 初始化字典数据
  const initDictData = async () => {
    try {
      // 并行请求所有字典数据
      const [dataTypeResult, dsInfoResult, esMappingTypeResult] = await Promise.all([
        dictService.dataTypeDict(),
        dictService.dsInfoDict(),
        dictService.esMappingTypeDict()
      ]);
      
      // 设置字典数据状态，使用data属性获取实际数据
      setDataTypeDict(dataTypeResult.data || []);
      setDsInfoDict(dsInfoResult.data || []);
      setEsMappingTypeDict(esMappingTypeResult.data || []);
    } catch (error) {
      console.error('获取字典数据失败:', error);
      setNotification({
        visible: true,
        message: `获取字典数据失败: ${error.message || '未知错误'}`,
        type: 'error'
      });
    }
  };

  // 获取实例详情
  const fetchInstanceDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const resolvedId = instanceId ? Number(instanceId) : undefined;
      if (!resolvedId) {
        throw new Error('未提供实例ID');
      }
      // 调用API获取实例详情
      const response = await syncInstanceService.queryById({ id: resolvedId });
      console.log('获取实例详情响应:', response);
      if (response.code === 200 && response.data) {
        setInstanceData(response.data);
      } else {
        throw new Error(response.msg || '获取实例详情失败');
      }
    } catch (err) {
      console.error('获取实例详情失败:', err);
      setError(err instanceof Error ? err.message : '获取实例详情失败');
      setNotification({
        visible: true,
        message: `获取实例详情失败: ${err instanceof Error ? err.message : '未知错误'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const getListPathBySyncType = (syncType?: number | null) => {
    if (syncType === 1) return '/local-deploy';
    if (syncType === 3) return '/clickhouse-sync';
    if (syncType === 6) return '/doris-sync';
    return '/es-sync';
  };

  // 返回列表页面
  const handleBack = () => {
    const syncType = instanceData?.syncType != null ? Number(instanceData.syncType) : routeSyncType;
    navigate(getListPathBySyncType(syncType));
  };

  // 处理通知关闭
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      visible: false
    });
  };

  // 切换表格展开/折叠状态
  const toggleTableExpansion = (tableId) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableId]: !prev[tableId]
    }));
  };

  // 组件挂载时获取数据
  useEffect(() => {
    if (instanceId) {
      // 初始化字典数据和实例详情数据
      initDictData();
      fetchInstanceDetail();
    } else {
      setError('未提供实例ID');
      setLoading(false);
    }
  }, [instanceId]);

  // 获取状态文本
  const getStatusText = (status) => {
    switch (status) {
      case 0: return '草稿';
      case 1: return '启用';
      case 2: return '禁用';
      default: return '未知';
    }
  };

  // 获取状态样式
  const getStatusClass = (status) => {
    switch (status) {
      case 0: return 'bg-gray-100 text-gray-800';
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取同步类型文本 - 增加对ClickHouse类型的支持
  const getSyncTypeText = (syncType) => {
    switch (syncType) {
      case 1: return 'RDB';
      case 2: return 'ES';
      case 3: return 'ClickHouse';
      case 6: return 'Doris';
      default: return '未知';
    }
  };

  // 获取日志状态文本
  const getLogStatusText = (enableLog) => {
    return enableLog === 1 ? '开启' : '关闭';
  };

  // 获取数据类型文本（使用字典数据）
  const getDataTypeText = (dataType) => {
    // 首先尝试从字典中查找
    const dictItem = dataTypeDict.find(item => item.val === dataType);
    if (dictItem) {
      return dictItem.key;
    }
    
    // 如果字典中没有找到，则使用原来的硬编码值
    switch (dataType) {
      case 1: return 'Integer';
      case 2: return 'Long';
      case 3: return 'String';
      case 4: return 'Date';
      case 11: return 'Text';
      default: return '未知';
    }
  };

  // 获取是否主表文本
  const getIsMainTableText = (isMainTable) => {
    return isMainTable ? '是' : '否';
  };

  // 获取映射类型文本（使用字典数据）
  const getMappingTypeText = (mappingType) => {
    // 首先尝试从字典中查找
    const dictItem = esMappingTypeDict.find(item => item.val === mappingType);
    if (dictItem) {
      return dictItem.key;
    }
    
    // 如果字典中没有找到，则使用原来的硬编码值
    switch (mappingType) {
      case 1: return '一对一';
      case 2: return '一对多';
      default: return '未知';
    }
  };

  // 获取数据源名称（使用字典数据）
  const getDataSourceName = (dsId) => {
    if (!dsId) return '-';
    const dsIdValue = typeof dsId === 'string' ? Number(dsId) : dsId;
    // 尝试从字典中查找数据源名称
    const dictItem = dsInfoDict.find(item => item.val === dsIdValue);
    return dictItem ? dictItem.key : dsId;
  };

// 获取布尔值文本
  const getBooleanText = (value) => {
    return value ? '是' : '否';
  };

  // 不同类型的表信息配置
  const tableInfoConfigs = {
    // RDB类型表信息配置
    1: {
      fields: [
        { key: 'srcDsId', label: '表所属数据源', formatter: getDataSourceName },
        // 修改：添加visibleIf条件，当存在tableNameRegex时不显示tableName
        { key: 'tableName', label: '表名', visibleIf: (tableItem) => !tableItem.tableNameRegex },
        // 如果有tableNameRegex，显示为源表正则表达式
        { key: 'tableNameRegex', label: '源表正则表达式', visibleIf: (tableItem) => !!tableItem.tableNameRegex },
        // 添加水平分表数量字段
        { key: 'shardedCount', label: '水平分表数量', visibleIf: (tableItem) => tableItem.shardedCount > 0 },
        { key: 'dbName', label: '数据库名' },
        { key: 'master', label: '是否主表', formatter: getIsMainTableText },
        { key: 'type', label: '映射类型', formatter: getMappingTypeText },
        { key: 'nestedKey', label: 'Nested Key' },
        { key: 'primaryKey', label: '主键', formatter: getBooleanText },
        { key: 'updateTimeColumnName', label: '更新时间列名' },
        { key: 'otherCondition', label: '过滤条件' },
        { key: 'delimiter', label: '分隔符' }
      ]
    },
    // ES类型表信息配置
    2: {
      fields: [
        { key: 'srcDsId', label: '表所属数据源', formatter: getDataSourceName },
        // 修改：添加visibleIf条件
        { key: 'tableName', label: '表名', visibleIf: (tableItem) => !tableItem.tableNameRegex },
        { key: 'tableNameRegex', label: '源表正则表达式', visibleIf: (tableItem) => !!tableItem.tableNameRegex },
        { key: 'shardedCount', label: '水平分表数量', visibleIf: (tableItem) => tableItem.shardedCount > 0 },
        { key: 'dbName', label: '数据库名' },
        { key: 'master', label: '是否主表', formatter: getIsMainTableText },
        { key: 'type', label: '映射类型', formatter: getMappingTypeText },
        { key: 'nestedKey', label: 'Nested Key' },
        { key: 'primaryKey', label: '主键' },
        { key: 'updateTimeColumnName', label: '更新时间列名' },
        { key: 'otherCondition', label: '过滤条件' },
        { key: 'delimiter', label: '分隔符' }
      ]
    },
    // ClickHouse类型表信息配置
    3: {
      fields: [
        { key: 'srcDsId', label: '表所属数据源', formatter: getDataSourceName },
        // 修改：添加visibleIf条件
        { key: 'tableName', label: '表名', visibleIf: (tableItem) => !tableItem.tableNameRegex },
        { key: 'tableNameRegex', label: '源表正则表达式', visibleIf: (tableItem) => !!tableItem.tableNameRegex },
        { key: 'shardedCount', label: '水平分表数量', visibleIf: (tableItem) => tableItem.shardedCount > 0 },
        { key: 'dbName', label: '数据库名' },
        { key: 'master', label: '是否主表', formatter: getIsMainTableText },
        { key: 'clickhouseTableName', label: 'ClickHouse表名' },
        { key: 'clickhouseDbName', label: 'ClickHouse数据库名' },
        { key: 'primaryKey', label: '主键' },
        { key: 'updateTimeColumnName', label: '更新时间列名' },
        { key: 'otherCondition', label: '过滤条件' }
      ]
    },
    // Doris类型表信息配置
    6: {
      fields: [
        { key: 'srcDsId', label: '表所属数据源', formatter: getDataSourceName },
        { key: 'tableName', label: '表名', visibleIf: (tableItem) => !tableItem.tableNameRegex },
        { key: 'tableNameRegex', label: '源表正则表达式', visibleIf: (tableItem) => !!tableItem.tableNameRegex },
        { key: 'shardedCount', label: '水平分表数量', visibleIf: (tableItem) => tableItem.shardedCount > 0 },
        { key: 'dbName', label: '数据库名' },
        { key: 'master', label: '是否主表', formatter: getIsMainTableText },
        { key: 'dorisTableName', label: 'Doris表名' },
        { key: 'dorisDbName', label: 'Doris数据库名' },
        { key: 'primaryKey', label: '主键' },
        { key: 'updateTimeColumnName', label: '更新时间列名' },
        { key: 'otherCondition', label: '过滤条件' }
      ]
    }
  };

  // 不同类型的列信息配置
  const columnInfoConfigs = {
    // RDB类型列信息配置
    1: {
      columns: [
        { key: 'srcColumnName', label: '源字段名', render: renderColumnWithTags },
        { key: 'srcDataType', label: '源数据类型', formatter: getDataTypeText },
        { key: 'targetColumnName', label: '目标字段名', render: renderColumnWithTags },
        { key: 'targetDataType', label: '目标数据类型', formatter: getDataTypeText },
        { key: 'primaryKey', label: '主键', render: renderBooleanTag },
        { key: 'foreignKey', label: '外键', render: renderBooleanTag },
        { key: 'mainTableFk', label: '主表外键' },
        { key: 'needData', label: '是否需要数据', formatter: getBooleanText }
      ]
    },
    // ES类型列信息配置
    2: {
      columns: [
        { key: 'srcColumnName', label: '源字段名', render: renderColumnWithTags },
        { key: 'srcDataType', label: '源数据类型', formatter: getDataTypeText },
        { key: 'targetColumnName', label: '目标字段名', render: renderColumnWithTags },
        { key: 'targetDataType', label: '目标数据类型', formatter: getDataTypeText },
        { key: 'primaryKey', label: '主键', render: renderBooleanTag },
        { key: 'foreignKey', label: '外键', render: renderBooleanTag },
        { key: 'mainTableFk', label: '主表外键' },
        { key: 'needData', label: '是否需要数据', formatter: getBooleanText },
        { key: 'columnSql', label: '过滤SQL' },
        { key: 'delimiter', label: '分隔符' }
      ]
    },
    // ClickHouse类型列信息配置
    3: {
      columns: [
        { key: 'srcColumnName', label: '源字段名', render: renderColumnWithTags },
        { key: 'srcDataType', label: '源数据类型', formatter: getDataTypeText },
        { key: 'targetColumnName', label: '目标字段名', render: renderColumnWithTags },
        { key: 'targetDataType', label: '目标数据类型', formatter: getDataTypeText },
        { key: 'primaryKey', label: '主键', render: renderBooleanTag },
        { key: 'foreignKey', label: '外键', render: renderBooleanTag },
        { key: 'mainTableFk', label: '主表外键' },
        { key: 'needData', label: '是否需要数据', formatter: getBooleanText }
      ]
    },
    // Doris类型列信息配置
    6: {
      columns: [
        { key: 'srcColumnName', label: '源字段名', render: renderColumnWithTags },
        { key: 'srcDataType', label: '源数据类型', formatter: getDataTypeText },
        { key: 'targetColumnName', label: '目标字段名', render: renderColumnWithTags },
        { key: 'targetDataType', label: '目标数据类型', formatter: getDataTypeText },
        { key: 'primaryKey', label: '主键', render: renderBooleanTag },
        { key: 'foreignKey', label: '外键', render: renderBooleanTag },
        { key: 'mainTableFk', label: '主表外键' },
        { key: 'needData', label: '是否需要数据', formatter: getBooleanText }
      ]
    }
  };

  // 渲染带标签的列名
  function renderColumnWithTags(column) {
    return (
      <div className="flex items-center">
        <span>{column.srcColumnName || '-'}</span>
        {column.primaryKey && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            PK
          </span>
        )}
        {column.foreignKey && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            FK
          </span>
        )}
      </div>
    );
  }

  // 渲染布尔值标签
  function renderBooleanTag(value) {
    return value ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        是
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        否
      </span>
    );
  }

  // 渲染加载状态
  if (loading) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            返回列表
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center py-10">
            <p>加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <div className="w-full overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={handleBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            返回列表
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center py-10">
            <p className="text-red-500">错误: {error}</p>
            <button 
              onClick={fetchInstanceDetail}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 渲染详情内容
  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          返回列表
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{getSyncTypeText(instanceData?.syncType)}同步实例详情</h1>
        <button 
          onClick={() => {
            initDictData();
            fetchInstanceDetail();
          }}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
          刷新
        </button>
      </div>

      {/* 详情内容 */}
      <div className="bg-white rounded-lg shadow w-full overflow-hidden">
        {instanceData && (
          <div className="p-6">
            {/* 基本信息模块 */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600">实例ID</label>
                  <p className="mt-1 text-sm text-gray-900">{instanceData.id || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600">任务实例名</label>
                  <p className="mt-1 text-sm text-gray-900">{instanceData.instanceName || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600">状态</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusClass(instanceData.status)}`}>
                    {getStatusText(instanceData.status)}
                  </span>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600">同步类型</label>
                  <p className="mt-1 text-sm text-gray-900">{getSyncTypeText(instanceData.syncType) || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600">源数据表名</label>
                  <p className="mt-1 text-sm text-gray-900">{instanceData.srcTableName || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600">目标表/索引名</label>
                  <p className="mt-1 text-sm text-gray-900">{instanceData.targetTableName || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600">所属团队</label>
                  <p className="mt-1 text-sm text-gray-900">{instanceData.team || '-'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-600">创建人</label>
                  <p className="mt-1 text-sm text-gray-900">{instanceData.createUserGuid || '-'}</p>
                </div>
              </div>
            </div>

            {/* 映射关系模块 - 使用新组件 */}
            <TableMappingDisplay 
              mappingJson={instanceData.mappingJson}
              syncType={instanceData.syncType}
              expandedTables={expandedTables}
              onToggleTableExpansion={(tableId, isExpanded) => toggleTableExpansion(tableId)}
              formatters={{
                getDataSourceName,
                getMappingTypeText,
                getDataTypeText,
                getBooleanText,
                getIsMainTableText
              }}
              tableInfoConfigs={tableInfoConfigs}
              columnInfoConfigs={columnInfoConfigs}
            />
          </div>
        )}
      </div>

      {/* 通知组件 */}
      <AppNotification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onClose={handleCloseNotification}
        duration={3000}
      />
    </div>
  );
};

export default SyncInstanceDetail;
