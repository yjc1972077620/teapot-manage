import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Empty, Progress, Space, Tag, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, PauseCircleOutlined, PlayCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import etlService from '../../../services/server/etl/etlService';
import type { EtlProgressSnapshot } from '../../../types/server/etl/etlType';

type RealtimeLogPanelProps = {
  instanceId?: number;
  snapshotId?: string;
  initialSnapshot?: EtlProgressSnapshot | null;
  title?: string;
  syncResult?: string;
};

type LogLine = {
  id: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SYSTEM';
  text: string;
};

type StageKey = 'start' | 'full_running' | 'full_done' | 'comp_start' | 'comp_running' | 'comp_done' | 'failed';

const BASE_FLOW: { key: StageKey; label: string }[] = [
  { key: 'start', label: '开始同步' },
  { key: 'full_running', label: '全量同步中' },
  { key: 'full_done', label: '全量同步完成' },
  { key: 'comp_start', label: '开始补偿同步' },
  { key: 'comp_running', label: '补偿同步中' },
  { key: 'comp_done', label: '补偿同步完成' },
];
const FAILED_STEP = { key: 'failed' as const, label: '同步失败' };

const LEVEL_STYLES: Record<LogLine['level'], string> = {
  INFO: 'text-sky-400',
  WARN: 'text-amber-400',
  ERROR: 'text-rose-400',
  DEBUG: 'text-emerald-300',
  SYSTEM: 'text-violet-300',
};

const deriveStage = (snapshot?: EtlProgressSnapshot | null, consoleText?: string): StageKey => {
  if (!snapshot) return 'start';
  const text = consoleText || '';
  const hasComp = text.includes('补偿');

  if (snapshot.syncFinished) {
    return hasComp ? 'comp_done' : 'full_done';
  }
  if (hasComp && text.includes('开始执行补偿全量同步')) return 'comp_start';
  if (hasComp && (text.includes('准备执行补偿同步') || text.includes('补偿任务'))) return 'comp_running';
  if (text.includes('批处理任务已提交到后台执行')) return 'full_running';
  if ((snapshot.totalCount || 0) > 0) return 'full_running';
  return 'start';
};

const isFailureSnapshot = (snapshot?: EtlProgressSnapshot | null): boolean => {
  if (!snapshot) return false;
  const failCount = Number(snapshot.failCount || 0);
  return failCount > 0;
};

const pickSnapshots = (list: EtlProgressSnapshot[]) => {
  if (list.length === 0) return { primarySnapshot: null, compSnapshot: null };
  const hintedComp = list.find(item => (item.consoleLog || '').includes('补偿'));
  const fallbackComp = list.length > 1 ? list[1] : undefined;
  const compSnapshot = hintedComp || fallbackComp || null;
  const primarySnapshot = list.find(item => item !== compSnapshot) || list[0] || null;
  return { primarySnapshot, compSnapshot };
};

const detectLevel = (line: string): LogLine['level'] => {
  if (line.includes('ERROR')) return 'ERROR';
  if (line.includes('WARN')) return 'WARN';
  if (line.includes('DEBUG')) return 'DEBUG';
  if (line.includes('SYSTEM')) return 'SYSTEM';
  return 'INFO';
};

