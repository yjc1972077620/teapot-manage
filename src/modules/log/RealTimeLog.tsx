import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import RealtimeLogPanel from './components/RealtimeLogPanel';
import etlSyncLogService from '../../services/crud/etlSyncLog/etlSyncLogService';

const RealTimeLog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const snapshotId = searchParams.get('snapshotId') || undefined;
  const instanceId = id ? Number.parseInt(id, 10) : undefined;
  const instanceName = (location.state as { instanceName?: string } | undefined)?.instanceName;
  const [syncResult, setSyncResult] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchLogResult = async () => {
      try {
        if (!snapshotId && !instanceId) return;
        const response = await etlSyncLogService.queryByPage({
          pageNo: 1,
          pageSize: 1,
          snapshotIdList: snapshotId ? [snapshotId] : undefined,
          syncInstanceId: snapshotId ? undefined : instanceId
        });
        const firstLog = response?.data?.[0];
        setSyncResult(firstLog?.syncResult);
      } catch (error) {
        console.error('Fetch log result error:', error);
      }
    };

    fetchLogResult();
  }, [instanceId, snapshotId]);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <Card bordered={false} className="shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>返回</Button>
            <div>
              <div className="text-2xl font-bold text-gray-800">同步动态日志</div>
              <div className="text-sm text-gray-500">
                {instanceName ? `实例: ${instanceName}` : '控制台输出与同步进度'}
              </div>
            </div>
          </div>
          <Tag color="blue">实时监控</Tag>
        </div>
      </Card>

      <RealtimeLogPanel instanceId={instanceId} snapshotId={snapshotId} syncResult={syncResult} />
    </div>
  );
};

export default RealTimeLog;
