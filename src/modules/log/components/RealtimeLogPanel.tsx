import React, { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Empty, Progress, Space, Tag, Typography } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import etlService from '../../../services/server/etl/etlService';
import type { EtlConsoleLogItem, EtlProgressSnapshot } from '../../../types/server/etl/etlType';

type RealtimeLogPanelProps = {
  expectCompensation?: boolean;
  initialSnapshot?: EtlProgressSnapshot | null;
  instanceId?: number;
  mode?: 'realtime' | 'detail' | 'auto';
  snapshotId?: string;
  syncResult?: string;
  title?: string;
};

type LogLine = {
  id: number;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SYSTEM';
  text: string;
};

type StageKey =
  | 'start'
  | 'full_running'
  | 'full_done'
  | 'comp_start'
  | 'comp_running'
  | 'comp_done'
  | 'breakpoint_running'
  | 'breakpoint_done'
  | 'failed';

type SnapshotPhase =
  | 'START'
  | 'FULL_RUNNING'
  | 'FULL_DONE'
  | 'COMP_START'
  | 'COMP_RUNNING'
  | 'COMP_DONE'
  | 'BREAKPOINT_RUNNING'
  | 'FAILED';

type SnapshotGroup = {
  ordered: EtlProgressSnapshot[];
  mainSnapshot: EtlProgressSnapshot | null;
  compSnapshot: EtlProgressSnapshot | null;
  breakpointSnapshot: EtlProgressSnapshot | null;
};

type MetricSummary = {
  fail: number;
  filter: number;
  success: number;
  total: number;
};

const POLL_INTERVAL_MS = 1200;
const CONSOLE_PAGE_LIMIT = 200;
const MAX_CONSOLE_DRAIN_ROUNDS = 50;

const EMPTY_METRICS: MetricSummary = {
  total: 0,
  success: 0,
  fail: 0,
  filter: 0,
};

const BASE_FLOW: { key: StageKey; label: string }[] = [
  { key: 'start', label: '开始同步' },
  { key: 'full_running', label: '全量同步中' },
  { key: 'full_done', label: '全量同步完成' },
  { key: 'comp_start', label: '开始补偿同步' },
  { key: 'comp_running', label: '补偿同步中' },
  { key: 'comp_done', label: '补偿同步完成' },
];

const BREAKPOINT_FLOW: { key: StageKey; label: string }[] = [
  { key: 'breakpoint_running', label: '断点续传中' },
  { key: 'breakpoint_done', label: '断点续传完成' },
];

const FAILED_STEP = { key: 'failed' as const, label: '同步失败' };

const LEVEL_STYLES: Record<LogLine['level'], string> = {
  INFO: 'text-sky-400',
  WARN: 'text-amber-400',
  ERROR: 'text-rose-400',
  DEBUG: 'text-emerald-300',
  SYSTEM: 'text-violet-300',
};

const sortSnapshots = (list: EtlProgressSnapshot[]) => {
  const deduped = new Map<string, EtlProgressSnapshot>();
  list.forEach(item => {
    const key = item.snapshotId || `${item.logId || 'unknown'}-${item.logType || 'x'}`;
    deduped.set(key, item);
  });
  return Array.from(deduped.values()).sort((left, right) => {
    const leftWeight = left.logType === 0 ? 0 : left.logType === 1 || left.logType === 2 ? 1 : 2;
    const rightWeight = right.logType === 0 ? 0 : right.logType === 1 || right.logType === 2 ? 1 : 2;
    if (leftWeight !== rightWeight) {
      return leftWeight - rightWeight;
    }
    return Number(left.logId || 0) - Number(right.logId || 0);
  });
};

const normalizeSnapshots = (list: EtlProgressSnapshot[]) => sortSnapshots(list.filter(Boolean));

