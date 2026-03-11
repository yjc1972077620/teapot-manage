import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tag, message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faEye, faRedo } from '@fortawesome/free-solid-svg-icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import etlSyncLogService from '../../services/crud/etlSyncLog/etlSyncLogService';
import type { EtlSyncLogPageQuery, EtlSyncLogVO } from '../../types/crud/etlSyncLog/etlSyncLogType';
import AppDateTimePicker from '../../components/AppDateTimePicker';
import { convertDateTimeLocalToFull } from '../../utils/dateUtils';

type SearchFormValues = {
    instanceName?: string;
    instanceId?: number | string;
    snapshotId?: string;
    syncType?: number;
    syncResult?: number;
    createTimeStart?: string;
    createTimeEnd?: string;
};

type PaginationState = {
    current: number;
    pageSize: number;
    total: number;
};

type FetchParams = {
    pagination?: TablePaginationConfig;
    search?: SearchFormValues;
};

type LogItem = EtlSyncLogVO;

const normalizeRange = (start?: string, end?: string) => {
    if (!start || !end) {
        return {
            start: start ? convertDateTimeLocalToFull(start) : start,
            end: end ? convertDateTimeLocalToFull(end) : end
        };
    }
    const startValue = convertDateTimeLocalToFull(start);
    const endValue = convertDateTimeLocalToFull(end);
    const startTime = new Date(startValue).getTime();
    const endTime = new Date(endValue).getTime();
    if (Number.isNaN(startTime) || Number.isNaN(endTime)) return { start, end };
    if (startTime > endTime) return { start: endValue, end: startValue };
    return { start: startValue, end: endValue };
};

