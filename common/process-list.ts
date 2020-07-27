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
}

export type ProcessList = ProcessDescriptor[];