const buildSeedSnapshots = (
  initialSnapshot?: EtlProgressSnapshot | null,
  snapshotId?: string,
  instanceId?: number
) => {
  const snapshot: EtlProgressSnapshot = initialSnapshot ? { ...initialSnapshot } : {};
  if (snapshotId && !snapshot.snapshotId) {
    snapshot.snapshotId = snapshotId;
  }
  if (instanceId != null && snapshot.instanceId == null) {
    snapshot.instanceId = instanceId;
  }
  if (!snapshot.snapshotId && snapshot.instanceId == null) {
    return [];
  }
  return normalizeSnapshots([snapshot]);
};

const groupSnapshots = (list: EtlProgressSnapshot[]): SnapshotGroup => {
  const ordered = normalizeSnapshots(list);
  const mainSnapshot = ordered.find(item => item.logType === 0) || null;
  const compSnapshot = ordered.find(item => item.logType === 1) || null;
  const breakpointSnapshot = ordered.find(item => item.logType === 2) || null;
  return {
    ordered,
    mainSnapshot: breakpointSnapshot ? null : (mainSnapshot || (!compSnapshot ? ordered[0] || null : mainSnapshot)),
    compSnapshot,
    breakpointSnapshot
  };
};

const phaseToStage = (phase?: string): StageKey | null => {
  const phaseKey = phase as SnapshotPhase | undefined;
  switch (phaseKey) {
    case 'START':
      return 'start';
    case 'FULL_RUNNING':
      return 'full_running';
    case 'FULL_DONE':
      return 'full_done';
    case 'COMP_START':
      return 'comp_start';
    case 'COMP_RUNNING':
      return 'comp_running';
    case 'COMP_DONE':
      return 'comp_done';
    case 'BREAKPOINT_RUNNING':
      return 'breakpoint_running';
    case 'FAILED':
      return 'failed';
    default:
      return null;
  }
};

const detectLevel = (line: string): LogLine['level'] => {
  if (line.includes('ERROR')) return 'ERROR';
  if (line.includes('WARN')) return 'WARN';
  if (line.includes('DEBUG')) return 'DEBUG';
  if (line.includes('SYSTEM')) return 'SYSTEM';
  return 'INFO';
};

const hasFailureState = (list: EtlProgressSnapshot[], syncResult?: string) =>
  list.some(item => item.phase === 'FAILED') || Boolean(syncResult?.includes('失败'));

const shouldWaitForCompensation = (
  snapshotGroup: SnapshotGroup,
  expectCompensation: boolean,
  hasFailure: boolean
) => {
  if (!expectCompensation || hasFailure) {
    return false;
  }
  if (snapshotGroup.breakpointSnapshot || snapshotGroup.compSnapshot) {
    return false;
  }
  return Boolean(snapshotGroup.mainSnapshot?.logType === 0 && snapshotGroup.mainSnapshot?.syncFinished);
};

const isChainTerminal = (
  snapshotGroup: SnapshotGroup,
  hasFailure: boolean,
  expectCompensation: boolean
) => {
  if (hasFailure) {
    return true;
  }
  if (snapshotGroup.breakpointSnapshot) {
    return Boolean(snapshotGroup.breakpointSnapshot.syncFinished);
  }
  if (snapshotGroup.compSnapshot) {
    return Boolean(snapshotGroup.compSnapshot.syncFinished);
  }
  if (!snapshotGroup.mainSnapshot) {
    return false;
  }
  if (!snapshotGroup.mainSnapshot.syncFinished) {
    return false;
  }
  return !shouldWaitForCompensation(snapshotGroup, expectCompensation, hasFailure);
};

const buildStepFlow = (snapshotGroup: SnapshotGroup, hasFailure: boolean) => {
  const { compSnapshot, breakpointSnapshot } = snapshotGroup;
  const base = breakpointSnapshot ? BREAKPOINT_FLOW : (compSnapshot ? BASE_FLOW : BASE_FLOW.filter(step => !step.key.startsWith('comp_')));
  if (!hasFailure) {
    return base;
  }
  const failureAnchor = breakpointSnapshot ? 'breakpoint_running' : (compSnapshot ? 'comp_running' : 'full_running');
  const insertIndex = base.findIndex(step => step.key === failureAnchor);
  const next = [...base];
  next.splice(insertIndex >= 0 ? insertIndex + 1 : next.length, 0, FAILED_STEP);
  return next;
};

