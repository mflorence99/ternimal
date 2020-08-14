export enum Channels {
  error = 'ternimal.error',

  fsChmod = 'file-system.chmod',
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

  localStorageClear = 'local-storage.clear',
  localStorageGetItem = 'local-storage.getItem',
  localStorageKey = 'local-storage.key',
  localStorageRemoveItem = 'local-storage.removeItem',
  localStorageSetItem = 'local-storage.setItem',

  nativeClipboardWrite = 'native.clipboardWrite',

  openDevTools = 'toolbar.openDevTools',

  processListKill = 'ternimal.processListKill',
  processListRequest = 'ternimal.processListRequest',
  processListResponse = 'ternimal.processListResponse',

  reload = 'toolbar.reload',
  systemInfo = 'ternimal.systemInfo'
}
