import { Params } from './app/services/params';
import { TernimalModule } from './app/module';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import FontFaceObserver from 'fontfaceobserver';

if (!window['DEV_MODE']) enableProdMode();

new FontFaceObserver(Params.xtermFontFamily).load().then(() => {
  platformBrowserDynamic()
    .bootstrapModule(TernimalModule)
    .catch((err) => console.log(err));
});
