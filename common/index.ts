export interface AnalysisByExt {
  [path: string]: {
    color: string;
    count: number;
    icon: string[];
    size: number;
  };
}

export enum Channels {
  error = 'ternimal.error',

  // NOTE: channels ending in "..." are suffixed with an unique ID,
  // targeted to a single listener

  fsAnalyze = 'file-system.analyze',
  fsAnalyzeCompleted = 'file-system.analyzeCompleted',
  fsChmod = 'file-system.chmod',
  fsCopy = 'file-system.copy',
  fsCopyCompleted = 'file-system.copyCompleted...',
  fsMove = 'file-system.move',
  fsMoveCompleted = 'file-system.moveCompleted...',
  fsDelete = 'file-system.delete',
  fsExists = 'file-system.exists',
  fsHomeDir = 'file-system.homeDir',
  fsLoadPathRequest = 'file-system.loadPathRequest',
  fsLoadPathSuccess = 'file-system.loadPathSuccess',
  fsLoadPathFailure = 'file-system.loadPathFailure',
  fsNewDir = 'file-system.newDir',
  fsNewFile = 'file-system.newFile',
  fsParentDir = 'file-system.parentDir',
  fsParsePath = 'file-system.parsePath',
  fsPathSeparator = 'file-system.pathSeparator',
  fsRename = 'file-system.rename',
  fsRootDir = 'file-system.rootDir',
  fsTouch = 'file-system.touch',
  fsTrash = 'file-system.trash',

  getAvailableFonts = 'fonts.getAvailableFonts',
  getAvailableThemes = 'themes.getAvailableThemes',

  localStorageClear = 'local-storage.clear',
  localStorageGetItem = 'local-storage.getItem',
  localStorageKey = 'local-storage.key',
  localStorageRemoveItem = 'local-storage.removeItem',
  localStorageSetItem = 'local-storage.setItem',

  longRunningOpCancel = 'long-running-op.cancel',
  longRunningOpProgress = 'long-running-op.progress',

  nativeClipboardClear = 'native.clipboardClear',
  nativeClipboardRead = 'native.clipboardRead',
  nativeClipboardWrite = 'native.clipboardWrite',
  nativeDragStart = 'native.dragStart',
  nativeOpen = 'native.open',

  openDevTools = 'toolbar.openDevTools',

  processListKill = 'ternimal.processListKill',
  processListRequest = 'ternimal.processListRequest',
  processListResponse = 'ternimal.processListResponse',

  reload = 'toolbar.reload',
  systemInfo = 'ternimal.systemInfo',

  xtermConnect = 'xterm.connect',
  xtermCWD = 'xterm.cwd',
  xtermDisconnect = 'xterm.disconnect',
  xtermKill = 'xterm.kill',
  xtermToPty = 'xterm.data2pty',
  xtermFromPty = 'xterm.data2xterm',
  xtermResizePty = 'xterm.resizepty'
}

export interface Chmod {
  group: ChmodFlags;
  others: ChmodFlags;
  owner: ChmodFlags;
}

export interface ChmodFlags {
  execute: boolean | null;
  read: boolean | null;
  write: boolean | null;
}

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

export interface LongRunningOp {
  id: string;
  item: string;
  progress: number;
  running: boolean;
}

export interface ParsedPath {
  base: string;
  dir: string;
  ext: string;
  name: string;
  root: string;
}

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

export interface SystemInfo {
  cpuUsage: number;
  memUsage: number;
}

export const debounceTime = 500;

export const maxScrollback = 5000;

export const numParallelOps = 8;
