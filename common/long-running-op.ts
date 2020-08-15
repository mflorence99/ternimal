export interface LongRunningOp {
  id: string;
  limit: number;
  progress: number;
  running: boolean;
}