const resolveStage = (snapshotGroup: SnapshotGroup, hasFailure: boolean): StageKey => {
  if (hasFailure) {
    return 'failed';
  }
  const { mainSnapshot, compSnapshot, breakpointSnapshot } = snapshotGroup;
  if (breakpointSnapshot) {
    return breakpointSnapshot.syncFinished ? 'breakpoint_done' : 'breakpoint_running';
  }
  if (compSnapshot) {
    const compStage = phaseToStage(compSnapshot.phase);
    if (compStage && compStage.startsWith('comp_')) {
      return compStage;
    }
    if (compSnapshot.syncFinished) {
      return 'comp_done';
    }
    return mainSnapshot?.syncFinished ? 'comp_start' : 'comp_running';
  }
  if (!mainSnapshot) {
    return 'start';
  }
  const mainStage = phaseToStage(mainSnapshot.phase);
  if (mainStage && (mainStage === 'start' || mainStage.startsWith('full_'))) {
    return mainStage;
  }
  return mainSnapshot.syncFinished ? 'full_done' : 'start';
};

const getConsoleSequence = (snapshotGroup: SnapshotGroup) => {
  if (snapshotGroup.breakpointSnapshot?.snapshotId) {
    return [snapshotGroup.breakpointSnapshot];
  }
  return [snapshotGroup.mainSnapshot, snapshotGroup.compSnapshot].filter(
    (item): item is EtlProgressSnapshot => Boolean(item?.snapshotId)
  );
};

const getStageSnapshot = (snapshotGroup: SnapshotGroup) =>
  snapshotGroup.breakpointSnapshot || snapshotGroup.compSnapshot || snapshotGroup.mainSnapshot || snapshotGroup.ordered[0] || null;

const getLiveConsoleSnapshot = (snapshotGroup: SnapshotGroup) =>
  snapshotGroup.breakpointSnapshot || snapshotGroup.compSnapshot || snapshotGroup.mainSnapshot || snapshotGroup.ordered[0] || null;

const toMetricSummary = (snapshot?: EtlProgressSnapshot | null): MetricSummary => ({
  total: Number(snapshot?.totalCount || 0),
  success: Number(snapshot?.successCount || 0),
  fail: Number(snapshot?.failCount || 0),
  filter: Number(snapshot?.filterCnt || 0),
});

const sumMetricSummary = (list: EtlProgressSnapshot[]) => list.reduce(
  (acc, snapshot) => ({
    total: acc.total + Number(snapshot.totalCount || 0),
    success: acc.success + Number(snapshot.successCount || 0),
    fail: acc.fail + Number(snapshot.failCount || 0),
    filter: acc.filter + Number(snapshot.filterCnt || 0),
  }),
  { ...EMPTY_METRICS }
);

const calcPercent = (metrics: MetricSummary) => {
  if (metrics.total === 0) {
    return 0;
  }
  return Math.min(100, Math.floor(((metrics.success + metrics.fail + metrics.filter) / metrics.total) * 100));
};

const getStageSummaryLabel = (snapshotGroup: SnapshotGroup) => {
  if (snapshotGroup.breakpointSnapshot) {
    return '断点阶段';
  }
  if (snapshotGroup.compSnapshot) {
    return '补偿阶段';
  }
  return '全量阶段';
};

