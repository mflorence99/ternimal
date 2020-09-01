import * as process from 'process';

interface IBasePtyForkOptions {
  cols?: number;
  cwd?: string;
  encoding?: string | null;
  env?: { [key: string]: string };
  name?: string;
  rows?: number;
}

interface IPty {
  cols?: number;
  kill?: (signal?: string) => void;
  onData?: (data: string) => void;
  pid?: number;
  process?: string;
  resize?: (columns: number, rows: number) => void;
  rows?: number;
  write?: (data: string) => void;
}

const nodePty = {
  spawn: (
    _file: string,
    _args: string[] | string,
    _options: IBasePtyForkOptions
  ): IPty => {
    return {
      kill: jest.fn(),
      onData: jest.fn(),
      pid: process.pid,
      resize: jest.fn(),
      write: jest.fn()
    };
  }
};

export = nodePty;
