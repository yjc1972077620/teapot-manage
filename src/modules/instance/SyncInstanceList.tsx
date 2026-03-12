import { useNavigate } from 'react-router-dom';
import { Table, Tag, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faEye, faTrash, faSyncAlt, faStop, faPlay, faCheckCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import syncInstanceService from '../../services/crud/syncInstance/syncInstanceService';
import dictService from '../../services/server/dict/dictService';
import etlService from '../../services/server/etl/etlService';
import type { SyncInstanceLogConfigParam, SyncInstancePageVO, SyncInstanceStatusParam } from '../../types/crud/syncInstance/syncInstanceType';
import type { EnumItemVOjava_lang_Stringjava_lang_Integer, EnumItemVOjava_lang_Stringjava_lang_String } from '../../types/server/dict/dictType';
import type { EtlSyncParam } from '../../types/server/etl/etlType';
import AppEtlSyncModal from '../../components/AppEtlSyncModal';
import AppDateTimePicker from '../../components/AppDateTimePicker';
import AppNotification, { type NotificationType } from '../../components/AppNotification';
import { convertDateTimeLocalToFull, formatDateTime } from '../../utils/dateUtils';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';


// 同步类型配置
const SYNC_TYPE_CONFIG = {
    1: {
        title: '本地部署同步管理',
        basePath: '/rdb',
        syncTypeText: '同步'
    },
    2: {
        title: 'ES同步管理',
        basePath: '/es-sync',
        syncTypeText: '同步'
    },
    3: {
        title: 'ClickHouse同步管理',
        basePath: '/clickhouse-sync',
        syncTypeText: '同步'
    },
    6: {
        title: 'Doris同步管理',
        basePath: '/doris-sync',
        syncTypeText: '同步'
    }
};

type SearchParams = {
    instanceName: string;
    status: string;
    team: string;
    createTimeStart: string;
    createTimeEnd: string;
};

type PaginationState = {
    pageNo: number;
    pageSize: number;
    total: number;
};

type DictOption = {
    label: string;
    value: string;
};

type ColumnConfig = {
    key: keyof SyncInstancePageVO;
    title: string;
    width?: string;
    className?: string;
    render?: (task: SyncInstancePageVO) => ReactNode;
};

type SyncModalParams = {
    instanceId?: number;
    instanceName?: string;
    orgId?: number;
};

type ActionButton = {
    key: string;
    name: string | ((task: SyncInstancePageVO) => string);
    icon: IconDefinition;
    color: string | ((task: SyncInstancePageVO) => string);
    onClick: (task: SyncInstancePageVO) => void;
    visible: (task: SyncInstancePageVO) => boolean;
    disabled?: (task: SyncInstancePageVO) => boolean;
};

function SyncInstanceModule({ syncType = 2 }: { syncType?: number | string }) {
    // 转换syncType为数字类型
    const numericSyncType = typeof syncType === 'string' ? parseInt(syncType, 10) : syncType;

    // 获取对应类型的配置
    const config = SYNC_TYPE_CONFIG[numericSyncType] || SYNC_TYPE_CONFIG[2];

    // 导航
    const navigate = useNavigate();

    // 状态定义
    // 搜索参数状态 - 存储任务列表的搜索条件
    const [searchParams, setSearchParams] = useState<SearchParams>({
        instanceName: '', // 任务实例名搜索条件
        status: '',       // 状态搜索条件
        team: '',         // 团队搜索条件
        createTimeStart: '', // 创建时间开始范围
        createTimeEnd: ''    // 创建时间结束范围
    });

    // 同步任务列表数据 - 存储从API获取的同步任务列表
    const [syncTasks, setSyncTasks] = useState<SyncInstancePageVO[]>([]);

    // 分页信息状态 - 控制表格分页显示
    const [pagination, setPagination] = useState<PaginationState>({
        pageNo: 1,     // 当前页码，默认为1
        pageSize: 10,  // 每页显示条数，默认为10
        total: 0       // 总记录数，默认为0
    });

    // 加载状态 - 用于控制加载动画显示
    const [loading, setLoading] = useState(false);

    // 通知提示状态 - 控制全局通知组件的显示
    const [notification, setNotification] = useState<{
        visible: boolean;
        message: string;
        type: NotificationType;
        duration?: number;
    }>({
        visible: false,  // 通知是否可见
        message: '',     // 通知内容
        type: 'success'  // 通知类型：success/error/warning/info
    });

    // 状态下拉选项列表 - 存储任务状态的下拉框选项
    const [statusOptions, setStatusOptions] = useState<DictOption[]>([{ value: '', label: '全部状态' }]);

    // 团队下拉选项列表 - 存储团队信息的下拉框选项
    const [teamOptions, setTeamOptions] = useState<DictOption[]>([{ value: '', label: '全部团队' }]);

    // 同步弹窗可见性状态 - 控制同步操作弹窗的显示和隐藏
    const [syncModalVisible, setSyncModalVisible] = useState(false);

    // 同步弹窗参数 - 存储传递给同步弹窗的参数
    const [syncModalParams, setSyncModalParams] = useState<SyncModalParams>({});


    // 初始化字典数据
    const initDictData = async () => {
        try {
            setLoading(true);

            // 并行请求所有字典数据
            const [instanceStatusResult, teamResult] = await Promise.all([
                dictService.instanceStatusDict(),
                dictService.teamDict()
            ]);

            // 处理实例状态字典数据，添加"全部"选项
            const statusOptions = [
                { label: '全部', value: '' },
                ...(instanceStatusResult.data || []).map((item: EnumItemVOjava_lang_Stringjava_lang_Integer) => ({
                    label: item.key || '',
                    value: item.val !== undefined && item.val !== null ? String(item.val) : ''
                }))
            ];
            setStatusOptions(statusOptions);

            // 处理团队字典数据，添加"全部"选项
            const teamOptions = [
                { label: '全部', value: '' },
                ...(teamResult.data || []).map((item: EnumItemVOjava_lang_Stringjava_lang_String) => ({
                    label: item.key || '',
                    value: item.val || ''
                }))
            ];
            setTeamOptions(teamOptions);
        } catch (error) {
            console.error('获取字典数据失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 状态变更处理
    const handleStatusChange = async (id, currentStatus) => {
        try {
            setLoading(true);

            if (currentStatus === 0) {
                // 草稿状态下的发布操作
                const response = await syncInstanceService.publish({
                    id
                });

                if (response.code !== 200) {
                    throw new Error(response.msg || '发布失败');
                }
                if (response.data && response.data.success === false) {
                    throw new Error(response.data.checkError || '发布失败');
                }
            } else {
                // 启用/禁用状态切换
                const newStatus = currentStatus === 1 ? 2 : 1;
                const statusParam: SyncInstanceStatusParam = {
                    id,
                    status: newStatus
                };

                const response = await syncInstanceService.changeStatus(statusParam);

                if (response.code !== 200) {
                    throw new Error(response.msg || '状态切换失败');
                }
                setNotification({
                    visible: true,
                    message: newStatus === 1 ? '启用成功' : '禁用成功',
                    type: 'success'
                });
            }

            // 重新获取列表数据
            await fetchSyncInstances();
        } catch (error) {
            console.error('变更状态失败:', error);
            setNotification({
                visible: true,
                message: error.message || '状态变更失败',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // 开启日志操作
    const handleToggleLog = async (id, currentEnableLog) => {
        try {
            setLoading(true);
            const newEnableLog = currentEnableLog === 1 ? 0 : 1;

            // 使用新版API的SyncInstanceLogConfigParam构造参数
            const logConfigParam: SyncInstanceLogConfigParam = {
                enableLog: newEnableLog === 1,
                ids: [id]
            };

            const response = await syncInstanceService.logConfig(logConfigParam);

            if (response.code !== 200) {
                throw new Error(response.msg || '日志状态切换失败');
            }
            setNotification({
                visible: true,
                duration: 1000,
                message: newEnableLog === 1 ? '日志已开启' : '日志已关闭',
                type: 'success'
            });

            // 更新列表中对应项的日志状态
            setSyncTasks(syncTasks.map(task =>
                task.id === id ? { ...task, enableLog: newEnableLog } : task
            ));
        } catch (error) {
            console.error('切换日志状态失败:', error);
            setNotification({
                visible: true,
                message: error.message || '日志状态切换失败',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // 删除操作
    const handleDelete = async (id) => {
        if (window.confirm('确定要删除这个任务吗？')) {
            try {
                setLoading(true);
                // 使用新版API的删除方法
                const response = await syncInstanceService.delete({
                    id
                });

                if (response.code !== 200) {
                    throw new Error(response.msg || '删除失败');
                }

                // 从列表中移除该项
                setSyncTasks(syncTasks.filter(task => task.id !== id));
                setPagination(prev => ({
                    ...prev,
                    total: prev.total - 1
                }));
            } catch (error) {
                console.error('删除失败:', error);
                setNotification({
                    visible: true,
                    message: error.message || '删除失败',
                    type: 'error'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    // 查看详情
    const handleView = (id) => {
        // 使用新的实例详情页面路径
        navigate("/instance/detail/" + id + "?syncType=" + numericSyncType, { state: { syncType: numericSyncType } });
    };

    // 编辑实例
    const handleEdit = (id) => {
        // 使用新的实例详情页面路径,
        navigate("/instance/edit/" + id + "?syncType=" + numericSyncType, { state: { syncType: numericSyncType } });
    };

    // 创建实例
    const handleCreateInstance = () => {
        // 使用新的实例创建页面路径
        navigate("/instance/create?syncType=" + numericSyncType, { state: { syncType: numericSyncType } });
    };

    // 全量同步操作
    const handleFullSync = (id, instanceName) => {
        // 所有类型都打开弹窗
        setSyncModalParams({ instanceId: id, instanceName: instanceName });
        setSyncModalVisible(true);
    };

    // 处理全量同步弹窗确认
    const handleSyncModalConfirm = async (etlParams: EtlSyncParam) => {
        try {
            // 调用新版ETL同步接口，函数名已更新为startEtl
            const paramsToSend = {
                ...etlParams
            };

            const response = await etlService.startEtl(paramsToSend);
            console.log('同步任务启动响应:', response);
            // 检查响应状态，新版API返回的是RemoteResponse结构
            if (response.code === 200) {
                // 同步任务启动成功
                setNotification({
                    visible: true,
                    message: '同步任务已启动',
                    type: 'success'
                });

                // 关闭弹窗
                setSyncModalVisible(false);

                const snapshotId = response.data?.snapshotId;
                const targetInstanceId = paramsToSend.instanceId;
                if (targetInstanceId) {
                    const query = snapshotId ? `?snapshotId=${snapshotId}` : '';
                    navigate(`/log/realtime/${targetInstanceId}${query}`, {
                        state: {
                            instanceName: syncModalParams.instanceName,
                            snapshotId,
                            instanceId: targetInstanceId,
                            syncType: numericSyncType
                        }
                    });
                }
            } else {
                // 同步任务启动失败
                setNotification({
                    visible: true,
                    message: response.msg || '同步任务启动失败',
                    type: 'error'
                });
            }
        } catch (error) {
            // 网络错误或其他异常
            setNotification({
                visible: true,
                message: `同步任务启动失败: ${error instanceof Error ? error.message : '未知错误'}`,
                type: 'error'
            });
        }
    };

    // 获取同步实例列表
    const fetchSyncInstances = async () => {
        try {
            setLoading(true);

            // 构建查询参数
            const queryParam = {
                pageNo: pagination.pageNo,
                pageSize: pagination.pageSize,
                syncType: numericSyncType,
                instanceName: searchParams.instanceName || undefined,
                status: searchParams.status ? parseInt(searchParams.status) : undefined,
                team: searchParams.team || undefined,
                createTimeStart: searchParams.createTimeStart ? convertDateTimeLocalToFull(searchParams.createTimeStart) : undefined,
                createTimeEnd: searchParams.createTimeEnd ? convertDateTimeLocalToFull(searchParams.createTimeEnd) : undefined
            };
            console.log('执行搜索，使用的参数:', queryParam);
            // 发送请求
            const response = await syncInstanceService.queryByPage(queryParam);

            // 检查响应并处理数据
            if (response.code === 200) {
                // 更新列表数据和分页信息
                setSyncTasks(response.data || []);
                setPagination({
                    ...pagination,
                    total: response.total || 0,
                    pageSize: response.pageSize || pagination.pageSize,
                    pageNo: response.pageNo || pagination.pageNo
                });
            } else {
                throw new Error(response.msg || '获取同步实例列表失败');
            }
        } catch (error) {
            console.error('获取同步实例列表失败:', error);
            setNotification({
                visible: true,
                message: error instanceof Error ? error.message : '获取同步实例列表失败',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // 初始化时加载字典数据
    useEffect(() => {
        initDictData();
    }, []);

    // 当syncType变化时重置搜索条件和分页状态
    useEffect(() => {
        // 重置搜索条件为初始状态
        const resetParams = {
            instanceName: '',
            status: '',
            team: '',
            createTimeStart: '',
            createTimeEnd: ''
        };

        setSearchParams(resetParams);

        // 重置分页状态，确保总是从第一页开始
        setPagination({
            pageNo: 1,
            pageSize: 10,
            total: 0
        });

        // 同步类型改变时，自动加载数据
        // 使用setTimeout避免立即触发下一个useEffect
        const timer = setTimeout(() => {
            fetchSyncInstances();
        }, 0);

        return () => clearTimeout(timer);
    }, [numericSyncType]);

    // 分页变化时重新获取列表数据
    useEffect(() => {
        // 添加条件，避免在syncType变化时重复调用
        if (pagination.total !== 0) {
            fetchSyncInstances();
        }
    }, [pagination.pageNo, pagination.pageSize]);

    // 搜索处理函数
    const handleSearch = () => {
        setPagination({ ...pagination, pageNo: 1 });
        fetchSyncInstances();
    };

    // 重置搜索条件
    const handleReset = () => {
        // 清空搜索条件
        const resetParams = {
            instanceName: '',
            status: '',
            team: '',
            createTimeStart: '',
            createTimeEnd: ''
        };
        setSearchParams(resetParams);
        handleSearch();
    };

    // 表格分页处理（与 Antd Table 对齐）
    const handleTableChange = (page: TablePaginationConfig) => {
        setPagination({
            ...pagination,
            pageNo: page.current || 1,
            pageSize: page.pageSize || pagination.pageSize
        });
    };

    // 添加关闭通知的处理函数
    const handleCloseNotification = () => {
        setNotification({
            ...notification,
            visible: false
        });
    };

    // 获取状态对应的样式和文本
    const getStatusInfo = (status) => {
        switch (status) {
            case 0:
                return { class: 'bg-gray-100 text-gray-800', text: '草稿' };
            case 1:
                return { class: 'bg-green-100 text-green-800', text: '启用' };
            case 2:
                return { class: 'bg-red-100 text-red-800', text: '禁用' };
            default:
                return { class: 'bg-gray-100 text-gray-800', text: '未知' };
        }
    };

    // 表格列配置
    const columns: ColumnConfig[] = [
        { key: 'id', title: 'ID', width: 'w-12', className: 'text-gray-500 truncate' },
        { key: 'instanceName', title: '任务实例名', width: 'w-32', className: 'font-medium text-gray-900 truncate' },
        { key: 'srcTableName', title: '源数据表名', width: 'w-32', className: 'text-gray-500 truncate' },
        {
            key: 'targetTableName',
            title: numericSyncType === 2 ? '目标表/索引名' : (numericSyncType === 1 ? '目标部署表名' : numericSyncType === 6 ? '目标Doris表名' : '目标ClickHouse表名'),
            width: 'w-32',
            className: 'text-gray-500 truncate'
        },
        { key: 'team', title: '所属团队', width: 'w-24', className: 'text-gray-500 truncate' },
        { key: 'status', title: '状态', width: 'w-20' },
        { key: 'createTime', title: '创建时间', width: 'w-28', className: 'text-gray-500 truncate' }
    ];

    // 操作栏配置
    const actionButtons: ActionButton[] = [
        {
            key: 'fullSync',
            name: `全量${config.syncTypeText}`,
            icon: faSyncAlt,
            color: 'text-purple-600 hover:text-purple-900',
            onClick: (task) => handleFullSync(task.id, task.instanceName),
            visible: (task) => task.status === 1 // 仅在启用状态显示
        },
        {
            key: 'view',
            name: '查看',
            icon: faEye,
            color: 'text-blue-600 hover:text-blue-900',
            onClick: (task) => handleView(task.id),
            visible: () => true // 所有状态都显示
        },
        {
            key: 'edit',
            name: '编辑',
            icon: faFileAlt,
            color: 'text-blue-600 hover:text-blue-900',
            onClick: (task) => handleEdit(task.id),
            visible: () => true // 所有状态都显示
            // visible: (task) => task.status === 0 || task.status === 2 // 在草稿和禁用状态可以编辑
        },
        {
            key: 'publish',
            name: '发布',
            icon: faCheckCircle,
            color: 'text-green-600 hover:text-green-900',
            onClick: (task) => handleStatusChange(task.id, task.status),
            visible: (task) => task.status === 0 // 仅在草稿状态显示
        },
        {
            key: 'start',
            name: '启动',
            icon: faPlay,
            color: 'text-green-600 hover:text-green-900',
            onClick: (task) => handleStatusChange(task.id, task.status),
            visible: (task) => task.status === 2 // 仅在禁用状态显示
        },
        {
            key: 'stop',
            name: '停止',
            icon: faStop,
            color: 'text-orange-600 hover:text-orange-900',
            onClick: (task) => handleStatusChange(task.id, task.status),
            visible: (task) => task.status === 1 // 仅在启用状态显示
        },
        {
            key: 'toggleLog',
            name: (task) => task.enableLog === 1 ? '关闭日志' : '开启日志',
            icon: faFileAlt,
            color: (task) => task.enableLog === 1 ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900',
            onClick: (task) => handleToggleLog(task.id, task.enableLog),
            visible: (task) => task.status !== 0, // 除草稿状态外都显示
            disabled: (task) => task.status === 2 && task.enableLog === 1 // 禁用状态下日志已开启时禁用按钮
        },
        {
            key: 'delete',
            name: '删除',
            icon: faTrash,
            color: 'text-red-600 hover:text-red-900',
            onClick: (task) => handleDelete(task.id),
            visible: (task) => task.status === 0 // 仅在草稿状态显示
        }
    ];

    const tableColumns: ColumnsType<SyncInstancePageVO> = [
        ...columns.map((column) => ({
            title: column.title,
            dataIndex: column.key,
            key: String(column.key),
            className: column.className,
            width: column.key === 'status' ? 110 : column.key === 'instanceName' ? 180 : undefined,
            render: (_, record) => {
                if (column.render) return column.render(record);
                if (column.key === 'instanceName') {
                    const name = String(record.instanceName ?? '');
                    return (
                        <Tooltip title={name}>
                            <span className="block truncate">{name}</span>
                        </Tooltip>
                    );
                }
                if (column.key === 'status') {
                    const statusInfo = getStatusInfo(record.status);
                    return (
                        <Tag className={`${statusInfo.class} whitespace-nowrap`} bordered={false}>
                            {statusInfo.text}
                        </Tag>
                    );
                }
                if (column.key === 'createTime') {
                    return <span title={formatDateTime(record.createTime)}>{formatDateTime(record.createTime)}</span>;
                }
                return record[column.key] as ReactNode;
            }
        })),
        {
            title: '操作',
            key: 'action',
            className: 'w-72',
            width: 280,
            render: (_, record) => (
                <div className="flex flex-nowrap gap-2 overflow-x-auto">
                    {actionButtons
                        .filter(button => typeof button.visible === 'function' && button.visible(record))
                        .map(button => {
                            const color = typeof button.color === 'function' ? button.color(record) : button.color;
                            const name = typeof button.name === 'function' ? button.name(record) : button.name;
                            const isDisabled = loading || (typeof button.disabled === 'function' && button.disabled(record));

                            return (
                                <button
                                    key={button.key}
                                    className={`${color} whitespace-nowrap ${isDisabled ? 'text-gray-500 cursor-not-allowed' : ''}`}
                                    onClick={() => !isDisabled && button.onClick(record)}
                                    disabled={isDisabled}
                                >
                                    <FontAwesomeIcon icon={button.icon} className="inline mr-1" />
                                    {name}
                                </button>
                            );
                        })}
                </div>
            )
        }
    ];

    return (
        <div>
            {/* 页面头部区域 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
                <button
                    onClick={handleCreateInstance}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    创建同步任务
                </button>
            </div>

            {/* 搜索条件区域 */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">任务实例名</label>
                        <input
                            type="text"
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchParams.instanceName}
                            onChange={(e) => setSearchParams({ ...searchParams, instanceName: e.target.value })}
                            placeholder="请输入任务实例名"
                            disabled={loading}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">状态</label>
                        <select
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchParams.status}
                            onChange={(e) => setSearchParams({ ...searchParams, status: e.target.value })}
                            disabled={loading}
                        >
                            {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-700">所属团队</label>
                        <select
                            className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            value={searchParams.team}
                            onChange={(e) => setSearchParams({ ...searchParams, team: e.target.value })}
                            disabled={loading}
                        >
                            {teamOptions.map(option => (
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
                    columns={tableColumns}
                    dataSource={syncTasks}
                    rowKey="id"
                    loading={loading}
                    onChange={handleTableChange}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: pagination.pageNo,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                        showTotal: (total) => `共 ${total} 条`
                    }}
                />
            </div>

            {/* 通知组件 */}
            <AppNotification
                visible={notification.visible}
                message={notification.message}
                type={notification.type}
                onClose={handleCloseNotification}
                duration={notification.duration || 3000}
            />

            {/* 全量同步弹窗 */}
            <AppEtlSyncModal
                visible={syncModalVisible}
                onCancel={() => setSyncModalVisible(false)}
                onConfirm={handleSyncModalConfirm}
                baseParams={syncModalParams}
                syncType={numericSyncType}
            />
        </div>
    );
}

export default SyncInstanceModule;
