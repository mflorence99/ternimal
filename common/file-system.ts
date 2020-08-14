export interface FileDescriptor {
  atime: Date;
  btime: Date;
  color: string;
  group: number;
  icon: string[];
  isDirectory: boolean;
  isExecutable: boolean;
  isFile: boolean;
  isReadable: boolean;
  isSymlink: boolean;
  isWritable: boolean;
  mode: string;
  mtime: Date;
  name: string;
  path: string;
  size: number;
  user: string;
}

export interface ParsedPath {
  base: string;
  dir: string;
  ext: string;
  name: string;
  root: string;
}
