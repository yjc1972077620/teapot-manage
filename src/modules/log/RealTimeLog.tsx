import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Tag } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import RealtimeLogPanel from './components/RealtimeLogPanel';

const shouldExpectCompensation = (syncType?: number | string) => {
  if (syncType == null || syncType === '') {
    return false;
  }
  if (typeof syncType === 'number') {
    return syncType !== 1;
  }
  const normalized = String(syncType).toLowerCase();
  if (normalized === '1') {
    return false;
  }
  return !normalized.includes('mysql');
};

const RealTimeLog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const snapshotId = searchParams.get('snapshotId') || undefined;
  const instanceId = id ? Number.parseInt(id, 10) : undefined;
  const locationState = location.state as { instanceName?: string; syncType?: number | string } | undefined;
  const instanceName = locationState?.instanceName;
  const expectCompensation = shouldExpectCompensation(locationState?.syncType);

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

      <RealtimeLogPanel
        expectCompensation={expectCompensation}
        instanceId={instanceId}
        snapshotId={snapshotId}
        mode="realtime"
      />
    </div>
  );
};

export default RealTimeLog;
