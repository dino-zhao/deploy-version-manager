/* eslint-disable @typescript-eslint/no-explicit-any */
interface DeployBucket {
  name: string;
  paths: string[];
  targetBucket?: string;
}

export interface ConfigParams {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  backupBucket: string;
  deployBucketLists: DeployBucket[];
}

export interface HandleOssParams {
  method: any;
  ownerBucket?: string;
  args?: any[];
}

export interface ProjectItem {
  name: string;
  path?: string;
  targetBucket?: string;
}
