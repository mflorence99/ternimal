export interface ProcessDescriptor {
  cmd: string;
  cpu: number;
  ctime: number;
  elapsed: number;
  memory: number;
  name: string;
  pid: number;
  ppid: number;
  timestamp: number;
  uid: string;
}

export type ProcessList = ProcessDescriptor[];
