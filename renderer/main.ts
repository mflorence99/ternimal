import { Params } from './app/services/params';
import { TernimalModule } from './app/module';

import { ApplicationRef } from '@angular/core';

import { enableDebugTools } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import FontFaceObserver from 'fontfaceobserver';

if (!window['DEV_MODE']) enableProdMode();

new FontFaceObserver(Params.xtermFontFamily).load().then(() => {
  platformBrowserDynamic()
    .bootstrapModule(TernimalModule)
    .then((moduleRef) => {
      // @see https://blog.ninja-squad.com/2018/09/20/angular-performances-part-3/
      if (window['DEV_MODE']) {
        const applicationRef = moduleRef.injector.get(ApplicationRef);
        const componentRef = applicationRef.components[0];
        enableDebugTools(componentRef);
      }
    })
    .catch((err) => console.log(err));
});