const MetricsCard = ({
  metrics,
  percent,
  title,
  progressStatus,
}: {
  metrics: MetricSummary;
  percent: number;
  progressStatus: 'active' | 'success' | 'exception';
  title: string;
}) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
    <div className="mb-3 flex items-center justify-between text-sm text-gray-600">
      <span>{title}</span>
      <span>{percent}%</span>
    </div>
    <div className="grid gap-3 text-sm sm:grid-cols-4">
      <div>
        <div className="text-gray-500">总量</div>
        <div className="text-lg font-semibold text-gray-900">{metrics.total}</div>
      </div>
      <div>
        <div className="text-gray-500">成功</div>
        <div className="text-lg font-semibold text-emerald-600">{metrics.success}</div>
      </div>
      <div>
        <div className="text-gray-500">失败</div>
        <div className="text-lg font-semibold text-rose-600">{metrics.fail}</div>
      </div>
      <div>
        <div className="text-gray-500">过滤</div>
        <div className="text-lg font-semibold text-amber-600">{metrics.filter}</div>
      </div>
    </div>
    <div className="mt-4">
      <Progress percent={percent} status={progressStatus} />
    </div>
  </div>
);

const RealtimeLogPanel = ({
  expectCompensation = false,
  instanceId,
  snapshotId,
  initialSnapshot,
  mode = 'realtime',
  title = '同步控制台',
  syncResult,
}: RealtimeLogPanelProps) => {
  const initialSnapshots = useMemo(
    () => buildSeedSnapshots(initialSnapshot, snapshotId, instanceId),
    [initialSnapshot, instanceId, snapshotId]
  );
  const lockToSnapshotHistory = useMemo(() => {
    if (!snapshotId) {
      return false;
    }
    if (mode === 'detail') {
      return true;
    }
    if (mode !== 'auto') {
      return false;
    }
    if (syncResult?.includes('成功') || syncResult?.includes('失败')) {
      return true;
    }
    return isChainTerminal(
      groupSnapshots(initialSnapshots),
      hasFailureState(initialSnapshots, syncResult),
      expectCompensation
    );
  }, [expectCompensation, initialSnapshots, mode, snapshotId, syncResult]);

  const [snapshots, setSnapshots] = useState<EtlProgressSnapshot[]>(initialSnapshots);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(mode === 'realtime');
  const [liveMode, setLiveMode] = useState(mode === 'realtime');
  const [hasPendingConsole, setHasPendingConsole] = useState(false);
  const [logLines, setLogLines] = useState<LogLine[]>([]);
  const [pollTick, setPollTick] = useState(0);

  const logContainerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineIdRef = useRef(0);
  const runIdRef = useRef(0);
  const snapshotsRef = useRef<EtlProgressSnapshot[]>(initialSnapshots);
  const pollingRef = useRef(mode === 'realtime');
  const liveModeRef = useRef(mode === 'realtime');
  const hasPendingConsoleRef = useRef(false);
  const summaryFinishedRef = useRef(false);
  const currentConsoleSnapshotIdRef = useRef<string>();
  const consoleCursorRef = useRef<Record<string, number | undefined>>({});

  useEffect(() => {
    pollingRef.current = polling;
  }, [polling]);

  useEffect(() => {
    liveModeRef.current = liveMode;
  }, [liveMode]);

  useEffect(() => {
    hasPendingConsoleRef.current = hasPendingConsole;
  }, [hasPendingConsole]);

  const clearScheduledPoll = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const replaceSnapshots = useCallback((list: EtlProgressSnapshot[]) => {
    const nextSnapshots = normalizeSnapshots(list);
    snapshotsRef.current = nextSnapshots;
    startTransition(() => {
      setSnapshots(nextSnapshots);
    });
  }, []);

  const appendConsoleItems = useCallback((items: EtlConsoleLogItem[] = []) => {
    const nextLines: LogLine[] = [];
    items.forEach(item => {
      (item.content || '')
        .split('\n')
        .filter(Boolean)
        .forEach(text => {
          nextLines.push({
            id: ++lineIdRef.current,
            level: detectLevel(text),
            text
          });
        });
    });
    if (nextLines.length === 0) {
      return;
    }
    startTransition(() => {
      setLogLines(prev => [...prev, ...nextLines]);
    });
  }, []);

  const stopLive = useCallback(() => {
    clearScheduledPoll();
    pollingRef.current = false;
    setPolling(false);
    if (mode === 'auto') {
      liveModeRef.current = false;
      setLiveMode(false);
    }
  }, [clearScheduledPoll, mode]);

  const resetPanelState = useCallback(() => {
    clearScheduledPoll();
    runIdRef.current += 1;
    lineIdRef.current = 0;
    consoleCursorRef.current = {};
    currentConsoleSnapshotIdRef.current = undefined;
    summaryFinishedRef.current = false;
    hasPendingConsoleRef.current = false;

    const nextSnapshots = buildSeedSnapshots(initialSnapshot, snapshotId, instanceId);
    snapshotsRef.current = nextSnapshots;

    const startLive = mode === 'realtime';
    pollingRef.current = startLive;
    liveModeRef.current = startLive;

    startTransition(() => {
      setSnapshots(nextSnapshots);
      setLogLines([]);
      setHasPendingConsole(false);
      setPollTick(0);
    });
    setPolling(startLive);
    setLiveMode(startLive);
    return runIdRef.current;
  }, [clearScheduledPoll, initialSnapshot, instanceId, mode, snapshotId]);

  const fetchConsoleStream = useCallback(async (runId: number, targetSnapshotId: string, drain = false) => {
    let afterId = consoleCursorRef.current[targetSnapshotId];
    let hasMore = false;

    try {
      for (let round = 0; round < MAX_CONSOLE_DRAIN_ROUNDS; round += 1) {
        const response = await etlService.listConsoleLogs({
          snapshotId: targetSnapshotId,
          afterId,
          limit: CONSOLE_PAGE_LIMIT
        });

        if (runId !== runIdRef.current) {
          return false;
        }

        const page = response?.data;
        const items = page?.items || [];
        appendConsoleItems(items);
        afterId = page?.nextAfterId ?? afterId;
        consoleCursorRef.current[targetSnapshotId] = afterId;
        hasMore = Boolean(page?.hasMore) && items.length > 0;

        if (!drain || !hasMore) {
          break;
        }
      }
    } catch (error) {
      console.error('Fetch console log error:', error);
      if (runId !== runIdRef.current) {
        return false;
      }
    }

    return hasMore;
  }, [appendConsoleItems]);

  const fetchSnapshotSummary = useCallback(async (runId: number, isBackground = false) => {
    if (!instanceId && !snapshotId) {
      return snapshotsRef.current;
    }

    try {
      if (!isBackground) {
        setLoading(true);
      }

      let list: EtlProgressSnapshot[] = [];

      if (lockToSnapshotHistory && snapshotId) {
        list = (await etlService.listBySnapshotIds({ snapshotIdList: [snapshotId] }))?.data || [];
      } else {
        const query = instanceId ? { instanceIdList: [instanceId] } : { snapshotIdList: [snapshotId!] };
        list = (await etlService.latestSnapshot(query))?.data || [];
        if (list.length === 0 && snapshotId) {
          list = (await etlService.listBySnapshotIds({ snapshotIdList: [snapshotId] }))?.data || [];
        }
      }

      if (runId !== runIdRef.current) {
        return snapshotsRef.current;
      }

      const nextSnapshots = list.length > 0 ? normalizeSnapshots(list) : snapshotsRef.current;
      if (list.length > 0) {
        replaceSnapshots(nextSnapshots);
      }

      const nextSnapshotGroup = groupSnapshots(nextSnapshots);
      const finished = isChainTerminal(
        nextSnapshotGroup,
        hasFailureState(nextSnapshots, syncResult),
        expectCompensation
      );
      summaryFinishedRef.current = finished;

      return nextSnapshots;
    } catch (error) {
      console.error('Fetch snapshot summary error:', error);
      return snapshotsRef.current;
    } finally {
      if (!isBackground && runId === runIdRef.current) {
        setLoading(false);
      }
    }
  }, [expectCompensation, instanceId, lockToSnapshotHistory, replaceSnapshots, snapshotId, syncResult]);

  const drainConsoleHistory = useCallback(async (runId: number, sourceSnapshots?: EtlProgressSnapshot[]) => {
    const snapshotGroup = groupSnapshots(sourceSnapshots || snapshotsRef.current);
    const consoleSequence = getConsoleSequence(snapshotGroup);

    for (const target of consoleSequence) {
      if (!target.snapshotId) {
        continue;
      }
      await fetchConsoleStream(runId, target.snapshotId, true);
      if (runId !== runIdRef.current) {
        return false;
      }
    }

    const liveSnapshot = getLiveConsoleSnapshot(snapshotGroup);
    currentConsoleSnapshotIdRef.current = liveSnapshot?.snapshotId;
    hasPendingConsoleRef.current = false;
    setHasPendingConsole(false);
    return false;
  }, [fetchConsoleStream]);

  const pullLiveConsole = useCallback(async (runId: number, sourceSnapshots?: EtlProgressSnapshot[]) => {
    const snapshotGroup = groupSnapshots(sourceSnapshots || snapshotsRef.current);
    const consoleSequence = getConsoleSequence(snapshotGroup);
    const liveSnapshot = getLiveConsoleSnapshot(snapshotGroup);
    const liveSnapshotId = liveSnapshot?.snapshotId;

    if (!liveSnapshotId || consoleSequence.length === 0) {
      hasPendingConsoleRef.current = false;
      setHasPendingConsole(false);
      return false;
    }

    const targetIndex = consoleSequence.findIndex(item => item.snapshotId === liveSnapshotId);
    if (currentConsoleSnapshotIdRef.current !== liveSnapshotId && targetIndex > 0) {
      for (let index = 0; index < targetIndex; index += 1) {
        const previousTarget = consoleSequence[index];
        if (!previousTarget?.snapshotId) {
          continue;
        }
        await fetchConsoleStream(runId, previousTarget.snapshotId, true);
        if (runId !== runIdRef.current) {
          return false;
        }
      }
    }

    currentConsoleSnapshotIdRef.current = liveSnapshotId;
    const hasMore = await fetchConsoleStream(runId, liveSnapshotId, false);
    if (runId !== runIdRef.current) {
      return false;
    }

    hasPendingConsoleRef.current = hasMore;
    setHasPendingConsole(hasMore);
    return hasMore;
  }, [fetchConsoleStream]);

  const scheduleNextPoll = useCallback(() => {
    clearScheduledPoll();
    if (!pollingRef.current || !liveModeRef.current) {
      return;
    }
    timerRef.current = setTimeout(() => {
      setPollTick(prev => prev + 1);
    }, POLL_INTERVAL_MS);
  }, [clearScheduledPoll]);

  useEffect(() => {
    const currentRunId = resetPanelState();

    void (async () => {
      const nextSnapshots = await fetchSnapshotSummary(currentRunId, false);
      if (currentRunId !== runIdRef.current) {
        return;
      }

      if (mode === 'detail') {
        await drainConsoleHistory(currentRunId, nextSnapshots);
        return;
      }

      const finished = isChainTerminal(
        groupSnapshots(nextSnapshots),
        hasFailureState(nextSnapshots, syncResult),
        expectCompensation
      );

      if (mode === 'auto' && finished) {
        await drainConsoleHistory(currentRunId, nextSnapshots);
        stopLive();
        return;
      }

      if (mode === 'auto') {
        liveModeRef.current = true;
        pollingRef.current = true;
        setLiveMode(true);
        setPolling(true);
      }

      const hasMore = await pullLiveConsole(currentRunId, nextSnapshots);
      if (currentRunId !== runIdRef.current) {
        return;
      }

      if (summaryFinishedRef.current && !hasMore) {
        stopLive();
        return;
      }

      scheduleNextPoll();
    })();

    return () => {
      clearScheduledPoll();
      runIdRef.current += 1;
    };
  }, [
    clearScheduledPoll,
    drainConsoleHistory,
    expectCompensation,
    fetchSnapshotSummary,
    initialSnapshot,
    instanceId,
    mode,
    pullLiveConsole,
    resetPanelState,
    scheduleNextPoll,
    snapshotId,
    stopLive,
    syncResult
  ]);

  useEffect(() => {
    if (pollTick === 0 || !polling || !liveMode) {
      return;
    }

    const currentRunId = runIdRef.current;

    void (async () => {
      const nextSnapshots = await fetchSnapshotSummary(currentRunId, true);
      if (currentRunId !== runIdRef.current) {
        return;
      }

      const hasMore = await pullLiveConsole(currentRunId, nextSnapshots);
      if (currentRunId !== runIdRef.current) {
        return;
      }

      if (summaryFinishedRef.current && !hasMore) {
        stopLive();
        return;
      }

      scheduleNextPoll();
    })();
  }, [fetchSnapshotSummary, liveMode, pollTick, polling, pullLiveConsole, scheduleNextPoll, stopLive]);

  useEffect(() => {
    return () => clearScheduledPoll();
  }, [clearScheduledPoll]);

  useEffect(() => {
    if (!logContainerRef.current) {
      return;
    }
    logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
  }, [logLines]);

  const snapshotGroup = useMemo(() => groupSnapshots(snapshots), [snapshots]);
  const activeSnapshot = useMemo(() => getStageSnapshot(snapshotGroup), [snapshotGroup]);
  const currentMetrics = useMemo(() => toMetricSummary(activeSnapshot), [activeSnapshot]);
  const overallMetrics = useMemo(() => sumMetricSummary(snapshots), [snapshots]);
  const currentPercent = useMemo(() => calcPercent(currentMetrics), [currentMetrics]);
  const overallPercent = useMemo(() => calcPercent(overallMetrics), [overallMetrics]);
  const hasFailure = useMemo(() => hasFailureState(snapshots, syncResult), [snapshots, syncResult]);
  const chainFinished = useMemo(
    () => isChainTerminal(snapshotGroup, hasFailure, expectCompensation),
    [expectCompensation, hasFailure, snapshotGroup]
  );
  const allFinished = useMemo(
    () => snapshots.length > 0 && snapshots.every(snapshot => snapshot.syncFinished),
    [snapshots]
  );
  const stepFlow = useMemo(() => buildStepFlow(snapshotGroup, hasFailure), [hasFailure, snapshotGroup]);
  const stage = useMemo(() => resolveStage(snapshotGroup, hasFailure), [hasFailure, snapshotGroup]);
  const stageIndex = stepFlow.findIndex(step => step.key === stage);
  const stageSummaryLabel = useMemo(() => getStageSummaryLabel(snapshotGroup), [snapshotGroup]);
  const consoleStageLabel = activeSnapshot?.logType === 2 ? '断点日志' : activeSnapshot?.logType === 1 ? '补偿日志' : '全量日志';
  const progressStatus = hasFailure ? 'exception' : (chainFinished && !hasPendingConsole ? 'success' : 'active');
  const statusTag = hasFailure ? (
    <Tag color="error" icon={<CloseCircleOutlined />}>同步失败</Tag>
  ) : chainFinished && !hasPendingConsole ? (
    <Tag color="success" icon={<CheckCircleOutlined />}>已完成</Tag>
  ) : (
    <Tag color="processing" icon={<ReloadOutlined spin />}>同步中</Tag>
  );

  const trackWidth = stepFlow.length > 1 && stageIndex >= 0 ? (stageIndex / (stepFlow.length - 1)) * 100 : 0;
  const refreshButtonDisabled = hasFailure || (chainFinished && !hasPendingConsole) || (!liveMode && !snapshots.length);
  const refreshButtonLabel = liveMode ? (polling ? '暂停刷新' : '继续刷新') : '重新加载';
  const refreshButtonType = liveMode ? (polling ? 'default' : 'primary') : 'default';
  const refreshButtonIcon = liveMode ? (polling ? <PauseCircleOutlined /> : <PlayCircleOutlined />) : <ReloadOutlined />;

  const handleRefreshClick = () => {
    if (liveMode) {
      setPolling(prev => {
        const next = !prev;
        pollingRef.current = next;
        if (next) {
          scheduleNextPoll();
        } else {
          clearScheduledPoll();
        }
        return next;
      });
      return;
    }

    const currentRunId = runIdRef.current;
    void (async () => {
      const nextSnapshots = await fetchSnapshotSummary(currentRunId, false);
      if (currentRunId !== runIdRef.current) {
        return;
      }
      await drainConsoleHistory(currentRunId, nextSnapshots);
    })();
  };

  return (
    <div className="space-y-4">
      <Card title={title} bordered={false} className="shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Space size="large" wrap>
            <div className="text-sm text-gray-500">
              实例ID: <span className="text-gray-900 font-medium">{activeSnapshot?.instanceId ?? instanceId ?? '-'}</span>
            </div>
            <div className="text-sm text-gray-500">
              当前快照: <span className="text-gray-900 font-medium">{activeSnapshot?.snapshotId ?? snapshotId ?? '-'}</span>
            </div>
            {statusTag}
          </Space>
          <Space>
            <Button
              type={refreshButtonType}
              icon={refreshButtonIcon}
              onClick={handleRefreshClick}
              disabled={refreshButtonDisabled}
            >
              {refreshButtonLabel}
            </Button>
          </Space>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <MetricsCard
            title={`${stageSummaryLabel}统计`}
            metrics={currentMetrics}
            percent={currentPercent}
            progressStatus={progressStatus}
          />
          <MetricsCard
            title="整体汇总统计"
            metrics={overallMetrics}
            percent={overallPercent}
            progressStatus={progressStatus}
          />
        </div>

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/70 px-4 py-3">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
            <span>状态流转</span>
            <span>{stageIndex >= 0 ? `${stageIndex + 1}/${stepFlow.length}` : '-'}</span>
          </div>
          <div className="relative flex items-center justify-between gap-2">
            <div className="absolute left-0 right-0 top-4 h-1 rounded-full bg-gray-200" />
            <div
              className="absolute left-0 top-4 h-1 rounded-full bg-emerald-400 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, trackWidth))}%` }}
            />
            {stepFlow.map((step, index) => {
              const isActive = index === stageIndex;
              const isDone = index < stageIndex || ((allFinished && !hasPendingConsole) && index <= stageIndex);
              const isFailed = step.key === 'failed';
              return (
                <div key={step.key} className="relative z-10 flex flex-1 flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-all ${
                      isFailed
                        ? 'border-rose-500 bg-rose-500 text-white'
                        : isDone
                          ? 'border-emerald-400 bg-emerald-400 text-white'
                          : isActive
                            ? 'border-sky-400 bg-white text-sky-500 shadow'
                            : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={`mt-2 text-xs ${
                      isFailed
                        ? 'text-rose-500'
                        : isActive
                          ? 'text-sky-500'
                          : isDone
                            ? 'text-emerald-500'
                            : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card bordered={false} className="shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <Typography.Title level={5} className="!mb-0">控制台输出</Typography.Title>
          <Space>
            <Tag color="blue">{consoleStageLabel}</Tag>
            {hasPendingConsole && <Tag color="processing">继续追日志</Tag>}
            {loading && <Tag color="default">加载中</Tag>}
          </Space>
        </div>
        <div
          ref={logContainerRef}
          className="h-96 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-200"
        >
          {logLines.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无日志输出" />
            </div>
          ) : (
            logLines.map(line => (
              <div key={line.id} className="flex gap-3 py-0.5">
                <span className="shrink-0 text-slate-500">•</span>
                <span className={`${LEVEL_STYLES[line.level]} w-12 shrink-0`}>{line.level}</span>
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
