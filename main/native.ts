import { Channels } from './common/channels';

import * as electron from 'electron';

const { clipboard, ipcMain } = electron;

ipcMain.on(Channels.nativeClipboardWrite, (_, text: string): void => {
  clipboard.writeText(text);
});
