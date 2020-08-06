export interface PathDescriptor {
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
