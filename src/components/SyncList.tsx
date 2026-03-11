import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faChevronLeft, faChevronRight, faEye, faTrash, faSyncAlt, faStop, faPlay, faCheckCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime } from '../utils/dateUtils';
import AppDateTimePicker from './AppDateTimePicker';
import AppPagination from './AppPagination';
import AppNotification from './AppNotification';

type OptionItem = {
  value: string | number;
  label: string;
};

type PaginationState = {
  pageNo: number;
  pageSize: number;
  total?: number;
};

type NotificationState = {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
};

type SyncListProps = {
  title: string;
  createButtonText: string;
  createButtonOnClick?: () => void;
  searchParams: Record<string, any>;
  setSearchParams: (params: Record<string, any>) => void;
  syncTasks: any[];
  setSyncTasks?: (tasks: any[]) => void;
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  loading: boolean;
  setLoading?: (loading: boolean) => void;
  statusOptions: OptionItem[];
  teamOptions: OptionItem[];
  notification: NotificationState;
  setNotification: (notification: NotificationState) => void;
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
  onStatusChange?: (id: number, status: number) => void;
  onToggleLog?: (id: number, enable: boolean) => void;
  onFullSync?: (id: number, instanceName?: string) => void;
  onSearch?: () => void;
  showFullSyncButton?: boolean;
  showNotification?: boolean;
  columns?: Array<Record<string, any>>;
  syncTypeText?: string;
};

/**
 * 同步任务列表组件
 * 支持自定义列、操作按钮和搜索条件
 */
