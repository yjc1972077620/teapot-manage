import React, { useMemo } from 'react';
import { Card, Descriptions, Progress, Tag, Collapse, List, Typography, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import type { EtlProgressSnapshot, EtlProgressSnapshot_TableSyncInfo as TableSyncInfo, EtlProgressSnapshot_BatchInfo as BatchInfo } from '../../../types/crud/etlSyncLog/etlSyncLogType';

const { Panel } = Collapse;
const { Text } = Typography;

type LogSnapshotViewerProps = {
  snapshot?: EtlProgressSnapshot | null;
  showOverview?: boolean;
};

type TableSyncItemProps = {
  tableInfo: TableSyncInfo;
};

type BatchItem = BatchInfo & { status: 'success' | 'fail' };

const LogSnapshotViewer = ({ snapshot, showOverview = true }: LogSnapshotViewerProps) => {
  if (!snapshot) {
    return <div className="text-gray-400 text-center py-4">暂无快照数据</div>;
  }

  const {
    instanceName,
    orgId,
    totalCount = 0,
    successCount = 0,
    failCount = 0,
    filterCnt = 0,
    syncFinished,
    tableInfoList = []
  } = snapshot;

  // 计算总进度
  const percent = totalCount > 0 ? Math.floor(((successCount + failCount + filterCnt) / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {showOverview && (
        <Card title="同步概览" className="shadow-sm">
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="实例名称">{instanceName}</Descriptions.Item>
            <Descriptions.Item label="单位ID">{orgId}</Descriptions.Item>
            <Descriptions.Item label="总数据量">{totalCount}</Descriptions.Item>
            <Descriptions.Item label="同步状态">
              {syncFinished ? <Tag color="success">已完成</Tag> : <Tag color="processing" icon={<SyncOutlined spin />}>进行中</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="成功数">
              <Text type="success">{successCount}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="失败数">
              <Text type="danger">{failCount}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="过滤数">{filterCnt}</Descriptions.Item>
            <Descriptions.Item label="总体进度">
              <Progress percent={percent} size="small" status={failCount > 0 ? 'exception' : (syncFinished ? 'success' : 'active')} />
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card title="表同步详情" className="shadow-sm">
        {tableInfoList.map((tableInfo) => (
          <TableSyncItem key={tableInfo.tableName} tableInfo={tableInfo} />
        ))}
        {tableInfoList.length === 0 && <div className="text-center py-4 text-gray-400">暂无表同步信息</div>}
      </Card>
    </div>
  );
};

const TableSyncItem = ({ tableInfo }: TableSyncItemProps) => {
  const {
    tableName,
    tableDataCount = 0,
    successCount = 0,
    failCount = 0,
    filterCnt = 0,
    finishBatchInfoList = [],
    failBatchInfoList = [],
    syncFinished
  } = tableInfo;

  // 合并并排序批次信息
  const allBatches = useMemo<BatchItem[]>(() => {
    const finished = finishBatchInfoList.map(b => ({ ...b, status: 'success' as const }));
    const failed = failBatchInfoList.map(b => ({ ...b, status: 'fail' as const }));
    return [...finished, ...failed].sort((a, b) => b.batchId - a.batchId); // 倒序排列，最新的在前面
  }, [finishBatchInfoList, failBatchInfoList]);

  const percent = tableDataCount > 0 ? Math.floor(((successCount + failCount + filterCnt) / tableDataCount) * 100) : 0;

  const header = (
    <div className="flex items-center justify-between w-full pr-4">
      <div className="font-medium text-base">{tableName || 'Unknown'}</div>
      <div className="flex items-center space-x-4 flex-1 justify-end max-w-2xl">
        <div className="w-48">
            <Progress percent={percent} steps={10} size="small" strokeColor={failCount > 0 ? '#ff4d4f' : '#52c41a'} />
        </div>
        <Space split={<span className="text-gray-300">|</span>}>
           <span>总数: {tableDataCount}</span>
           <span className="text-green-600">成功: {successCount}</span>
           <span className="text-red-600">失败: {failCount}</span>
           <span>过滤: {filterCnt}</span>
        </Space>
      </div>
    </div>
  );

  return (
    <Collapse className="mb-4 bg-white" defaultActiveKey={['1']}>
      <Panel header={header} key="1">
         <List
            size="small"
            header={<div className="font-semibold bg-gray-50 p-2 border-b">批次日志 (最新在前)</div>}
            bordered
            dataSource={allBatches}
            pagination={{ pageSize: 10, size: 'small' }}
            renderItem={item => (
              <List.Item>
                <div className="flex w-full items-center text-sm">
                    <Tag color="blue" className="w-20 text-center">Batch #{item.batchId}</Tag>
                    <span className="mx-2 w-32">Size: {item.batchSize}</span>
                    <span className="mx-2 flex-1 font-mono text-gray-500">ID Range: {item.minDataId} - {item.maxDataId}</span>
                    {item.status === 'success' ? (
                        <Tag color="success" icon={<CheckCircleOutlined />}>Success</Tag>
                    ) : (
                        <Tag color="error" icon={<CloseCircleOutlined />}>Failed</Tag>
                    )}
                </div>
              </List.Item>
            )}
         />
         {allBatches.length === 0 && <div className="text-gray-400 text-center py-2">等待批次数据...</div>}
      </Panel>
    </Collapse>
  );
};

export default LogSnapshotViewer;
