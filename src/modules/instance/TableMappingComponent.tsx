import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faTable, faEdit, faList, faPlus, faChevronDown, faChevronRight, faTimes, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import AppConfigurableForm from '../../components/AppConfigurableForm';
import { FormConfiguration, FieldConfig, LayoutConfig, FieldType, DataType } from '../../components/AppConfigurableForm';
import dsInfoService from '../../services/crud/dsInfo/dsInfoService';
import rdbTableItemService from '../../services/rdb/tableItem/tableItemService';
import rdbColumnItemService from '../../services/rdb/columnItem/columnItemService';
import esTableItemService from '../../services/es/tableItem/tableItemService';
import esColumnItemService from '../../services/es/columnItem/columnItemService';
import clickhouseTableItemService from '../../services/clickhouse/tableItem/tableItemService';
import clickhouseColumnItemService from '../../services/clickhouse/columnItem/columnItemService';
import dorisTableItemService from '../../services/doris/tableItem/tableItemService';
import dorisColumnItemService from '../../services/doris/columnItem/columnItemService';
import type { MappingColumnParam } from '../../types/common/mapping';
import type { RdbColumnItem, RdbColumnItemParam, RdbColumnItemRequest, RdbColumnItemUpdateParam, RdbColumnItemUpdateRequest } from '../../types/rdb/columnItem/columnItemType';
import type { RdbTableItem, RdbTableItemParam, RdbTableItemRequest, RdbTableItemUpdateParam, RdbTableItemUpdateRequest } from '../../types/rdb/tableItem/tableItemType';
import type { EsColumnItem, EsColumnItemParam, EsColumnItemRequest, EsColumnItemUpdateParam, EsColumnItemUpdateRequest } from '../../types/es/columnItem/columnItemType';
import type { EsTableItem, EsTableItemParam, EsTableItemRequest, EsTableItemUpdateParam, EsTableItemUpdateRequest } from '../../types/es/tableItem/tableItemType';
import type { ClickhouseColumnItem, ClickhouseColumnItemParam, ClickhouseColumnItemRequest, ClickhouseColumnItemUpdateParam, ClickhouseColumnItemUpdateRequest } from '../../types/clickhouse/columnItem/columnItemType';
import type { ClickhouseTableItem, ClickhouseTableItemParam, ClickhouseTableItemRequest, ClickhouseTableItemUpdateParam, ClickhouseTableItemUpdateRequest } from '../../types/clickhouse/tableItem/tableItemType';
import type { DorisColumnItem, DorisColumnItemParam, DorisColumnItemRequest, DorisColumnItemUpdateParam, DorisColumnItemUpdateRequest } from '../../types/doris/columnItem/columnItemType';
import type { DorisTableItem, DorisTableItemParam, DorisTableItemRequest, DorisTableItemUpdateParam, DorisTableItemUpdateRequest } from '../../types/doris/tableItem/tableItemType';
import type { NotificationType } from '../../components/AppNotification';

type ColumnItem = (RdbColumnItem | EsColumnItem | ClickhouseColumnItem | DorisColumnItem) & { _tempId?: string };
type TableItem = Partial<RdbTableItem & EsTableItem & ClickhouseTableItem & DorisTableItem> & { columnItemList?: ColumnItem[] };

type DictOption = {
  key: string;
  value: number | string;
};

type DictData = {
  dsOptions: DictOption[];
  teamOptions?: DictOption[];
  syncTypeOptions?: DictOption[];
  dataTypeOptions: DictOption[];
  esMappingTypeOptions: DictOption[];
};

type MappingData = {
  syncType?: number;
  instanceId?: number;
  mappingJson?: Record<string, unknown>;
};

type TableMappingComponentProps = {
  mappingData?: MappingData | null;
  dictData?: DictData;
  setNotification: (state: { visible: boolean; message: string; type: NotificationType }) => void;
  refreshInstanceData?: () => Promise<void>;
};


/** 
 * 保存表映射的API方法
 */