function SyncList({
  title,
  createButtonText,
  createButtonOnClick,
  searchParams,
  setSearchParams,
  syncTasks,
  setSyncTasks,
  pagination,
  setPagination,
  loading,
  setLoading,
  statusOptions,
  teamOptions,
  notification,
  setNotification,
  onView,
  onDelete,
  onStatusChange,
  onToggleLog,
  onFullSync,
  onSearch, 
  showFullSyncButton,
  showNotification = true,
  columns = [],
  syncTypeText = '同步'
}: SyncListProps) {
  // 获取状态对应的样式和文本
  const getStatusInfo = (status: number) => {
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

  // 搜索处理函数
  const handleSearch = () => {
    setPagination({ ...pagination, pageNo: 1 });
    // 如果提供了搜索回调函数，则调用它执行实际的接口调用
    if (onSearch && typeof onSearch === 'function') {
      onSearch();
    }
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
    onSearch();
  };

  // 分页处理
  const handlePageChange = (newPage: number, newPageSize = pagination.pageSize) => {
    setPagination({
      ...pagination,
      pageNo: newPage,
      pageSize: newPageSize
    });
  };

  // 添加关闭通知的处理函数
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      visible: false
    });
  };

  return (
    <div className="w-full overflow-x-hidden">
      {/* 页面头部区域 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <button
          onClick={createButtonOnClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center">
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          {createButtonText}
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

      {/* 任务表格容器 - 保持不变 */}
      <div className="bg-white rounded-lg shadow w-full">
        <div className="overflow-x-auto">
          <div className="align-middle inline-block min-w-full">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.key || index}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.width ? column.width : ''}`}
                    >
                      {column.title}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  // 加载中状态
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center">
                      加载中...
                    </td>
                  </tr>
                ) : syncTasks.length === 0 ? (
                  // 无数据状态
                  <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center">
                      暂无数据
                    </td>
                  </tr>
                ) : (
                  // 有数据状态
                  syncTasks.map((task) => {
                    const statusInfo = getStatusInfo(task.status);
                    return (
                      <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                        {columns.map((column, index) => (
                          <td
                            key={column.key || index}
                            className={`px-6 py-4 text-sm ${column.className || ''}`}
                            title={column.render ? undefined : task[column.key]}
                          >
                            {column.render ? (
                              column.render(task)
                            ) : column.key === 'status' ? (
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.class}`}>
                                {statusInfo.text}
                              </span>
                            ) : column.key === 'createTime' ? (
                              <span title={formatDateTime(task.createTime)}>{formatDateTime(task.createTime)}</span>
                            ) : (
                              task[column.key]
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-left text-sm font-medium w-40">
                          {/* 根据状态显示不同的操作按钮 */}
                          {task.status === 0 ? (
                            // 草稿状态：查看、发布、删除
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                                onClick={() => onView && onView(task.id)}
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faEye} className="inline mr-1" />
                                查看
                              </button>
                              <button
                                className="text-green-600 hover:text-green-900 whitespace-nowrap"
                                onClick={() => onStatusChange && onStatusChange(task.id, task.status)}
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faCheckCircle} className="inline mr-1" />
                                发布
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900 whitespace-nowrap"
                                onClick={() => onDelete && onDelete(task.id)}
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faTrash} className="inline mr-1" />
                                删除
                              </button>
                            </div>
                          ) : task.status === 1 ? (
                            // 启用状态：全量同步、查看、停止、开启日志
                            <div className="flex space-x-2">
                              {showFullSyncButton && (
                                <button
                                  className="text-purple-600 hover:text-purple-900 whitespace-nowrap"
                                  onClick={() => onFullSync && onFullSync(task.id, task.instanceName)}
                                  disabled={loading}
                                >
                                  <FontAwesomeIcon icon={faSyncAlt} className="inline mr-1" />
                                  全量{syncTypeText}
                                </button>
                              )}
                              <button
                                className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                                onClick={() => onView && onView(task.id)}
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faEye} className="inline mr-1" />
                                查看
                              </button>
                              <button
                                className="text-orange-600 hover:text-orange-900 whitespace-nowrap"
                                onClick={() => onStatusChange && onStatusChange(task.id, task.status)}
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faStop} className="inline mr-1" />
                                停止
                              </button>
                              <button
                                className={`${task.enableLog === 1 ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'} whitespace-nowrap`}
                                onClick={() => onToggleLog && onToggleLog(task.id, task.enableLog)}
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faFileAlt} className="inline mr-1" />
                                {task.enableLog === 1 ? '关闭日志' : '开启日志'}
                              </button>
                            </div>
                          ) : (
                            // 禁用状态：查看、启动、开启日志
                            <div className="flex space-x-2">
                              <button
                                className="text-blue-600 hover:text-blue-900 whitespace-nowrap"
                                onClick={() => onView && onView(task.id)}
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faEye} className="inline mr-1" />
                                查看
                              </button>
                              <button
                                className="text-green-600 hover:text-green-900 whitespace-nowrap"
                                onClick={() => onStatusChange && onStatusChange(task.id, task.status)}
                                disabled={loading}
                              >
                                <FontAwesomeIcon icon={faPlay} className="inline mr-1" />
                                启动
                              </button>
                              <button
                                className={`${task.enableLog === 1 ? 'text-gray-500 cursor-not-allowed' : 'text-green-600 hover:text-green-900'} whitespace-nowrap`}
                                onClick={() => onToggleLog && !task.enableLog && onToggleLog(task.id, task.enableLog)}
                                disabled={loading || task.enableLog === 1}
                              >
                                <FontAwesomeIcon icon={faFileAlt} className="inline mr-1" />
                                {task.enableLog === 1 ? '开启日志' : '开启日志'}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 分页组件 - 保持不变 */}
      {!loading && syncTasks.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 flex items-center justify-center border-t border-gray-200 sm:px-6">
          <AppPagination
            totalItems={pagination.total}
            currentPage={pagination.pageNo}
            defaultPageSize={pagination.pageSize}
            pageSizeOptions={[5, 10, 20, 50]}
            onPageChange={handlePageChange}
            showSizeChanger={true}
            showTotal={true}
            maxVisiblePages={5}
            prevText={<FontAwesomeIcon icon={faChevronLeft} />}
            nextText={<FontAwesomeIcon icon={faChevronRight} />}
          />
        </div>
      )}

      {/* 通知组件 - 保持不变 */}
      {showNotification && (
        <AppNotification
          visible={notification.visible}
          message={notification.message}
          type={notification.type}
          onClose={handleCloseNotification}
          duration={notification.duration || 3000}
        />
      )}
    </div>
  );
}

export default SyncList;