const RealtimeLogPanel = ({ instanceId, snapshotId, initialSnapshot, title = '同步控制台', syncResult }: RealtimeLogPanelProps) => {
  const [snapshots, setSnapshots] = useState<EtlProgressSnapshot[]>(initialSnapshot ? [initialSnapshot] : []);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(true);
  const [logLines, setLogLines] = useState<LogLine[]>([]);
  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const lastCombinedLenRef = useRef(0);
  const lineIdRef = useRef(0);

  const appendLines = useCallback((text: string, reset: boolean) => {
    if (!text) return;
    const lines = text.split('\n').filter(Boolean);
    if (lines.length === 0) return;
    const newLines: LogLine[] = lines.map(line => ({
      id: ++lineIdRef.current,
      level: detectLevel(line),
      text: line
    }));
    setLogLines(prev => (reset ? newLines : [...prev, ...newLines]));
  }, []);

  const fetchSnapshot = useCallback(async (isBackground = false) => {
    if (!instanceId && !snapshotId) return;
    try {
      if (!isBackground) setLoading(true);
      const query = snapshotId ? { snapshotIdList: [snapshotId] } : { instanceIdList: [instanceId] };
      const response = await etlService.latestSnapshot(query);
      let list = response?.data || [];

      if ((!list || list.length === 0) && snapshotId) {
        const fallback = await etlService.listBySnapshotIds({ snapshotIdList: [snapshotId] });
        list = fallback?.data || [];
      }

      if (!list || list.length === 0) return;

      const combinedText = list.map(item => item?.consoleLog || '').join('\n');
      const isTruncated = combinedText.length < lastCombinedLenRef.current;

      if (isTruncated) {
        lastCombinedLenRef.current = 0;
        setLogLines([]);
      }

      if (combinedText.length >= lastCombinedLenRef.current) {
        const increment = combinedText.slice(lastCombinedLenRef.current);
        appendLines(increment, lastCombinedLenRef.current === 0 || isTruncated);
        lastCombinedLenRef.current = combinedText.length;
      }

      setSnapshots(list);
      const { primarySnapshot, compSnapshot } = pickSnapshots(list);
      const failureDetected = Boolean(syncResult?.includes('失败'));
      const allFinished = Boolean(primarySnapshot) && list.every(snapshot => snapshot.syncFinished);
      if (failureDetected || allFinished || (primarySnapshot?.syncFinished && (!compSnapshot || compSnapshot.syncFinished))) {
        setPolling(false);
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [appendLines, instanceId, snapshotId, syncResult]);

  useEffect(() => {
    lastCombinedLenRef.current = 0;
    lineIdRef.current = 0;
    setLogLines([]);
    fetchSnapshot();
  }, [fetchSnapshot, instanceId, snapshotId]);

  useEffect(() => {
    if (!polling) return;
    const intervalId = setInterval(() => {
      fetchSnapshot(true);
    }, 2000);
    return () => clearInterval(intervalId);
  }, [polling, fetchSnapshot]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logLines]);

  const activeSnapshot = useMemo(() => {
    const { compSnapshot, primarySnapshot } = pickSnapshots(snapshots);
    return compSnapshot || primarySnapshot || null;
  }, [snapshots]);

  const summaryCounts = useMemo(() => {
    return snapshots.reduce(
      (acc, snapshot) => ({
        total: acc.total + Number(snapshot.totalCount || 0),
        success: acc.success + Number(snapshot.successCount || 0),
        fail: acc.fail + Number(snapshot.failCount || 0),
        filter: acc.filter + Number(snapshot.filterCnt || 0),
      }),
      { total: 0, success: 0, fail: 0, filter: 0 }
    );
  }, [snapshots]);

  const progressPercent = useMemo(() => {
    if (summaryCounts.total === 0) return 0;
    return Math.min(100, Math.floor(((summaryCounts.success + summaryCounts.fail + summaryCounts.filter) / summaryCounts.total) * 100));
  }, [summaryCounts]);

  const hasFailure = useMemo(() => Boolean(syncResult?.includes('失败')), [syncResult]);
  const allFinished = useMemo(() => snapshots.length > 0 && snapshots.every(snapshot => snapshot.syncFinished), [snapshots]);
  const failedStageIndex = useMemo(() => {
    if (!hasFailure) return -1;
    const { primarySnapshot, compSnapshot } = pickSnapshots(snapshots);
    const compFailed = Boolean(compSnapshot && isFailureSnapshot(compSnapshot));
    const primaryFailed = Boolean(primarySnapshot && isFailureSnapshot(primarySnapshot));

    if (compFailed) return BASE_FLOW.findIndex(step => step.key === 'comp_running');
    if (primaryFailed) return BASE_FLOW.findIndex(step => step.key === 'full_running');
    return BASE_FLOW.findIndex(step => step.key === 'full_running');
  }, [hasFailure, snapshots]);

  const stepFlow = useMemo(() => {
    const { compSnapshot } = pickSnapshots(snapshots);
    const includesComp = Boolean(compSnapshot);
    const base = includesComp ? BASE_FLOW : BASE_FLOW.filter(step => !step.key.startsWith('comp_'));
    if (!hasFailure) return base;
    const insertIndex = failedStageIndex >= 0 ? failedStageIndex + 1 : base.length;
    const next = [...base];
    next.splice(Math.min(insertIndex, next.length), 0, FAILED_STEP);
    const failedIndex = next.findIndex(step => step.key === FAILED_STEP.key);
    return failedIndex >= 0 ? next.slice(0, failedIndex + 1) : next;
  }, [failedStageIndex, hasFailure, snapshots]);

  const stage = useMemo(() => {
    if (hasFailure) return 'failed';
    const { primarySnapshot, compSnapshot } = pickSnapshots(snapshots);
    const primary = primarySnapshot;
    const comp = compSnapshot;
    if (!primary) return 'start';
    if (comp) {
      if (comp.syncFinished) return 'comp_done';
      if (primary.syncFinished) {
        const compHasData = (comp.totalCount || 0) > 0 || (comp.consoleLog || '').length > 0;
        return compHasData ? 'comp_running' : 'comp_start';
      }
      return 'comp_start';
    }
    if (primary.syncFinished) return 'full_done';
    return deriveStage(primary, primary.consoleLog);
  }, [snapshots]);
  const stageIndex = stepFlow.findIndex(step => step.key === stage);

  const statusTag = hasFailure ? (
    <Tag color="error" icon={<CloseCircleOutlined />}>同步失败</Tag>
  ) : allFinished ? (
    <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>
  ) : (
    <Tag color="processing" icon={<ReloadOutlined spin />}>同步中</Tag>
  );

  return (
    <div className="space-y-4">
      <Card title={title} bordered={false} className="shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Space size="large" wrap>
            <div className="text-sm text-gray-500">
              实例ID: <span className="text-gray-900 font-medium">{activeSnapshot?.instanceId ?? instanceId ?? '-'}</span>
            </div>
            <div className="text-sm text-gray-500">
              快照ID: <span className="text-gray-900 font-medium">{activeSnapshot?.snapshotId ?? snapshotId ?? '-'}</span>
            </div>
            {statusTag}
          </Space>
          <Space>
            <Button
              type={polling ? 'default' : 'primary'}
              icon={polling ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
              onClick={() => setPolling(prev => !prev)}
              disabled={hasFailure || allFinished}
            >
              {polling ? '暂停刷新' : '继续刷新'}
            </Button>
          </Space>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4 text-sm">
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-gray-500">总量</div>
              <div className="text-lg font-semibold text-gray-900">{summaryCounts.total}</div>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-gray-500">成功</div>
              <div className="text-lg font-semibold text-emerald-600">{summaryCounts.success}</div>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-gray-500">失败</div>
              <div className="text-lg font-semibold text-rose-600">{summaryCounts.fail}</div>
            </div>
            <div className="rounded-lg bg-gray-50 px-3 py-2">
              <div className="text-gray-500">过滤</div>
              <div className="text-lg font-semibold text-amber-600">{summaryCounts.filter}</div>
            </div>
          </div>

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>状态流转</span>
            <span>{stageIndex >= 0 ? `${stageIndex + 1}/${stepFlow.length}` : '-'}</span>
          </div>
          <div className="relative flex items-center justify-between gap-2">
            <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-gray-200" />
            <div
              className="absolute left-0 top-4 h-1 rounded-full bg-emerald-400 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, (stageIndex / (stepFlow.length - 1)) * 100))}%` }}
            />
            {stepFlow.map((step, index) => {
              const isActive = index === stageIndex;
              const isDone = index < stageIndex || (activeSnapshot?.syncFinished && index <= stageIndex);
              const isFailed = step.key === 'failed';
              return (
                <div key={step.key} className="relative z-10 flex flex-1 flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                      isFailed ? 'border-rose-500 bg-rose-500 text-white' : isDone ? 'border-emerald-400 bg-emerald-400 text-white' : isActive ? 'border-sky-400 bg-white text-sky-500 shadow' : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className={`mt-2 text-xs ${isFailed ? 'text-rose-500' : isActive ? 'text-sky-500' : isDone ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>同步进度</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress percent={progressPercent} status={hasFailure ? 'exception' : (allFinished ? 'success' : 'active')} />
        </div>
      </Card>

      <Card bordered={false} className="shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Typography.Title level={5} className="!mb-0">控制台输出</Typography.Title>
          {loading && <Tag color="default">加载中</Tag>}
        </div>
        <div
          ref={logContainerRef}
          className="h-96 overflow-y-auto rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs leading-5 text-slate-200"
        >
          {logLines.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无日志输出" />
            </div>
          ) : (
            logLines.map(line => (
              <div key={line.id} className="flex gap-3 py-0.5">
                <span className="text-slate-500 shrink-0">•</span>
                <span className={`${LEVEL_STYLES[line.level]} shrink-0 w-12`}>{line.level}</span>
                <span className="whitespace-pre-wrap break-words">{line.text}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default RealtimeLogPanel;