const saveTableMappingMethods = {
  // RDB保存表映射
  saveRdbTableMappings: async (instanceId, mappingId, tableMappings) => {
    const tableItemList = tableMappings.map(table => ({
      srcDsId: table.srcDsId,
      tableName: table.tableName,
      dbName: table.dbName,
      topic: table.topic,
      primaryKey: table.primaryKey,
      master: table.master,
      otherCondition: table.otherCondition,
      updateTimeColumnName: table.updateTimeColumnName,
      targetTableName: table.targetTableName,
      targetPrimaryKey: table.targetPrimaryKey,
      mappingAll: table.mappingAll,
      needSync: table.needSync,
      orgIdColumnName: table.orgIdColumnName
    })) as RdbTableItemParam[];
    const request: RdbTableItemRequest = { instanceId, mappingId, tableItemList };
    return await rdbTableItemService.insertTableItem(request);
  },

  // RDB更新表映射（单条）
  updateRdbTableMapping: async (tableMapping) => {
    return await saveTableMappingMethods.updateRdbTableMappings([tableMapping]);
  },

  // RDB批量更新表映射
  updateRdbTableMappings: async (tableMappings) => {
    const tableItemList = tableMappings.map(table => ({
      id: table.id,
      srcDsId: table.srcDsId,
      tableName: table.tableName,
      dbName: table.dbName,
      topic: table.topic,
      primaryKey: table.primaryKey,
      master: table.master,
      otherCondition: table.otherCondition,
      updateTimeColumnName: table.updateTimeColumnName,
      targetTableName: table.targetTableName,
      targetPrimaryKey: table.targetPrimaryKey,
      mappingAll: table.mappingAll,
      needSync: table.needSync,
      orgIdColumnName: table.orgIdColumnName
    })) as RdbTableItemUpdateParam[];

    const request: RdbTableItemUpdateRequest = { tableItemList };
    return await rdbTableItemService.updateTableItem(request);
  },

  // RDB删除表映射
  deleteRdbTableMapping: async (ids) => {
    const request = { ids };
    return await rdbTableItemService.deleteTableItem(request);
  },

  // ES保存表映射
  saveEsTableMappings: async (instanceId, mappingId, tableMappings) => {
    const tableItemList = tableMappings.map(table => ({
      srcDsId: table.srcDsId,
      tableName: table.tableName,
      tableNameRegex: table.tableNameRegex,
      shardedCount: table.shardedCount,
      dbName: table.dbName,
      topic: table.topic,
      primaryKey: table.primaryKey,
      master: table.master,
      otherCondition: table.otherCondition,
      updateTimeColumnName: table.updateTimeColumnName,
      type: table.type,
      nestedKey: table.nestedKey,
      delimiter: table.delimiter
    })) as EsTableItemParam[];

    const request: EsTableItemRequest = { instanceId, mappingId, tableItemList };
    return await esTableItemService.insertTableItem(request);
  },

  // ES更新表映射（单条）
  updateEsTableMapping: async (tableMapping) => {
    return await saveTableMappingMethods.updateEsTableMappings([tableMapping]);
  },

  // ES批量更新表映射
  updateEsTableMappings: async (tableMappings) => {
    const tableItemList = tableMappings.map(table => ({
      id: table.id,
      type: table.type,
      nestedKey: table.nestedKey,
      srcDsId: table.srcDsId,
      tableName: table.tableName,
      tableNameRegex: table.tableNameRegex,
      shardedCount: table.shardedCount,
      dbName: table.dbName,
      topic: table.topic,
      primaryKey: table.primaryKey,
      master: table.master,
      otherCondition: table.otherCondition,
      updateTimeColumnName: table.updateTimeColumnName,
      delimiter: table.delimiter
    })) as EsTableItemUpdateParam[];
    const request: EsTableItemUpdateRequest = { tableItemList };
    const result = await esTableItemService.updateTableItem(request);
    return result;
  },

  // ES删除表映射
  deleteEsTableMapping: async (ids) => {
    const request = { ids };
    return await esTableItemService.deleteTableItem(request);
  },

  // ClickHouse保存表映射
  saveCkTableMappings: async (instanceId, mappingId, tableMappings) => {
    const tableItemList = tableMappings.map(table => ({
      srcDsId: table.srcDsId,
      tableName: table.tableName,
      tableNameRegex: table.tableNameRegex,
      shardedCount: table.shardedCount,
      dbName: table.dbName,
      topic: table.topic,
      primaryKey: table.primaryKey,
      master: table.master,
      otherCondition: table.otherCondition,
      updateTimeColumnName: table.updateTimeColumnName,
      clickhouseTableName: table.clickhouseTableName,
      clickhouseDbName: table.clickhouseDbName
    })) as ClickhouseTableItemParam[];

    const request: ClickhouseTableItemRequest = { instanceId, mappingId, tableItemList };
    return await clickhouseTableItemService.insertTableItem(request);
  },

  // ClickHouse更新表映射（单条）
  updateCkTableMapping: async (tableMapping) => {
    return await saveTableMappingMethods.updateCkTableMappings([tableMapping]);
  },

  // ClickHouse批量更新表映射
  updateCkTableMappings: async (tableMappings) => {
    const tableItemList = tableMappings.map(table => ({
      id: table.id,
      srcDsId: table.srcDsId,
      tableName: table.tableName,
      tableNameRegex: table.tableNameRegex,
      shardedCount: table.shardedCount,
      dbName: table.dbName,
      topic: table.topic,
      primaryKey: table.primaryKey,
      master: table.master,
      otherCondition: table.otherCondition,
      updateTimeColumnName: table.updateTimeColumnName,
      clickhouseTableName: table.clickhouseTableName,
      clickhouseDbName: table.clickhouseDbName
    })) as ClickhouseTableItemUpdateParam[];

    const request: ClickhouseTableItemUpdateRequest = { tableItemList };
    return await clickhouseTableItemService.updateTableItem(request);
  },

  // ClickHouse删除表映射
  deleteCkTableMapping: async (ids) => {
    const request = { ids };
    return await clickhouseTableItemService.deleteTableItem(request);
  },

  // Doris保存表映射
  saveDorisTableMappings: async (instanceId, mappingId, tableMappings) => {
    const tableItemList = tableMappings.map(table => ({
      srcDsId: table.srcDsId,
      tableName: table.tableName,
      tableNameRegex: table.tableNameRegex,
      shardedCount: table.shardedCount,
      dbName: table.dbName,
      topic: table.topic,
      primaryKey: table.primaryKey,
      master: table.master,
      otherCondition: table.otherCondition,
      updateTimeColumnName: table.updateTimeColumnName,
      dorisTableName: table.dorisTableName,
      dorisDbName: table.dorisDbName
    })) as DorisTableItemParam[];

    const request: DorisTableItemRequest = { instanceId, mappingId, tableItemList };
    return await dorisTableItemService.insertTableItem(request);
  },

  // Doris更新表映射（单条）
  updateDorisTableMapping: async (tableMapping) => {
    return await saveTableMappingMethods.updateDorisTableMappings([tableMapping]);
  },

  // Doris批量更新表映射
  updateDorisTableMappings: async (tableMappings) => {
    const tableItemList = tableMappings.map(table => ({
      id: table.id,
      srcDsId: table.srcDsId,
      tableName: table.tableName,
      tableNameRegex: table.tableNameRegex,
      shardedCount: table.shardedCount,
      dbName: table.dbName,
      topic: table.topic,
      primaryKey: table.primaryKey,
      master: table.master,
      otherCondition: table.otherCondition,
      updateTimeColumnName: table.updateTimeColumnName,
      dorisTableName: table.dorisTableName,
      dorisDbName: table.dorisDbName
    })) as DorisTableItemUpdateParam[];

    const request: DorisTableItemUpdateRequest = { tableItemList };
    return await dorisTableItemService.updateTableItem(request);
  },

  // Doris删除表映射
  deleteDorisTableMapping: async (ids) => {
    const request = { ids };
    return await dorisTableItemService.deleteTableItem(request);
  }
};

/**
 * 保存列映射的API方法
 */
const saveColumnMappingMethods = {
  // RDB保存列映射
  saveRdbColumnMappings: async (tableId, columnMappings) => {
    const columnItemList = columnMappings.map(column => ({
      srcColumnName: column.srcColumnName,
      srcDataType: column.srcDataType,
      targetColumnName: column.targetColumnName,
      targetDataType: column.targetDataType,
      needData: column.needData,
      foreignKey: column.foreignKey,
      mainTableFk: column.mainTableFk,
      primaryKey: column.primaryKey
    })) as RdbColumnItemParam[];

    const request: RdbColumnItemRequest = { tableItemId: tableId, columnItemList };
    return await rdbColumnItemService.insertColumnItem(request);
  },

  // RDB更新列映射（单条）
  updateRdbColumnMapping: async (columnMapping) => {
    return await saveColumnMappingMethods.updateRdbColumnMappings([columnMapping]);
  },

  // RDB批量更新列映射
  updateRdbColumnMappings: async (columnMappings) => {
    const columnItemList = columnMappings.map(column => ({
      id: column.id,
      srcColumnName: column.srcColumnName,
      srcDataType: column.srcDataType,
      targetColumnName: column.targetColumnName,
      targetDataType: column.targetDataType,
      needData: column.needData,
      foreignKey: column.foreignKey,
      mainTableFk: column.mainTableFk,
      primaryKey: column.primaryKey
    })) as RdbColumnItemUpdateParam[];

    const request: RdbColumnItemUpdateRequest = { columnItemList };
    return await rdbColumnItemService.updateColumnItem(request);
  },

  // RDB删除列映射
  deleteRdbColumnMapping: async (ids) => {
    const request = { ids };
    return await rdbColumnItemService.deleteColumnItem(request);
  },

  // ES保存列映射
  saveEsColumnMappings: async (tableId, columnMappings) => {
    const columnItemList = columnMappings.map(column => ({
      srcColumnName: column.srcColumnName,
      srcDataType: column.srcDataType,
      targetColumnName: column.targetColumnName,
      targetDataType: column.targetDataType,
      needData: column.needData,
      foreignKey: column.foreignKey,
      mainTableFk: column.mainTableFk,
      primaryKey: column.primaryKey,
      columnSql: column.columnSql,
      delimiter: column.delimiter
    })) as EsColumnItemParam[];

    const request: EsColumnItemRequest = { tableItemId: tableId, columnItemList };
    return await esColumnItemService.insertColumnItem(request);
  },

  // ES更新列映射（单条）
  updateEsColumnMapping: async (columnMapping) => {
    return await saveColumnMappingMethods.updateEsColumnMappings([columnMapping]);
  },

  // ES批量更新列映射
  updateEsColumnMappings: async (columnMappings) => {
    const columnItemList = columnMappings.map(column => ({
      id: column.id,
      srcColumnName: column.srcColumnName,
      srcDataType: column.srcDataType,
      targetColumnName: column.targetColumnName,
      targetDataType: column.targetDataType,
      needData: column.needData,
      foreignKey: column.foreignKey,
      mainTableFk: column.mainTableFk,
      primaryKey: column.primaryKey,
      columnSql: column.columnSql,
      delimiter: column.delimiter
    })) as EsColumnItemUpdateParam[];

    const request: EsColumnItemUpdateRequest = { columnItemList };
    return await esColumnItemService.updateColumnItem(request);
  },

  // ES删除列映射
  deleteEsColumnMapping: async (ids) => {
    const request = { ids };
    return await esColumnItemService.deleteColumnItem(request);
  },

  // ClickHouse保存列映射
  saveCkColumnMappings: async (tableId, columnMappings) => {
    const columnItemList = columnMappings.map(column => ({
      srcColumnName: column.srcColumnName,
      srcDataType: column.srcDataType,
      targetColumnName: column.targetColumnName,
      targetDataType: column.targetDataType,
      needData: column.needData,
      foreignKey: column.foreignKey,
      mainTableFk: column.mainTableFk,
      primaryKey: column.primaryKey
    })) as ClickhouseColumnItemParam[];

    const request: ClickhouseColumnItemRequest = { tableItemId: tableId, columnItemList };
    return await clickhouseColumnItemService.insertColumnItem(request);
  },

  // ClickHouse更新列映射（单条）
  updateCkColumnMapping: async (columnMapping) => {
    return await saveColumnMappingMethods.updateCkColumnMappings([columnMapping]);
  },

  // ClickHouse批量更新列映射
  updateCkColumnMappings: async (columnMappings) => {
    const columnItemList = columnMappings.map(column => ({
      id: column.id,
      srcColumnName: column.srcColumnName,
      srcDataType: column.srcDataType,
      targetColumnName: column.targetColumnName,
      targetDataType: column.targetDataType,
      needData: column.needData,
      foreignKey: column.foreignKey,
      mainTableFk: column.mainTableFk,
      primaryKey: column.primaryKey
    })) as ClickhouseColumnItemUpdateParam[];

    const request: ClickhouseColumnItemUpdateRequest = { columnItemList };
    return await clickhouseColumnItemService.updateColumnItem(request);
  },

  // ClickHouse删除列映射
  deleteCkColumnMapping: async (ids) => {
    const request = { ids };
    return await clickhouseColumnItemService.deleteColumnItem(request);
  },

  // Doris保存列映射
  saveDorisColumnMappings: async (tableId, columnMappings) => {
    const columnItemList = columnMappings.map(column => ({
      srcColumnName: column.srcColumnName,
      srcDataType: column.srcDataType,
      targetColumnName: column.targetColumnName,
      targetDataType: column.targetDataType,
      needData: column.needData,
      foreignKey: column.foreignKey,
      mainTableFk: column.mainTableFk,
      primaryKey: column.primaryKey
    })) as DorisColumnItemParam[];

    const request: DorisColumnItemRequest = { tableItemId: tableId, columnItemList };
    return await dorisColumnItemService.insertColumnItem(request);
  },

  // Doris更新列映射（单条）
  updateDorisColumnMapping: async (columnMapping) => {
    return await saveColumnMappingMethods.updateDorisColumnMappings([columnMapping]);
  },

  // Doris批量更新列映射
  updateDorisColumnMappings: async (columnMappings) => {
    const columnItemList = columnMappings.map(column => ({
      id: column.id,
      srcColumnName: column.srcColumnName,
      srcDataType: column.srcDataType,
      targetColumnName: column.targetColumnName,
      targetDataType: column.targetDataType,
      needData: column.needData,
      foreignKey: column.foreignKey,
      mainTableFk: column.mainTableFk,
      primaryKey: column.primaryKey
    })) as DorisColumnItemUpdateParam[];

    const request: DorisColumnItemUpdateRequest = { columnItemList };
    return await dorisColumnItemService.updateColumnItem(request);
  },

  // Doris删除列映射
  deleteDorisColumnMapping: async (ids) => {
    const request = { ids };
    return await dorisColumnItemService.deleteColumnItem(request);
  }
};

