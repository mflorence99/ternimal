export enum Channels {
  
  error = 'ternimal.error',

  fsChmod = 'file-system.chmod',
  fsHomeDir = 'file-system.homeDir',
  fsLoadPathRequest = 'file-system.loadPathRequest',
  fsLoadPathSuccess = 'file-system.loadPathSuccess',
  fsLoadPathFailure = 'file-system.loadPathFailure',
  fsParentDir = 'file-system.parentDir',
  fsPathSeparator= 'file-system.pathSeparator',
  fsRootDir = 'file-system.rootDir',

  localStorageClear = 'local-storage.clear',
  localStorageGetItem = 'local-storage.getItem',
  localStorageKey = 'local-storage.key',
  localStorageRemoveItem = 'local-storage.removeItem',
  localStorageSetItem = 'local-storage.setItem',

  openDevTools = 'toolbar.openDevTools',
  processListKill = 'ternimal.processListKill',
  processListRequest = 'ternimal.processListRequest',
  processListResponse = 'ternimal.processListResponse',
  reload = 'toolbar.reload',
  systemInfo = 'ternimal.systemInfo'

}
