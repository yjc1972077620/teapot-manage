export type EsAliasParam = Record<string, unknown>;

export interface EtlSyncParam {
  conditionsContent?: string;
  conditionsType?: number;
  esAliasParam?: EsAliasParam;
  instanceId?: number;
  orgId?: number;
  params?: Record<string, unknown>[];
  snapshotId?: string;
}

export interface EtlSnapShotQuery {
  instanceIdList?: number[];
  snapshotIdList?: string[];
}

export interface EtlInfoVO {
  callSuccess?: boolean;
  errMsg?: string;
  snapshotId?: string;
}

export interface EtlProgressSnapshot {
  consoleLog?: string;
  failCount?: number;
  filterCnt?: number;
  instanceId?: number;
  instanceName?: string;
  logId?: number;
  orgId?: number;
  sharded?: boolean;
  snapshotId?: string;
  successCount?: number;
  syncFinished?: boolean;
  tableInfoList?: EtlProgressSnapshot_TableSyncInfo[];
  totalCount?: number;
}

export interface EtlProgressSnapshot_BatchInfo {
  batchId?: number;
  batchSize?: number;
  maxDataId?: number;
  minDataId?: number;
}

export interface EtlProgressSnapshot_TableSyncInfo {
  curBatch?: number;
  failBatchInfoList?: EtlProgressSnapshot_BatchInfo[];
  failCount?: number;
  filterCnt?: number;
  finishBatchInfoList?: EtlProgressSnapshot_BatchInfo[];
  successCount?: number;
  syncFinished?: boolean;
  tableDataCount?: number;
  tableName?: string;
  totalBatchCount?: number;
}
