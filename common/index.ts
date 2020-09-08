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
  loadTheme = 'themes.loadTheme',

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

// NOTE: for testing
globalThis.TERNIMAL_CHANNELS = {};
type CB = (...args: any) => any | Promise<any>;
export const on = (channel: Channels | string, cb?: CB): CB => {
  if (cb) globalThis.TERNIMAL_CHANNELS[channel] = cb;
  return globalThis.TERNIMAL_CHANNELS[channel];
};

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

export interface Theme {
  colors: {
    bright: ThemeColors;
    cursor: {
      cursor: string;
      text: string;
    };
    normal: ThemeColors;
    primary: {
      background: string;
      foreground: string;
    };
    selection: {
      background: string;
      text: string;
    };
  };
}

export interface ThemeColors {
  black: string;
  blue: string;
  cyan: string;
  green: string;
  magenta: string;
  red: string;
  white: string;
  yellow: string;
}

export const cwdDebounceTimeout = 500;

export const maxScrollback = 5000;

export const numParallelOps = 8;

export const rreaddirBudgetCount = 100000;
export const rreaddirBudgetTime = 5000;
export const rreaddirCacheTTL = 15 * 60 * 1000;
