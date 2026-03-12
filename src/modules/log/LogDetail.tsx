import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Alert, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import etlSyncLogService from '../../services/crud/etlSyncLog/etlSyncLogService';
import type { EtlSyncLogQuery, EtlSyncLogVO } from '../../types/crud/etlSyncLog/etlSyncLogType';
import LogSnapshotViewer from './components/LogSnapshotViewer';
import RealtimeLogPanel from './components/RealtimeLogPanel';
import { formatDateTime } from '../../utils/dateUtils';
import AppNotification from '../../components/AppNotification';

type LogItem = EtlSyncLogVO;

type NotificationState = {
  visible: boolean;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

const shouldExpectCompensation = (syncType?: string, logType?: number) => {
  if (logType === 1) {
    return true;
  }
  if (logType === 2) {
    return false;
  }
  if (!syncType) {
    return false;
  }
  return !String(syncType).toLowerCase().includes('mysql');
};

const LogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [log, setLog] = useState<LogItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({ visible: false, message: '', type: 'info' });
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const shouldScrollToConsole = (location.state as { scrollToConsole?: boolean } | undefined)?.scrollToConsole;

  useEffect(() => {
    const fetchLog = async () => {
      try {
        setLoading(true);
        const parsedId = id ? Number.parseInt(id, 10) : undefined;
        const query: EtlSyncLogQuery = { id: parsedId };
        const response = await etlSyncLogService.queryById(query);
        if (response && response.code === 200) {
          setLog(response.data);
        } else {
          throw new Error(response?.msg || '获取日志详情失败');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '获取日志详情失败';
        setNotification({ visible: true, message: errorMessage, type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLog();
    }
  }, [id]);

  useEffect(() => {
    if (!shouldScrollToConsole || !log) return;
    if (consoleRef.current) {
      consoleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [log, shouldScrollToConsole]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleViewRelate = (relateId?: number) => {
    if (relateId == null) return;
    navigate(`/log/detail/${relateId}`);
  };

  const snapshotData = useMemo(() => {
    const rawSnapshot = log?.snapshotJson;
    if (typeof rawSnapshot !== 'string') {
      return rawSnapshot ?? null;
    }
    try {
      return JSON.parse(rawSnapshot);
    } catch (error) {
      console.error('Failed to parse snapshotJson', error);
      return null;
    }
  }, [log?.snapshotJson]);

  if (!log && !loading) return <div className="p-6 text-center text-gray-500">Log not found</div>;

  const syncTypeValue = log?.syncType != null ? log.syncType : undefined;
  const syncResultValue = log?.syncResult != null ? log.syncResult : undefined;
  const logTypeValue = log?.logType;
  const logTypeLabel = logTypeValue === 0 ? '全量日志' : logTypeValue === 1 ? '补偿日志' : logTypeValue === 2 ? '断点日志' : '未知日志';
  const expectCompensation = shouldExpectCompensation(syncTypeValue, logTypeValue);
  return (
    <div className="px-6 pb-6 pt-4 space-y-6 bg-gray-50 min-h-screen">
      <Card bordered={false} className="shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
            <div>
              <div className="text-2xl font-bold text-gray-800">
                日志详情 #{id}
                {logTypeValue != null && (
                  <Tag className="ml-2" color={logTypeValue === 0 ? 'geekblue' : logTypeValue === 1 ? 'purple' : logTypeValue === 2 ? 'cyan' : 'default'}>
                    {logTypeLabel}
                  </Tag>
                )}
              </div>
              <div className="text-sm text-gray-500">同步日志信息与执行明细</div>
            </div>
          </div>
        </div>
      </Card>

      {log && (
        <>
          <Card title="基本信息" bordered={false} className="shadow-sm">
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="text-gray-500">实例名称</div>
                <div className="text-lg font-semibold text-gray-900">{log.syncInstanceName}</div>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="text-gray-500">同步类型</div>
                <div className="text-lg font-semibold text-gray-900">{syncTypeValue}</div>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="text-gray-500">同步结果</div>
                <div className="text-lg font-semibold text-gray-900">
                  {syncResultValue?.endsWith('成功') ? (
                    <Tag color="success">成功</Tag>
                  ) : syncResultValue?.endsWith('失败') ? (
                    <Tag color="error">失败</Tag>
                  ) : (
                    <Tag color="default">未知</Tag>
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="text-gray-500">开始时间</div>
                <div className="text-lg font-semibold text-gray-900">{formatDateTime(log.syncStartTime)}</div>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="text-gray-500">结束时间</div>
                <div className="text-lg font-semibold text-gray-900">{formatDateTime(log.syncEndTime)}</div>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="text-gray-500">总耗时</div>
                <div className="text-lg font-semibold text-gray-900">
                  {log.timeConsuming != null ? `${log.timeConsuming} ms` : '-'}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2 ">
                <div className="text-gray-500">源数据源</div>
                <div className="text-lg font-semibold text-gray-900">{log.srcDsInfo}</div>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2 ">
                <div className="text-gray-500">目标数据源</div>
                <div className="text-lg font-semibold text-gray-900">{log.targetDsInfo}</div>
              </div>
              <div className="rounded-lg bg-gray-50 px-3 py-2">
                <div className="text-gray-500">关联日志</div>
                <div className="text-lg font-semibold text-gray-900">
                  {log.relateLog?.id != null ? (
                    <Button type="link" className="p-0" onClick={() => handleViewRelate(log.relateLog?.id)}>
                      查看日志详情 #{log.relateLog.id}
                    </Button>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
            {log.errorMsg && (
              <div className="mt-4">
                <Alert message="错误信息" description={log.errorMsg} type="error" showIcon />
              </div>
            )}
          </Card>

          <div ref={consoleRef}>
            <RealtimeLogPanel
              expectCompensation={expectCompensation}
              instanceId={log.syncInstanceId}
              snapshotId={log.snapshotId}
              initialSnapshot={snapshotData}
              mode="auto"
              title="实时控制台日志"
              syncResult={log.syncResult}
            />
          </div>

          <LogSnapshotViewer snapshot={snapshotData} showOverview={false} />

        </>
      )}

      <AppNotification 
        visible={notification.visible} 
        message={notification.message} 
        type={notification.type} 
        onClose={() => setNotification({...notification, visible: false})}
      />
    </div>
  );
};

export default LogDetail;
