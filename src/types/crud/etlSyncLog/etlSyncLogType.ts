export interface EtlSyncLogParam {
  createTime?: string;
  errorMsg?: string;
  failCount?: number;
  id?: number;
  logType?: number;
  operateUserId?: number;
  relateLog?: number;
  srcDsInfo?: string;
  successCount?: number;
  syncEndTime?: string;
  syncInstanceId?: number;
  syncInstanceName?: string;
  syncResult?: number;
  syncStartTime?: string;
  syncType?: number;
  targetDsInfo?: string;
  timeConsuming?: number;
  topic?: string;
  totalCount?: number;
  updateTime?: string;
}

export interface EtlSyncLogPageQuery {
  createTimeEnd?: string;
  createTimeStart?: string;
  id?: number;
  logTypeList?: number[];
  pageNo?: number;
  pageSize?: number;
  snapshotIdList?: string[];
  syncInstanceId?: number;
  syncInstanceName?: string;
  syncResult?: number;
  syncType?: number;
}

export interface EtlSyncLogQuery {
  id?: number;
  logType?: number;
  syncInstanceId?: number;
  syncInstanceName?: string;
  syncResult?: number;
  syncType?: number;
  topic?: string;
}

export interface EtlProgressSnapshot {
  failCount?: number;
  filterCnt?: number;
  instanceId?: number;
  instanceName?: string;
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

export interface EtlSyncLogVO {
  createTime?: string;
  errorMsg?: string;
  failCount?: number;
  id?: number;
  logType?: number;
  operateUserId?: number;
  relateLog?: EtlSyncLogVO;
  snapshotId?: string;
  snapshotJson?: EtlProgressSnapshot;
  srcDsInfo?: string;
  successCount?: number;
  syncEndTime?: string;
  syncInstanceId?: number;
  syncInstanceName?: string;
  syncResult?: string;
  syncStartTime?: string;
  syncType?: string;
  targetDsInfo?: string;
  timeConsuming?: number;
  topic?: string;
  totalCount?: number;
  updateTime?: string;
}
