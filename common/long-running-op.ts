export interface LongRunningOp {
  id: string;
  item: string;
  progress: number;
  running: boolean;
}
