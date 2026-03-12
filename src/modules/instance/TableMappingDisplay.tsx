import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

/**
 * 表映射静态展示组件
 * 用于在详情页面和编辑页面展示映射数据，不包含编辑功能
 */
const TableMappingDisplay = ({ 
  mappingJson, 
  syncType, 
  expandedTables: initialExpandedTables, 
  onToggleTableExpansion, 
  tableInfoConfigs, // 可以由外部传入自定义的表信息配置。不传使用默认配置
  columnInfoConfigs, // 可以由外部传入自定义的列信息配置。不传使用默认配置
  formatters = {}
}) => {
  // 如果没有传入展开状态，则使用默认状态
  const [expandedTables, setExpandedTables] = useState(initialExpandedTables || {});
  // 渲染同步类型标签
  const renderSyncTypeTag = () => {
    
  }
  if(!tableInfoConfigs){
    tableInfoConfigs = defaultProps.tableInfoConfigs;
  }
  if(!columnInfoConfigs){
    columnInfoConfigs = defaultProps.columnInfoConfigs;
  }
  // 处理表展开/折叠状态切换
  const handleToggleTableExpansion = (tableId) => {
    const newExpandedTables = { ...expandedTables, [tableId]: !expandedTables[tableId] };
    setExpandedTables(newExpandedTables);
    if (onToggleTableExpansion) {
      onToggleTableExpansion(tableId, newExpandedTables[tableId]);
    }
  };

  const formatDisplayValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }
    return value;
  };

  // 获取格式化器，支持直接传函数或按名称从 formatters 中取
  const getFormatter = (formatter) => {
    if (typeof formatter === 'function') {
      return formatter;
    }

    if (typeof formatter === 'string' && typeof formatters[formatter] === 'function') {
      return formatters[formatter];
    }

    return (value) => formatDisplayValue(value);
  };

  const getRenderer = (renderer) => {
    if (typeof renderer === 'function') {
      return renderer;
    }

    if (typeof renderer === 'string') {
      if (renderer === 'renderColumnWithTags') {
        return (value, column, columnConfig) => renderColumnWithTags(value, column, columnConfig?.key);
      }

      if (renderer === 'renderBooleanTag') {
        return renderBooleanTag;
      }
    }

    return null;
  };

  // 获取数据源名称格式化器
  const getDataSourceName = getFormatter('getDataSourceName');

  // 获取映射类型文本格式化器
  const getMappingTypeText = getFormatter('getMappingTypeText');

  // 获取数据类型文本格式化器
  const getDataTypeText = getFormatter('getDataTypeText');

  // 获取布尔值文本格式化器
  const getBooleanText = getFormatter('getBooleanText');

  // 获取是否主表文本格式化器
  const getIsMainTableText = getFormatter('getIsMainTableText');

  // 渲染带标签的列名
  const renderColumnWithTags = (value, column, columnKey = 'srcColumnName') => {
    return (
      <div className="flex items-center">
        <span>{formatDisplayValue(value ?? column?.[columnKey])}</span>
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
  };

  // 渲染布尔值标签
  const renderBooleanTag = (value) => {
    return value ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        是
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        否
      </span>
    );
  };

  // 渲染映射关系列表
  const renderMappingList = () => {
    const tableItemList = mappingJson?.tableItemList || [];
    
    if (!tableItemList || tableItemList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>暂无映射关系数据</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tableItemList.map((tableItem) => (
          <div key={tableItem.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* 表格头部 - 可点击展开/折叠 */}
            <div 
              className="bg-gray-50 p-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition-colors"
              onClick={() => handleToggleTableExpansion(tableItem.id)}
            >
              <div>
                <h3 className="font-medium text-gray-800 flex items-center">
                  {/* 始终显示表名 */}
                  {tableItem.tableName || '-'} 
                  {tableItem.master && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      主表
                    </span>
                  )}
                  {/* 添加水平分表标识 */}
                  {tableItem.shardedCount > 0 && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                      水平分表 ({tableItem.shardedCount})
                    </span>
                  )}
                  {!tableItem.master && tableItem.nestedKey && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                      nested
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-1 flex items-center">
                  {getDataSourceName(tableItem.srcDsId) || tableItem.srcDsId || '-'}｜{tableItem.tableName || '-'} 表
                  {tableItem.topic && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                       监听Topic:{tableItem.topic}
                    </span>
                  )}
                </p>
              </div>
              <FontAwesomeIcon 
                icon={expandedTables[tableItem.id] ? faChevronDown : faChevronRight} 
                className="text-gray-500"
              />
            </div>
            
            {/* 表格详细信息 - 展开时显示 */}
            {expandedTables[tableItem.id] && (
              <div className="p-4 bg-white">
                {/* 表信息展示 */}
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-gray-800 mb-3">表信息</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* 渲染表信息字段，支持条件显示 */}
                    {(tableInfoConfigs[syncType]?.fields || []).filter(field => {
                      // 如果字段有visibleIf条件，则根据条件决定是否显示
                      if (field.visibleIf && typeof field.visibleIf === 'function') {
                        return field.visibleIf(tableItem);
                      }
                      return true;
                    }).map((field, index) => {
                      // 处理render函数，传入tableItem作为第二个参数
                      let displayValue;
                      if (field.render && typeof field.render === 'function') {
                        displayValue = field.render(tableItem[field.key], tableItem) || '-';
                      } else if (field.formatter) {
                        const formatter = getFormatter(field.formatter);
                        displayValue = formatDisplayValue(formatter(tableItem[field.key], tableItem, field));
                      } else {
                        displayValue = formatDisplayValue(tableItem[field.key]);
                      }
                       
                      return (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <label className="block text-xs font-medium text-gray-500">{field.label}</label>
                          <p className="mt-1 text-sm text-gray-900">{displayValue}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 列信息展示 */}
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-3">列映射信息</h4>
                  {(!tableItem.columnItemList || tableItem.columnItemList.length === 0) ? (
                    <p className="text-gray-500 text-center py-4">该表暂无列映射信息</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {/* 根据实例类型渲染不同的列信息表头 */}
                            {(columnInfoConfigs[syncType]?.columns || []).map((column, index) => (
                              <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {tableItem.columnItemList.map((column, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {/* 根据实例类型渲染不同的列信息内容 */}
                              {(columnInfoConfigs[syncType]?.columns || []).map((colConfig, colIndex) => {
                                const value = column[colConfig.key];
                                let displayValue;
                                const renderer = getRenderer(colConfig.render);
                                
                                if (renderer) {
                                  displayValue = renderer(value, column, colConfig);
                                } else if (colConfig.formatter) {
                                  const formatter = getFormatter(colConfig.formatter);
                                  displayValue = formatDisplayValue(formatter(value, column, colConfig));
                                } else {
                                  displayValue = formatDisplayValue(value);
                                }
                                
                                return (
                                  <td key={colIndex} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                    {displayValue}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">映射关系</h2>
      {renderMappingList()}
    </div>
  );
};

// 默认的表信息配置
const defaultProps = {
  tableInfoConfigs: {
    // RDB类型表信息配置
    1: {
      fields: [
        { key: 'srcDsId', label: '表所属数据源' },
        { key: 'tableName', label: '表名', visibleIf: (tableItem) => !tableItem.tableNameRegex },
        { key: 'tableNameRegex', label: '源表正则表达式', visibleIf: (tableItem) => !!tableItem.tableNameRegex },
        { key: 'shardedCount', label: '水平分表数量', visibleIf: (tableItem) => tableItem.shardedCount > 0 },
        { key: 'dbName', label: '数据库名' },
        { key: 'master', label: '是否主表' },
        { key: 'type', label: '映射类型' },
        { key: 'nestedKey', label: 'Nested Key' },
        { key: 'primaryKey', label: '主键' },
        { key: 'updateTimeColumnName', label: '更新时间列名' },
        { key: 'otherCondition', label: '过滤条件' },
        { key: 'delimiter', label: '分隔符' }
      ]
    },
    // ES类型表信息配置
    2: {
      fields: [
        { key: 'srcDsId', label: '表所属数据源' },
        { key: 'tableName', label: '表名', visibleIf: (tableItem) => !tableItem.tableNameRegex },
        { key: 'tableNameRegex', label: '源表正则表达式', visibleIf: (tableItem) => !!tableItem.tableNameRegex },
        { key: 'shardedCount', label: '水平分表数量', visibleIf: (tableItem) => tableItem.shardedCount > 0 },
        { key: 'dbName', label: '数据库名' },
        { key: 'master', label: '是否主表' },
        { key: 'type', label: '映射类型' },
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
        { key: 'srcDsId', label: '表所属数据源' },
        { key: 'tableName', label: '表名', visibleIf: (tableItem) => !tableItem.tableNameRegex },
        { key: 'tableNameRegex', label: '源表正则表达式', visibleIf: (tableItem) => !!tableItem.tableNameRegex },
        { key: 'shardedCount', label: '水平分表数量', visibleIf: (tableItem) => tableItem.shardedCount > 0 },
        { key: 'dbName', label: '数据库名' },
        { key: 'master', label: '是否主表' },
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
        { key: 'srcDsId', label: '表所属数据源' },
        { key: 'tableName', label: '表名', visibleIf: (tableItem) => !tableItem.tableNameRegex },
        { key: 'tableNameRegex', label: '源表正则表达式', visibleIf: (tableItem) => !!tableItem.tableNameRegex },
        { key: 'shardedCount', label: '水平分表数量', visibleIf: (tableItem) => tableItem.shardedCount > 0 },
        { key: 'dbName', label: '数据库名' },
        { key: 'master', label: '是否主表' },
        { key: 'dorisTableName', label: 'Doris表名' },
        { key: 'dorisDbName', label: 'Doris数据库名' },
        { key: 'primaryKey', label: '主键' },
        { key: 'updateTimeColumnName', label: '更新时间列名' },
        { key: 'otherCondition', label: '过滤条件' }
      ]
    }
  },
  columnInfoConfigs: {
    // RDB类型列信息配置
    1: {
      columns: [
        { key: 'srcColumnName', label: '源字段名', render: 'renderColumnWithTags' },
        { key: 'srcDataType', label: '源数据类型' },
        { key: 'targetColumnName', label: '目标字段名', render: 'renderColumnWithTags' },
        { key: 'targetDataType', label: '目标数据类型' },
        { key: 'primaryKey', label: '主键', render: 'renderBooleanTag' },
        { key: 'foreignKey', label: '外键', render: 'renderBooleanTag' },
        { key: 'mainTableFk', label: '主表外键' },
        { key: 'needData', label: '是否需要数据' }
      ]
    },
    // ES类型列信息配置
    2: {
      columns: [
        { key: 'srcColumnName', label: '源字段名', render: 'renderColumnWithTags' },
        { key: 'srcDataType', label: '源数据类型' },
        { key: 'targetColumnName', label: '目标字段名', render: 'renderColumnWithTags' },
        { key: 'targetDataType', label: '目标数据类型' },
        { key: 'primaryKey', label: '主键', render: 'renderBooleanTag' },
        { key: 'foreignKey', label: '外键', render: 'renderBooleanTag' },
        { key: 'mainTableFk', label: '主表外键' },
        { key: 'needData', label: '是否需要数据' },
        { key: 'columnSql', label: '过滤SQL' },
        { key: 'delimiter', label: '分隔符' }
      ]
    },
    // ClickHouse类型列信息配置
    3: {
      columns: [
        { key: 'srcColumnName', label: '源字段名', render: 'renderColumnWithTags' },
        { key: 'srcDataType', label: '源数据类型' },
        { key: 'targetColumnName', label: '目标字段名', render: 'renderColumnWithTags' },
        { key: 'targetDataType', label: '目标数据类型' },
        { key: 'primaryKey', label: '主键', render: 'renderBooleanTag' },
        { key: 'foreignKey', label: '外键', render: 'renderBooleanTag' },
        { key: 'mainTableFk', label: '主表外键' },
        { key: 'needData', label: '是否需要数据' }
      ]
    },
    // Doris类型列信息配置
    6: {
      columns: [
        { key: 'srcColumnName', label: '源字段名', render: 'renderColumnWithTags' },
        { key: 'srcDataType', label: '源数据类型' },
        { key: 'targetColumnName', label: '目标字段名', render: 'renderColumnWithTags' },
        { key: 'targetDataType', label: '目标数据类型' },
        { key: 'primaryKey', label: '主键', render: 'renderBooleanTag' },
        { key: 'foreignKey', label: '外键', render: 'renderBooleanTag' },
        { key: 'mainTableFk', label: '主表外键' },
        { key: 'needData', label: '是否需要数据' }
      ]
    }
  }
};

export default TableMappingDisplay;
