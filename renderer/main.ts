import { TernimalModule } from './app/module';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

if (!window['DEV_MODE'])
  enableProdMode();

platformBrowserDynamic()
  .bootstrapModule(TernimalModule)
  .catch(err => console.log(err));