function LogList() {
    const navigate = useNavigate();

    // 列表数据
    const [logs, setLogs] = useState<LogItem[]>([]);
    
    // 分页状态
    const [pagination, setPagination] = useState<PaginationState>({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const [loading, setLoading] = useState(false);

    // 查询参数（用于筛选输入框）
    const [searchParams, setSearchParams] = useState<SearchFormValues>({
        instanceName: '',
        instanceId: '',
        snapshotId: '',
        syncType: undefined,
        syncResult: undefined,
        createTimeStart: '',
        createTimeEnd: ''
    });

    // 查询参数缓存，用于分页时保持查询条件
    const [queryParams, setQueryParams] = useState<SearchFormValues>({});

    // 同步类型选项
    const syncTypeOptions = [
        { value: 1, label: 'MySQL同步' },
        { value: 2, label: 'ES同步' },
        { value: 3, label: 'ClickHouse同步' },
        { value: 6, label: 'Doris同步' }
    ];

    // 同步结果选项
    const syncResultOptions = [
        { value: 1, label: '成功' },
        { value: 2, label: '失败' }
    ];

    // 获取数据
    const fetchLogs = useCallback(async (params: FetchParams = {}) => {
        setLoading(true);
        try {
            const current = params.pagination?.current ?? pagination.current;
            const pageSize = params.pagination?.pageSize ?? pagination.pageSize;
            const searchValues = params.search || queryParams;

            const normalizedRange = normalizeRange(searchValues.createTimeStart, searchValues.createTimeEnd);
            const apiParam: EtlSyncLogPageQuery = {
                pageNo: current,
                pageSize: pageSize,
                syncInstanceName: searchValues.instanceName || undefined,
                syncInstanceId: searchValues.instanceId ? Number(searchValues.instanceId) : undefined,
                snapshotIdList: searchValues.snapshotId ? [searchValues.snapshotId] : undefined,
                syncType: searchValues.syncType,
                syncResult: searchValues.syncResult,
                createTimeStart: normalizedRange.start,
                createTimeEnd: normalizedRange.end
            };

            const response = await etlSyncLogService.queryByPage(apiParam);
            if (response && response.code === 200) {
                setLogs(response.data || []);
                setPagination(prev => ({
                    ...prev,
                    current: response.pageNo || 1,
                    pageSize: response.pageSize || 10,
                    total: response.total || 0
                }));
                // 更新当前有效的查询参数
                setQueryParams(searchValues);
            } else {
                message.error(response?.msg || '获取日志列表失败');
            }
        } catch (error) {
            console.error('Fetch logs error:', error);
            message.error(error.message || '获取日志列表失败');
        } finally {
            setLoading(false);
        }
    }, [pagination.current, pagination.pageSize, queryParams]);

    // 初始加载
    useEffect(() => {
        fetchLogs({ pagination: { current: 1, pageSize: 10 } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 搜索
    const handleSearch = () => {
        const instanceIdValue = searchParams.instanceId ? Number(searchParams.instanceId) : undefined;
        const formattedValues = {
            ...searchParams,
            instanceId: Number.isNaN(instanceIdValue) ? undefined : instanceIdValue
        };

        fetchLogs({ 
            pagination: { ...pagination, current: 1 }, 
            search: formattedValues 
        });
    };

    // 重置
    const handleReset = () => {
        const resetParams = {
            instanceName: '',
            instanceId: '',
            snapshotId: '',
            syncType: undefined,
            syncResult: undefined,
            createTimeStart: '',
            createTimeEnd: ''
        };
        setSearchParams(resetParams);
        fetchLogs({ pagination: { ...pagination, current: 1 }, search: resetParams });
    };

    // 表格变化处理 (分页)
    const handleTableChange = (newPagination: TablePaginationConfig) => {
        fetchLogs({ pagination: newPagination });
    };

    // 跳转详情
    const handleView = (id?: number) => {
        if (id == null) return;
        navigate(`/log/detail/${id}`);
    };
    
    // 列定义
    const columns: ColumnsType<LogItem> = [
        {
            title: '实例名称',
            dataIndex: 'syncInstanceName',
            key: 'syncInstanceName',
            width: 160,
            ellipsis: true,
        },
        {
            title: '同步类型',
            dataIndex: 'syncType',
            key: 'syncType',
            width: 130,
            render: (type?: string) => {
                const syncTypeValue = type != null ? Number(type) : undefined;
                const option = syncTypeOptions.find(opt => opt.value === syncTypeValue);
                return <Tag color="blue">{option ? option.label : type}</Tag>;
            }
        },
        {
            title: '源端信息',
            dataIndex: 'srcDsInfo',
            key: 'srcDsInfo',
            width: 200,
            ellipsis: true
        },
        {
            title: '目标端信息',
            dataIndex: 'targetDsInfo',
            key: 'targetDsInfo',
            width: 200,
            ellipsis: true
        },
        {
            title: '同步结果',
            dataIndex: 'syncResult',
            key: 'syncResult',
            width: 110,
            render: (result?: string, record?: LogItem) => {
                const successCount = record?.successCount ?? 0;
                const totalCount = record?.totalCount ?? 0;
                const ratio = `${successCount}/${totalCount}`;
                if(result?.endsWith('成功')) return <Tag color="green">成功 {ratio}</Tag>;
                if(result?.endsWith('失败')) return <Tag color="red">失败 {ratio}</Tag>;
                if (result) return <Tag color="default">{result} {ratio}</Tag>;
                return <Tag color="default">未知 {ratio}</Tag>;
            }
        },
        {
            title: '同步总耗时',
            dataIndex: 'timeConsuming',
            key: 'timeConsuming',
            width: 120,
            align: 'right',
            render: (value?: number) => (value != null ? `${value} ms` : '-')
        },
        {
            title: '日志类型',
            dataIndex: 'logType',
            key: 'logType',
            width: 110,
            render: (value?: number) => {
                if (value === 0) return <Tag color="geekblue">全量</Tag>;
                if (value === 1) return <Tag color="purple">补偿</Tag>;
                if (value === 2) return <Tag color="cyan">断点</Tag>;
                return <Tag color="default">未知</Tag>;
            }
        },
        {
            title: '操作',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Button 
                    type="link" 
                    size="small" 
                    icon={<FontAwesomeIcon icon={faEye} />}
                    onClick={() => handleView(record.id)}
                >
                    详情
                </Button>
            ),
        },
    ];
    const relatedColumns: ColumnsType<LogItem> = [
        {
            key: 'expand-placeholder',
            width: 48,
            render: () => null
        },
        ...columns.map(column => ({
            ...column,
            fixed: undefined
        }))
    ];

    return (
        <div className="p-1 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <div className="text-2xl font-bold text-gray-800">日志管理</div>                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">实例名称</label>
                        <input
                            type="text"
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchParams.instanceName}
                            onChange={(e) => setSearchParams({ ...searchParams, instanceName: e.target.value })}
                            placeholder="请输入实例名称"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">快照ID</label>
                        <input
                            type="text"
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchParams.snapshotId}
                            onChange={(e) => setSearchParams({ ...searchParams, snapshotId: e.target.value })}
                            placeholder="请输入快照ID"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">实例ID</label>
                        <input
                            type="text"
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchParams.instanceId}
                            onChange={(e) => setSearchParams({ ...searchParams, instanceId: e.target.value })}
                            placeholder="请输入实例ID"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">同步类型</label>
                        <select
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchParams.syncType ?? ''}
                            onChange={(e) => setSearchParams({ ...searchParams, syncType: e.target.value ? Number(e.target.value) : undefined })}
                            disabled={loading}
                        >
                            <option value="">全部</option>
                            {syncTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">同步结果</label>
                        <select
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchParams.syncResult ?? ''}
                            onChange={(e) => setSearchParams({ ...searchParams, syncResult: e.target.value ? Number(e.target.value) : undefined })}
                            disabled={loading}
                        >
                            <option value="">全部</option>
                            {syncResultOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>
                    <AppDateTimePicker
                        label="创建时间-开始"
                        value={searchParams.createTimeStart}
                        onChange={(value) => setSearchParams({ ...searchParams, createTimeStart: value })}
                        placeholder="请选择开始时间"
                        disabled={loading}
                    />
                    <AppDateTimePicker
                        label="创建时间-结束"
                        value={searchParams.createTimeEnd}
                        onChange={(value) => setSearchParams({ ...searchParams, createTimeEnd: value })}
                        placeholder="请选择结束时间"
                        disabled={loading}
                    />
                </div>

                <div className="mt-3 flex justify-end space-x-2">
                    <button
                        className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        重置
                    </button>
                    <button
                        className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={handleSearch}
                        disabled={loading}
                    >
                        <FontAwesomeIcon icon={faSearch} className="mr-1" />
                        搜索
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow w-full">
                <Table 
                    columns={columns} 
                    dataSource={logs} 
                    rowKey="id"
                    loading={loading}
                    onChange={handleTableChange}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                        showTotal: (total) => `共 ${total} 条`
                    }}
                    expandable={{
                        expandedRowRender: (record) => (
                            record.relateLog ? (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <div className="text-sm font-semibold text-gray-700 mb-3">关联日志</div>
                                    <Table
                                        columns={relatedColumns}
                                        dataSource={[record.relateLog]}
                                        rowKey="id"
                                        pagination={false}
                                        size="middle"
                                    />
                                </div>
                            ) : (
                                <div className="text-gray-400 text-sm">暂无关联日志</div>
                            )
                        ),
                        rowExpandable: (record) => Boolean(record.relateLog)
                    }}
                />
            </div>
        </div>
    );
}

export default LogList;