/**
 * 批量获取列映射API方法映射
 */
const getMappingAllColumnItemMethods = {
  // RDB保存列映射
  getRdbMappingAllColumn: async (tableName, dsInfoId) => {
    const request: MappingColumnParam = { tableName, dsInfoId };
    return await rdbColumnItemService.getMappingAllColumnItem(request);
  },
  // RDB保存列映射
  getEsMappingAllColumn: async (tableName, dsInfoId) => {
    const request: MappingColumnParam = { tableName, dsInfoId };
    return await esColumnItemService.getMappingAllColumnItem(request);
  },
  // RDB保存列映射
  getCkMappingAllColumn: async (tableName, dsInfoId) => {
    const request: MappingColumnParam = { tableName, dsInfoId };
    return await clickhouseColumnItemService.getMappingAllColumnItem(request);
  },
  // RDB保存列映射
  getDorisMappingAllColumn: async (tableName, dsInfoId) => {
    const request: MappingColumnParam = { tableName, dsInfoId };
    return await dorisColumnItemService.getMappingAllColumnItem(request);
  },
};

/**
 * 表映射组件
 * 用于配置和展示表映射关系
 */
const TableMappingComponent = ({ mappingData, dictData, setNotification, refreshInstanceData }: TableMappingComponentProps) => {
  // 从instanceData中解构所需的数据
  const { syncType, instanceId, mappingJson } = mappingData || {};
  const mappingId = mappingJson && typeof mappingJson === 'object'
    ? Number((mappingJson as { id?: number }).id)
    : undefined;
  const tableItemList = (mappingJson?.tableItemList as TableItem[]) || [];
  const { dsOptions = [], teamOptions, syncTypeOptions, dataTypeOptions = [], esMappingTypeOptions = [] } = dictData || {};
  // 状态定义
  const [tableMappings, setTableMappings] = useState<TableItem[]>([]);
  // 是否打开表窗口
  const [showTableModal, setShowTableModal] = useState(false);
  // 是否为打开新建表窗口
  const [createTable, setCreateTable] = useState(false);
  // 表窗口的loading状态
  const [loading, setLoading] = useState(false);
  // 当前数据源加载的表数据
  const [tablesByDs, setTablesByDs] = useState<string[]>([]);
  // 当前表的下标
  const [currentTableIndex, setCurrentTableIndex] = useState(-1);
  // 当前表数据
  const [currentTable, setCurrentTable] = useState<Partial<TableItem>>({});
  // 表信息展开状态
  const [expandedTables, setExpandedTables] = useState({});
  // 单个列编辑状态
  const [editColumnIndex, setEditColumnIndex] = useState({});
  // 新增列按钮的防抖设计
  const lastAddTimeRef = useRef(0);

  // 监听instanceData变化，加载已有映射数据
  useEffect(() => {
    if (instanceId) {
      loadExistingMappings();
    }
  }, [instanceId, syncType]);


  // === API调用 ===
  /**
   * 加载已有映射数据
   */
  const loadExistingMappings = async () => {
    try {
      setLoading(true);
      console.log('加载映射关系...', mappingData);
      // 优先使用传入的instanceData中的映射数据
      if (tableItemList && tableItemList.length > 0) {
        setTableMappings(tableItemList);
      }
    } catch (error) {
      console.error('加载映射关系失败:', error);
      setNotification({ visible: true, message: '加载映射关系失败', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * 根据数据源获取表列表
   * @param {string} dsId - 数据源ID
   */
  const fetchTablesByDs = async (dsId: number | string) => {
    if (!dsId) {
      return;
    }
    try {
      const response = await dsInfoService.queryTablesByDsId({ id: Number(dsId) });
      setTablesByDs(response.data || []);
    } catch (error) {
      console.error('获取表列表失败:', error);
      setNotification({ visible: true, message: '获取表列表失败', type: 'error' });
    }
  };

  // === 映射配置 ===
  /**
   * 格式化已有映射数据
   * @param {Array} mappings - 原始映射数据
   * @returns {Array} 格式化后的映射数据
   */

  /**
   * 创建表字段配置
   */
  const createTableFields = (createTable) => {
    const fields = [];
    // 通用字段
    fields.push(
      new FieldConfig({
        name: 'instanceId',
        label: '实例id',
        type: FieldType.NUMBER,
        defaultValue: instanceId || '',
        hidden: true,
        required: true
      }),
      new FieldConfig({
        name: 'srcDsId',
        label: '源数据源ID',
        type: FieldType.SELECT,
        dataType: DataType.NUMBER,
        required: true,
        defaultValue: currentTable?.srcDsId || '',
        tips: '请选择数据源',
        options: dsOptions,
        disabled: Boolean(currentTable?.srcDsId) && !createTable,
        onFieldChange: (fieldName, value, formData) => {
          setCurrentTable(prev => ({ ...prev, srcDsId: value?.value || '', dbName: value?.key || '' }));
          fetchTablesByDs(value?.value || null);
        }
      }),
      new FieldConfig({
        name: 'tableName',
        label: '表名',
        type: currentTable.tableName ? FieldType.TEXT : FieldType.SELECT,
        required: true,
        defaultValue: currentTable?.tableName || '',
        tips: '',
        disabled: !currentTable?.srcDsId || Boolean(currentTable?.tableName),
        options: tablesByDs.map(table => ({ label: table, value: table }))
      }),
      new FieldConfig({
        name: 'master',
        label: '主表',
        type: FieldType.SELECT,
        dataType: DataType.BOOLEAN,
        required: true,
        defaultValue: Boolean(currentTable?.master),
        tips: '是否为主表，一个实例只能有一个主表',
        options: [
          { value: true, label: '是' },
          { value: false, label: '否' }
        ]
      }),
      new FieldConfig({
        name: 'dbName',
        label: '数据库名',
        type: FieldType.TEXT,
        required: false,
        hidden: true,
        defaultValue: currentTable?.dbName || '',
        tips: '',
        disabled: Boolean(currentTable?.srcDsId)
      }),
      new FieldConfig({
        name: 'topic',
        label: '监听topic',
        type: FieldType.TEXT,
        required: true,
        defaultValue: currentTable?.topic || '',
        tips: ''
      }),
      new FieldConfig({
        name: 'tableNameRegex',
        label: '表名正则',
        type: FieldType.TEXT,
        required: false,
        defaultValue: currentTable?.tableNameRegex || '',
        tips: ''
      }),
      new FieldConfig({
        name: 'shardedCount',
        label: '水平分表数量',
        type: FieldType.NUMBER,
        dataType: DataType.NUMBER,
        required: false,
        defaultValue: currentTable?.shardedCount || 0,
        tips: '水平分表场景'
      }),
      new FieldConfig({
        name: 'primaryKey',
        label: '主键',
        type: FieldType.TEXT,
        required: true,
        defaultValue: currentTable?.primaryKey || 'id',
        tips: ''
      }),
      new FieldConfig({
        name: 'otherCondition',
        label: '其他条件',
        type: FieldType.TEXT,
        required: false,
        defaultValue: currentTable?.otherCondition || '',
        tips: ''
      }),
      new FieldConfig({
        name: 'updateTimeColumnName',
        label: '更新时间列名',
        type: FieldType.TEXT,
        required: false,
        defaultValue: currentTable?.updateTimeColumnName || 'update_time',
        tips: ''
      })
    );

    // 根据同步类型添加特定字段
    if (syncType === 1) { // RDB
      fields.push(
        new FieldConfig({
          name: 'targetTableName',
          label: '目标表名',
          type: FieldType.TEXT,
          required: false,
          defaultValue: currentTable?.targetTableName || currentTable?.tableName || '',
          tips: ''
        }),
        new FieldConfig({
          name: 'targetPrimaryKey',
          label: '目标表主键',
          type: FieldType.TEXT,
          required: false,
          defaultValue: currentTable?.targetPrimaryKey || 'id',
          tips: ''
        }),
        new FieldConfig({
          name: 'mappingAll',
          label: '映射所有字段',
          type: FieldType.SELECT,
          options: [
            { value: true, key: '是' },
            { value: false, key: '否' }
          ],
          dataType: DataType.BOOLEAN,
          required: false,
          defaultValue: Boolean(currentTable?.mappingAll),
          tips: ''
        }),
        new FieldConfig({
          name: 'needSync',
          label: '需要同步',
          type: FieldType.SELECT,
          options: [
            { value: true, key: '是' },
            { value: false, key: '否' }
          ],
          dataType: DataType.BOOLEAN,
          required: false,
          defaultValue: currentTable?.needSync != null ? Boolean(currentTable.needSync) : true,
          tips: ''
        }),
        new FieldConfig({
          name: 'orgIdColumnName',
          label: 'orgId字段名',
          type: FieldType.TEXT,
          required: true,
          defaultValue: currentTable?.orgIdColumnName || 'org_id',
          tips: ''
        })
      );
    } else if (syncType === 2) { // ES
      fields.push(
        new FieldConfig({
          name: 'type',
          label: '映射类型',
          type: FieldType.SELECT,
          dataType: DataType.NUMBER,
          required: true,
          defaultValue: currentTable?.type || 1,
          tips: '',
          options: esMappingTypeOptions
        }),
        new FieldConfig({
          name: 'nestedKey',
          label: 'nested字段名',
          type: FieldType.TEXT,
          required: false,
          defaultValue: currentTable?.nestedKey || '',
          tips: ''
        }),
        new FieldConfig({
          name: 'delimiter',
          label: '连接符',
          type: FieldType.TEXT,
          required: false,
          defaultValue: currentTable?.delimiter || '',
          tips: ''
        })
      );
    } else if (syncType === 3) { // ClickHouse
      fields.push(
        new FieldConfig({
          name: 'clickhouseTableName',
          label: 'ClickHouse表名',
          type: FieldType.TEXT,
          required: true,
          defaultValue: currentTable?.clickhouseTableName || '',
          tips: ''
        }),
        new FieldConfig({
          name: 'clickhouseDbName',
          label: 'ClickHouse数据库名',
          type: FieldType.TEXT,
          required: true,
          defaultValue: currentTable?.clickhouseDbName || '',
          tips: ''
        })
      );
    } else if (syncType === 6) { // Doris
      fields.push(
        new FieldConfig({
          name: 'dorisTableName',
          label: 'Doris表名',
          type: FieldType.TEXT,
          required: true,
          defaultValue: currentTable?.dorisTableName || '',
          tips: ''
        }),
        new FieldConfig({
          name: 'dorisDbName',
          label: 'Doris数据库名',
          type: FieldType.TEXT,
          required: true,
          defaultValue: currentTable?.dorisDbName || '',
          tips: ''
        })
      );
    }
    return fields;
  };

  /**
 * 创建列映射字段配置
 */
  const createColumnFields = () => {
    const fields = [
      new FieldConfig({
        name: 'srcColumnName',
        label: '源列名',
        type: FieldType.TEXT,
        dataType: DataType.STRING,
        required: true,
      }),
      new FieldConfig({
        name: 'srcDataType',
        label: '源数据类型',
        type: FieldType.SELECT,
        options: dataTypeOptions,
        dataType: DataType.NUMBER,
        required: true,
      }),
      new FieldConfig({
        name: 'targetColumnName',
        label: '目标列名',
        type: FieldType.TEXT,
        dataType: DataType.STRING,
        required: true,
      }),
      new FieldConfig({
        name: 'targetDataType',
        label: '目标数据类型',
        type: FieldType.SELECT,
        options: dataTypeOptions,
        dataType: DataType.NUMBER,
        required: true,
      }),
      new FieldConfig({
        name: 'primaryKey',
        label: '主键',
        type: FieldType.CHECKBOX,
        dataType: DataType.BOOLEAN,
        required: false,
      }),
      new FieldConfig({
        name: 'foreignKey',
        label: '外键',
        type: FieldType.CHECKBOX,
        dataType: DataType.BOOLEAN,
        required: false,
      }),
      new FieldConfig({
        name: 'mainTableFk',
        label: '主表外键',
        type: FieldType.TEXT,
        dataType: DataType.STRING,
        required: false,
      }),
      new FieldConfig({
        name: 'needData',
        label: '需要数据',
        type: FieldType.CHECKBOX,
        defaultValue: true,
        dataType: DataType.BOOLEAN,
        required: false,
      }),
    ];

    // 根据同步类型添加特定字段
    if (syncType === 2) {
      fields.push(
        new FieldConfig({
          name: 'columnSql',
          label: '字段查询SQL',
          type: FieldType.TEXT,
          dataType: DataType.STRING,
          required: false,
        }),
        new FieldConfig({
          name: 'delimiter',
          label: '字段分隔符',
          type: FieldType.TEXT,
          dataType: DataType.STRING,
          required: false,
        })
      );
    }

    return fields;
  };

  // === 监听事件 ===
  /**
   * 打开表编辑弹窗
   * @param {number} tableIndex - 表索引
   * @param {Object} tableData - 表数据
   */
  const openTableModal = (tableIndex = -1, tableData = null, create = false) => {
    setCurrentTableIndex(tableIndex);

    if (tableIndex >= 0 && tableData && !create) {
      setCurrentTable({ ...tableData });
    } else {
      setCurrentTable({});
    }
    // 设置表弹窗状态（新建/编辑）
    setCreateTable(create);
    // 打开表弹窗
    setShowTableModal(true);
  };

  /**
   * 关闭表编辑弹窗
   */
  const closeTableModal = () => {
    setShowTableModal(false);
    setCurrentTableIndex(-1);
    setTablesByDs([]);
  };

  /**
   * 保存表信息
   * @param {Event} e - 事件对象
   * @param {Object} formData - 表单数据
   */
  const saveTableInfo = async (e, formData) => {
    try {
      setLoading(true);
      // 调用接口
      let response = null;

      // 更新现有表信息
      if (currentTableIndex >= 0) {
        switch (syncType) {
          case 1: // RDB
            response = await saveTableMappingMethods.updateRdbTableMapping(formData);
            break;
          case 2: // ES
            response = await saveTableMappingMethods.updateEsTableMapping(formData);
            break;
          case 3: // ClickHouse
            response = await saveTableMappingMethods.updateCkTableMapping(formData);
            break;
          case 6: // Doris
            response = await saveTableMappingMethods.updateDorisTableMapping(formData);
            break;
          default:
            throw new Error(`不支持的同步类型: ${syncType}`);
        }
        // API成功后再更新本地状态
        if (response.code === 200) {
          // 处理主表字段
          if (formData.master === true) {
            // 如果当前是编辑模式且设置为主表，需要更新其他表的主表状态
            setTableMappings(prev =>
              prev.map((table, i) => ({ ...table, master: i === currentTableIndex }))
            );
          } else {
            // 普通更新
            setTableMappings(prev => {
              const newTableMappings = [...prev];
              newTableMappings[currentTableIndex] = { ...newTableMappings[currentTableIndex], ...formData };
              return newTableMappings;
            });
          }
        }

      } else {
        // 新增表 - 添加必要的默认属性
        const newTableData = {
          ...formData,
          columnItemList: [] // 确保新增表有列映射列表
        };
        if (!instanceId) {
          throw new Error('缺少实例ID');
        }
        if (!mappingId) {
          throw new Error('缺少映射ID');
        }
        switch (syncType) {
          case 1: // RDB
            response = await saveTableMappingMethods.saveRdbTableMappings(instanceId, mappingId, [newTableData]);
            break;
          case 2: // ES
            response = await saveTableMappingMethods.saveEsTableMappings(instanceId, mappingId, [newTableData]);
            break;
          case 3: // ClickHouse
            response = await saveTableMappingMethods.saveCkTableMappings(instanceId, mappingId, [newTableData]);
            break;
          case 6: // Doris
            response = await saveTableMappingMethods.saveDorisTableMappings(instanceId, mappingId, [newTableData]);
            break;
          default:
            throw new Error(`不支持的同步类型: ${syncType}`);
        }
        // API成功后再更新本地状态
        if (response.code === 200) {
          const savedTableData = response.data && response.data[0] ?
            { ...newTableData, ...response.data[0] } : newTableData;
          setTableMappings(prev => [...prev, savedTableData]);
        }
      }

      if (response.code === 200) {
        closeTableModal();
        setNotification({ visible: true, message: '保存成功', type: 'success' });
        // 如果有刷新实例数据的回调，调用它
        if (refreshInstanceData && typeof refreshInstanceData === 'function') {
          await refreshInstanceData();
        }
      } else {
        throw new Error(response.msg || '保存表信息失败');
      }
    } catch (error) {
      handleError(error, '保存表信息失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 删除表映射
   * @param {number} index - 表索引
   */
  const removeTableMapping = async (index) => {
    try {
      // 检查主表约束
      if (tableMappings[index].master && tableMappings.length > 1) {
        setNotification({ visible: true, message: '主表不能删除，请先将其他表设为主表', type: 'warning' });
        return;
      }

      // 确认删除
      if (!window.confirm('确定要删除该表映射吗？此操作将同时删除相关的列映射。')) {
        return;
      }

      setLoading(true);
      const table = tableMappings[index];

      // 只有已保存的表（有id）才需要调用API删除
      if (table.id) {
        let response = null;
        switch (syncType) {
          case 1: // RDB
            response = await saveTableMappingMethods.deleteRdbTableMapping([table.id]);
            break;
          case 2: // ES
            response = await saveTableMappingMethods.deleteEsTableMapping([table.id]);
            break;
          case 3: // ClickHouse
            response = await saveTableMappingMethods.deleteCkTableMapping([table.id]);
            break;
          case 6: // Doris
            response = await saveTableMappingMethods.deleteDorisTableMapping([table.id]);
            break;
          default:
            throw new Error(`不支持的同步类型: ${syncType}`);
        }

        // 检查删除结果
        if (response.code !== 200) {
          throw new Error(response.msg || '删除表映射失败');
        }
      }

      // 本地状态更新 - 从本地状态中删除表映射
      setTableMappings(prev => prev.filter((_, i) => i !== index));

      setNotification({ visible: true, message: '删除表映射成功', type: 'success' });

      // 如果有刷新实例数据的回调，调用它
      if (refreshInstanceData && typeof refreshInstanceData === 'function') {
        refreshInstanceData();
      }

    } catch (error) {
      handleError(error, '删除表映射失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 添加列映射
   * @param {number} tableIndex - 表索引
   */
  const addColumnMapping = useCallback((tableIndex) => {
    // 防止重复点击
    const now = Date.now();
    if (lastAddTimeRef.current && now - lastAddTimeRef.current < 300) {
      return;
    }
    lastAddTimeRef.current = now;

    // 生成高唯一性的临时ID
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substr(2, 16);
    const counter = Math.floor(Math.random() * 1000);
    const newColumn = {
      _tempId: `temp_${timestamp}_${randomStr}_${counter}`
    };

    console.log('添加新列:', newColumn);

    setTableMappings(prev => {
      const newTableMappings = [...prev];
      newTableMappings[tableIndex] = {
        ...newTableMappings[tableIndex],
        columnItemList: [...(newTableMappings[tableIndex].columnItemList || []), newColumn]
      };
      return newTableMappings;
    });
  }, []);

  /**
   * 批量新增列映射
   * @param {number} tableIndex - 表索引
   */
  const batchAddColumnMapping = async (tableIndex) => {
    try {
      setLoading(true);
      const table = tableMappings[tableIndex];
      let response = null;
      switch (syncType) {
        case 1: // RDB
          response = await getMappingAllColumnItemMethods.getRdbMappingAllColumn(table.tableName, table.srcDsId);
          break;
        case 2: // ES
          response = await getMappingAllColumnItemMethods.getEsMappingAllColumn(table.tableName, table.srcDsId);
          break;
        case 3: // ClickHouse
          response = await getMappingAllColumnItemMethods.getCkMappingAllColumn(table.tableName, table.srcDsId);
          break;
        case 6: // Doris
          response = await getMappingAllColumnItemMethods.getDorisMappingAllColumn(table.tableName, table.srcDsId);
          break;
        default:
          throw new Error(`不支持的同步类型: ${syncType}`);
      }

      if (response.code === 200 && response.data && Array.isArray(response.data)) {
        // 获取现有的列名，用于去重
        const existingColumnNames = new Set(
          (table.columnItemList || []).map(col => col.srcColumnName).filter(Boolean)
        );

        // 过滤掉已存在的列，并为新列生成唯一ID
        const newColumns = response.data
          .filter(column => !existingColumnNames.has(column.srcColumnName))
          .map((column, index) => ({
            ...column,
            // 确保每个新列都有唯一标识
            _tempId: `batch_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 16)}`,
            needData: true
          }));

        if (newColumns.length === 0) {
          setNotification({ visible: true, message: '所有列已存在，没有新列需要添加', type: 'info' });
          return;
        }

        setTableMappings(prev => {
          const newTableMappings = [...prev];
          newTableMappings[tableIndex] = {
            ...newTableMappings[tableIndex],
            columnItemList: [...(newTableMappings[tableIndex].columnItemList || []), ...newColumns]
          };
          return newTableMappings;
        });

        setNotification({
          visible: true,
          message: `成功添加 ${newColumns.length} 个列映射`,
          type: 'success'
        });
      } else {
        throw new Error('批量添加列映射失败，返回数据格式不正确');
      }
    } catch (error) {
      handleError(error, '批量添加列映射失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 保存全部列映射
   * @param {number} tableIndex - 表索引
   */
  const saveAllColumnMappings = async (tableIndex) => {
    try {
      if (!window.confirm('确定保存全部列映射吗？')) {
        return;
      }
      setLoading(true);
      const table = tableMappings[tableIndex];
      const columnItems = table.columnItemList || [];
      if (columnItems.length === 0) {
        setNotification({ visible: true, message: '没有列映射需要保存', type: 'warning' });
        return;
      }
      // 检测重复列数据（仅看是否有相同列name）
      const columnNameSet = new Set();
      const duplicateColumns = [];

      columnItems.forEach(column => {
        if (columnNameSet.has(column.srcColumnName)) {
          duplicateColumns.push(column.srcColumnName);
        } else {
          columnNameSet.add(column.srcColumnName);
        }
      });

      if (duplicateColumns.length > 0) {
        setNotification({
          visible: true,
          message: `发现重复列名: ${duplicateColumns.join(', ')}，请先处理重复数据`,
          type: 'warning'
        });
        return;
      }

      // 更新或新增
      const insertColumnList = [];
      const updateColumnList = [];
      for (const column of columnItems) {
        if (column.id) {
          updateColumnList.push(column);
        } else {
          insertColumnList.push(column);
        }
      }
      let updateResponse = null;
      let insertResponse = null;
      switch (syncType) {
        case 1: // RDB
          if (insertColumnList.length > 0) {
            insertResponse = await saveColumnMappingMethods.saveRdbColumnMappings(table.id, insertColumnList);
          }
          if (updateColumnList.length > 0) {
            updateResponse = await saveColumnMappingMethods.updateRdbColumnMappings(updateColumnList);
          }
          break;
        case 2: // ES
          if (insertColumnList.length > 0) {
            insertResponse = await saveColumnMappingMethods.saveEsColumnMappings(table.id, insertColumnList);
          }
          if (updateColumnList.length > 0) {
            updateResponse = await saveColumnMappingMethods.updateEsColumnMappings(updateColumnList);
          }
          break;
        case 3: // ClickHouse
          if (insertColumnList.length > 0) {
            insertResponse = await saveColumnMappingMethods.saveCkColumnMappings(table.id, insertColumnList);
          }
          if (updateColumnList.length > 0) {
            updateResponse = await saveColumnMappingMethods.updateCkColumnMappings(updateColumnList);
          }
          break;
        case 6: // Doris
          if (insertColumnList.length > 0) {
            insertResponse = await saveColumnMappingMethods.saveDorisColumnMappings(table.id, insertColumnList);
          }
          if (updateColumnList.length > 0) {
            updateResponse = await saveColumnMappingMethods.updateDorisColumnMappings(updateColumnList);
          }
          break;
        default:
          throw new Error(`不支持的同步类型: ${syncType}`);
      }

      // 更新/新增是否成功
      const updateSuccess = !updateResponse || updateResponse.code === 200;
      const insertSuccess = !insertResponse || insertResponse.code === 200;

      if (updateSuccess && insertSuccess) {
        // 更新新增列的ID（只有在有新增数据时才更新）
        if (insertResponse?.data && insertResponse.data.length > 0) {
          setTableMappings(prev => {
            const newTableMappings = [...prev];
            const currentTable = { ...newTableMappings[tableIndex] };
            const insertDataMap = new Map();

            // 创建ID映射，确保按名称匹配
            insertResponse.data.forEach(item => {
              insertDataMap.set(item.srcColumnName, item.id);
            });

            // 更新新增列的ID，使用srcColumnName作为匹配依据
            currentTable.columnItemList = currentTable.columnItemList.map(col => {
              if (!col.id && insertDataMap.has(col.srcColumnName)) {
                return { ...col, id: insertDataMap.get(col.srcColumnName) };
              }
              return col;
            });

            newTableMappings[tableIndex] = currentTable;
            return newTableMappings;
          });
        }

        // 显示成功消息，包含具体操作数量
        const updateCount = updateColumnList.length;
        const insertCount = insertColumnList.length;
        let successMsg = '保存全部列映射成功！';
        if (updateCount > 0 && insertCount > 0) {
          successMsg = `成功更新 ${updateCount} 列，新增 ${insertCount} 列`;
        } else if (updateCount > 0) {
          successMsg = `成功更新 ${updateCount} 列`;
        } else if (insertCount > 0) {
          successMsg = `成功新增 ${insertCount} 列`;
        }
        // 显示成功消息
        setNotification({ visible: true, message: successMsg, type: 'success' });

        // 直接强制退出编辑状态
        toggleAllColumnsEdit(tableIndex, false);
      } else {
        // 处理错误情况
        let errorMsg = '';
        if (!updateSuccess && !insertSuccess) {
          // 两者都失败
          errorMsg = updateResponse?.msg || insertResponse?.msg || '保存&更新全部列映射失败';
        } else if (!updateSuccess && updateColumnList.length > 0) {
          // 更新失败
          errorMsg = updateResponse?.msg || '更新全部列映射失败';
        } else if (!insertSuccess && insertColumnList.length > 0) {
          // 新增失败
          errorMsg = insertResponse?.msg || '新增全部列映射失败';
        }

        if (errorMsg) {
          throw new Error(errorMsg);
        }
      }
    } catch (error) {
      handleError(error, '保存全部列映射失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 保存单列映射
   * @param {number} tableIndex - 表索引
   * @param {number} columnIndex - 列索引
   */
  const saveSingleColumnMapping = async (tableIndex, columnIndex) => {
    try {
      setLoading(true);
      const table = tableMappings[tableIndex];
      const column = table.columnItemList[columnIndex];
      let response = null;
      // 区分是新增还是更新
      if (column.id) {
        // 更新情况
        switch (syncType) {
          case 1: // RDB
            response = await saveColumnMappingMethods.updateRdbColumnMapping(column);
            break;
          case 2: // ES
            response = await saveColumnMappingMethods.updateEsColumnMapping(column);
            break;
          case 3: // ClickHouse
            response = await saveColumnMappingMethods.updateCkColumnMapping(column);
            break;
          case 6: // Doris
            response = await saveColumnMappingMethods.updateDorisColumnMapping(column);
            break;
          default:
            throw new Error(`不支持的同步类型: ${syncType}`);
        }
      } else {
        // 新增情况
        switch (syncType) {
          case 1: // RDB
            response = await saveColumnMappingMethods.saveRdbColumnMappings(table.id, [column]);
            break;
          case 2: // ES
            response = await saveColumnMappingMethods.saveEsColumnMappings(table.id, [column]);
            break;
          case 3: // ClickHouse
            response = await saveColumnMappingMethods.saveCkColumnMappings(table.id, [column]);
            break;
          case 6: // Doris
            response = await saveColumnMappingMethods.saveDorisColumnMappings(table.id, [column]);
            break;
          default:
            throw new Error(`不支持的同步类型: ${syncType}`);
        }
      }
      if (response.code === 200) {
        // 更新本地状态中该列的ID（如果是新增列）
        if (!column.id && response.data && response.data[0]) {
          setTableMappings(prev => {
            const newTableMappings = [...prev];
            newTableMappings[tableIndex].columnItemList[columnIndex] = {
              ...column,
              id: response.data[0].id
            };
            return newTableMappings;
          });
        }
        setNotification({ visible: true, message: '保存列映射成功', type: 'success' });
        // 退出该列的编辑状态
        setEditColumnIndex(prev => ({
          ...prev,
          [`${tableIndex}-${columnIndex}`]: false
        }));
      } else {
        throw new Error(response.msg || '保存列映射失败');
      }
    } catch (error) {
      handleError(error, '保存列映射失败');
    } finally {
      setLoading(false);
    }
  };

  /**
 * 删除列映射
 * @param {number} tableIndex - 表索引
 * @param {number} columnIndex - 列索引
*/
  const removeColumnMapping = async (tableIndex, columnIndex) => {
    // 弹窗确认
    if (!window.confirm('确定要删除该列映射吗？')) {
      return;
    }

    try {
      const column = tableMappings[tableIndex].columnItemList[columnIndex];
      // 只有有id的列才调用API删除（新增未保存的列不需要）
      if (column.id) {
        let response = null;
        switch (syncType) {
          case 1: // RDB
            response = await saveColumnMappingMethods.deleteRdbColumnMapping([column.id]);
            break;
          case 2: // ES
            response = await saveColumnMappingMethods.deleteEsColumnMapping([column.id]);
            break;
          case 3: // ClickHouse
            response = await saveColumnMappingMethods.deleteCkColumnMapping([column.id]);
            break;
          case 6: // Doris
            response = await saveColumnMappingMethods.deleteDorisColumnMapping([column.id]);
            break;
        }
      }

      // 更新本地状态
      setTableMappings(prev => {
        const newTableMappings = [...prev];
        newTableMappings[tableIndex].columnItemList = newTableMappings[tableIndex].columnItemList.filter(
          (_, i) => i !== columnIndex
        );
        return newTableMappings;
      });
      setNotification({ visible: true, message: '删除列映射成功', type: 'success' });
    } catch (error) {
      handleError(error, '删除列映射失败');
    }
  };


  /**
   * 取消列编辑
   * @param {number} tableIndex - 表索引
   * @param {number} columnIndex - 列索引
   */
  const cancelColumnEdit = (tableIndex, columnIndex) => {
    setEditColumnIndex(prev => ({
      ...prev,
      [`${tableIndex}-${columnIndex}`]: false
    }));
  };

  /**
   * 进入列编辑状态
   * @param {number} tableIndex - 表索引
   * @param {number} columnIndex - 列索引
   */
  const startColumnEdit = (tableIndex, columnIndex) => {
    setEditColumnIndex(prev => ({
      ...prev,
      [`${tableIndex}-${columnIndex}`]: true
    }));
  };

  // 判断表是否批量列编辑模式
  const isBatchEditing = (tableIndex) => {
    return Object.keys(editColumnIndex).some(key => key.startsWith(`${tableIndex}-`));
  };

  /**
   * 表中全部列进入/退出编辑状态
   * @param {number} tableIndex - 表索引
   */
  const toggleAllColumnsEdit = (tableIndex, enterEdit?: boolean) => {
    const currentlyEditing = isBatchEditing(tableIndex);
    const shouldEnterEdit = enterEdit !== undefined ? enterEdit : !currentlyEditing;

    if (shouldEnterEdit) {
      // 进入编辑模式
      const table = tableMappings[tableIndex];
      const newEditState = { ...editColumnIndex };

      table.columnItemList.forEach((_, columnIndex) => {
        newEditState[`${tableIndex}-${columnIndex}`] = true;
      });

      setEditColumnIndex(newEditState);
    } else {
      // 退出编辑模式
      setEditColumnIndex(prev => {
        const newEditState = { ...prev };
        Object.keys(newEditState).forEach(key => {
          if (key.startsWith(`${tableIndex}-`)) {
            delete newEditState[key];
          }
        });
        return newEditState;
      });
    }
  };



  /**
   * 处理列映射字段变化
   * @param {number} tableIndex - 表索引
   * @param {number} columnIndex - 列索引
   * @param {object} fieldConfig - 字段配置
   * @param {any} value - 字段值
   */
  const handleColumnMappingChange = (tableIndex, columnIndex, fieldConfig, value) => {
    const key = fieldConfig.name;
    // 字段数据类型转化
    if (fieldConfig?.dataType && value !== '') {
      switch (fieldConfig.dataType) {
        case DataType.NUMBER:
          value = Number(value);
          break;
        case DataType.BOOLEAN:
          // 支持多种类型的输入值转换为布尔值
          if (typeof value === 'string') {
            // 处理字符串值
            value = value.toLowerCase() === 'true' || value === '1';
          } else if (typeof value === 'number') {
            // 处理数字值
            value = value === 1;
          }
          break;
        case DataType.DATE:
          value = new Date(value).toISOString().slice(0, 19).replace('T', ' ');
          break;
        default:
          break;
      }
    }

    setTableMappings(prev => {
      // 创建新的表映射数组
      const newTableMappings = [...prev];
      // 创建新的列项数组
      const newColumnItemList = [...newTableMappings[tableIndex].columnItemList];
      // 创建新的列对象并更新值
      newColumnItemList[columnIndex] = {
        ...newColumnItemList[columnIndex],
        [key]: value
      };
      // 更新表的列项列表
      newTableMappings[tableIndex] = {
        ...newTableMappings[tableIndex],
        columnItemList: newColumnItemList
      };
      return newTableMappings;
    });
  };

  /**
   * 切换表展开/折叠状态
   * @param {string} tableId - 表ID
   */
  const toggleTableExpansion = (tableId) => {
    setExpandedTables(prev => ({
      ...prev,
      [tableId]: !prev[tableId]
    }));
  };

  // 失败处理工具函数
  const handleError = (error, defaultMessage) => {
    console.error(defaultMessage, error);
    setNotification({
      visible: true,
      message: defaultMessage && error?.message
        ? `${defaultMessage}: ${error.message}`
        : defaultMessage || error?.message || '未知错误',
      type: 'error'
    });
  };

  // === 渲染函数 ===
  /**
   * 渲染表编辑弹窗
   */
  const renderTableModal = () => {
    if (!showTableModal) return null;
    const formConfig = new FormConfiguration({
      fields: createTableFields(createTable),
      dictData: dictData,
      layout: new LayoutConfig({ fieldsPerRow: 2, layoutType: 'grid' }),
      initialData: createTable ? {} : currentTable,
      submitConfig: {
        text: '保存',
        show: true,
        onClick: saveTableInfo,
        props: { disabled: loading }
      },
      cancelConfig: {
        text: '取消',
        show: true,
        onClick: closeTableModal
      },
      loading: loading,
      disabled: loading
    });
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">{currentTableIndex >= 0 ? '编辑表信息' : '新增表信息'}</h2>
            <button
              type="button"
              onClick={closeTableModal}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {/* 提示信息 */}
            {!currentTable.srcDsId && (
              <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-sm text-blue-700">
                请先选择数据源，再选择表名
              </div>
            )}

            {/* 使用 AppConfigurableForm 组件渲染表单 */}
            <AppConfigurableForm formConfiguration={formConfig} />
          </div>
        </div>
      </div>
    );
  };

  /**
   * 渲染表映射列表
   */
  const renderTableMappings = () => {
    // 创建列字段配置
    const columnFields = createColumnFields();

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">映射关系</h3>
          <button
            type="button"
            onClick={() => openTableModal(-1, null, true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={!syncType}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            新增表映射
          </button>
        </div>

        {tableMappings.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            <FontAwesomeIcon icon={faList} className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">暂无表信息，点击上方按钮添加</p>
          </div>
        ) : (
          tableMappings.map((table, tableIndex) => {
            const tableKey = String(table.id ?? table.tableName ?? tableIndex);
            return (
            <div key={tableKey} className="border border-gray-200 rounded-lg overflow-hidden mb-4">
              {/* 表信息头部 */}
              <div
                className="bg-gray-50 p-4 cursor-pointer"
                onClick={() => toggleTableExpansion(tableKey)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon
                      icon={expandedTables[tableKey] ? faChevronDown : faChevronRight}
                      className="h-5 w-5 text-gray-500"
                    />
                    <h4 className="font-medium text-gray-800">{table.tableName}</h4>
                    {table.master && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        主表
                      </span>
                    )}
                    {table.tableNameRegex && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                        水平分表 ({table.shardedCount || 'N'})
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTableModal(tableIndex, table);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faSave} className="mr-1" />
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTableMapping(tableIndex);
                      }}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      删除
                    </button>
                  </div>
                </div>
              </div>

              {expandedTables[tableKey] && (

                <div className="p-4">
                  {/* 表映射信息区域 */}

                  {/* 列映射操作按钮区域 */}
                  <div className="flex flex-wrap justify-between items-center mb-4">

                    <div className="mt-2 md:mt-0 flex space-x-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addColumnMapping(tableIndex);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                        新增列
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          batchAddColumnMapping(tableIndex);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faList} className="mr-1" />
                        批量新增
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveAllColumnMappings(tableIndex);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faSave} className="mr-1" />
                        保存全部列
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAllColumnsEdit(tableIndex);
                        }}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-1" />
                        {isBatchEditing(tableIndex) ? '取消编辑' : '批量编辑'}
                      </button>
                    </div>
                  </div>

                  {/* 列映射列表 */}
                  {table.columnItemList && table.columnItemList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {/* 使用配置化字段渲染表头 */}
                            {columnFields.map((field, index) => (
                              <th key={index} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {field.label}
                              </th>
                            ))}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(table.columnItemList as ColumnItem[]).map((column, columnIndex) => {
                            const isEditing = editColumnIndex[`${tableIndex}-${columnIndex}`] || false;
                            return (
                              <tr key={column.id ?? column._tempId ?? columnIndex}>
                                {/* 使用配置化字段渲染单元格 */}
                                {columnFields.map((field, fieldIndex) => {
                                  const fieldValue = column[field.name] || '';
                                  // 从根据DataType判断改为根据FieldType判断
                                  const fieldType = field.type;

                                  if (isEditing) {
                                    // 编辑模式 - 根据FieldType渲染不同的表单控件
                                    if (fieldType === FieldType.CHECKBOX) {
                                      // 复选框类型
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          <input
                                            type="checkbox"
                                            checked={fieldValue || false}
                                            onChange={(e) => handleColumnMappingChange(tableIndex, columnIndex, field, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                          />
                                        </td>
                                      );
                                    } else if (fieldType === FieldType.SELECT) {
                                      // 下拉选择框类型
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          <select
                                            value={fieldValue}
                                            onChange={(e) => handleColumnMappingChange(tableIndex, columnIndex, field, e.target.value)}
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          >
                                            <option value="">{field.placeholder || '请选择'}</option>
                                            {(Array.isArray(field.options) ? field.options : []).map((opt, idx) => {
                                              const optionValue = opt.value ?? opt.key ?? opt;
                                              const optionLabel = opt.label ?? opt.key ?? opt;
                                              return (
                                                <option key={optionValue || `${field.name}-${idx}`} value={optionValue}>
                                                  {optionLabel}
                                                </option>
                                              );
                                            })}
                                          </select>
                                        </td>
                                      );
                                    } else if (fieldType === FieldType.TEXTAREA) {
                                      // 文本域类型
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          <textarea
                                            value={fieldValue}
                                            onChange={(e) => handleColumnMappingChange(tableIndex, columnIndex, field, e.target.value)}
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                            rows={3}
                                          />
                                        </td>
                                      );
                                    } else if (fieldType === FieldType.NUMBER) {
                                      // 数字输入框类型
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          <input
                                            type="number"
                                            value={fieldValue}
                                            onChange={(e) => handleColumnMappingChange(tableIndex, columnIndex, field, e.target.value)}
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </td>
                                      );
                                    } else if (fieldType === FieldType.PASSWORD) {
                                      // 密码输入框类型
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          <input
                                            type="password"
                                            value={fieldValue}
                                            onChange={(e) => handleColumnMappingChange(tableIndex, columnIndex, field, e.target.value)}
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </td>
                                      );
                                    } else if (fieldType === FieldType.RADIO) {
                                      // 单选按钮组类型
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          {(Array.isArray(field.options) ? field.options : []).map((option, optIndex) => (
                                            <label key={optIndex} className="inline-flex items-center mr-4">
                                              <input
                                                type="radio"
                                                name={`${field.name}-${column.id}`}
                                                value={option.value}
                                                checked={fieldValue === option.value}
                                                onChange={(e) => handleColumnMappingChange(tableIndex, columnIndex, field, e.target.value)}
                                                className="h-4 w-4 text-blue-600 border-gray-300"
                                              />
                                              <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                                            </label>
                                          ))}
                                        </td>
                                      );
                                    } else {
                                      // 默认文本输入框类型
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          <input
                                            type="text"
                                            value={fieldValue}
                                            onChange={(e) => handleColumnMappingChange(tableIndex, columnIndex, field, e.target.value)}
                                            className="block w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </td>
                                      );
                                    }
                                  } else {
                                    // 查看模式 - 根据FieldType渲染不同的显示形式
                                    if (fieldType === FieldType.CHECKBOX) {
                                      // 复选框类型显示是/否标签
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fieldValue ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {fieldValue ? '是' : '否'}
                                          </span>
                                        </td>
                                      );
                                    } else if (fieldType === FieldType.SELECT) {
                                      // 下拉选择框类型显示选中的选项
                                      const selectedOption = (Array.isArray(field.options) ? field.options : []).find(opt => opt.value === fieldValue);
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          {selectedOption?.key || fieldValue || '-'}
                                        </td>
                                      );
                                    }
                                    else if (field.name === 'srcColumnName' || field.name === 'targetColumnName') {
                                      // 列名显示PK/FK标记
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          <div className="flex items-center">
                                            <span>{fieldValue || '-'}</span>
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
                                        </td>
                                      );
                                    } else {
                                      // 普通文本显示
                                      return (
                                        <td key={fieldIndex} className="px-4 py-2 whitespace-nowrap">
                                          {fieldValue || '-'}
                                        </td>
                                      );
                                    }
                                  }
                                })}

                                {/* 操作列保持不变 */}
                                <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                  {isEditing ? (
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => saveSingleColumnMapping(tableIndex, columnIndex)}
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        <FontAwesomeIcon icon={faSave} />
                                        保存
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => cancelColumnEdit(tableIndex, columnIndex)}
                                        className="text-gray-600 hover:text-gray-900"
                                      >
                                        <FontAwesomeIcon icon={faTimes} />
                                        取消
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-end space-x-2">
                                      <button
                                        type="button"
                                        onClick={() => startColumnEdit(tableIndex, columnIndex)}
                                        className="text-blue-600 hover:text-blue-900"
                                      >
                                        <FontAwesomeIcon icon={faEdit} />
                                        编辑
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeColumnMapping(tableIndex, columnIndex)}
                                        className="text-red-600 hover:text-red-900"
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                        删除
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                      <p>暂无列信息，点击上方按钮添加</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )})
        )}
      </div>
    );


  };

  return (
    <>
      {/* 表映射界面 */}
      {renderTableMappings()}
      {/* 编辑表信息界面 */}
      {renderTableModal()}
    </>
  );
};

export default TableMappingComponent;
