export interface CanalInstanceStatisticRequest {
  env?: string;
}

export interface CreateCanalInstanceParam {
  bindTopic?: boolean;
  instanceId?: number;
  instanceIdList?: number[];
  localDeploy?: boolean;
  singleTable?: boolean;
}

export interface CanalInstanceCreateVO {
  canalInstanceId?: string;
  canalInstanceName?: string;
  createCanalInstanceSuccess?: boolean;
  createInstanceFailReason?: string;
  createTopicFailReason?: string;
  createTopicSuccess?: boolean;
  dbName?: string;
  existCanalInstanceTableNameList?: string[];
  syncInstanceIdStr?: string;
  tableNameList?: string[];
  tableTopicMap?: {
  [key: string]: string;
};
}
