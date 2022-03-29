/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ConfigParams {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  backupBucket: string;
  deployBucketLists: string[];
}

export interface HandleOssParams {
  method: any;
  ownerBucket?: string;
  args: Record<string, unknown>;
}
