export interface LocalDeployOrgConfigRequest {
  dataCondition?: string;
  fieldCondition?: string;
  id?: number;
  instanceIdList?: number[];
  orgId?: number;
  pushTopic?: string;
}

export interface LocalDeployOrgConfigVO {
  dataCondition?: string;
  fieldCondition?: string;
  id?: number;
  instanceId?: number;
  orgId?: number;
  pushTopic?: string;
}
