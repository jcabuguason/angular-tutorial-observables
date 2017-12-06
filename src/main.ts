import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { LicenseManager } from 'ag-grid-enterprise/main';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_For_Production_1Devs6_January_2018__MTUxNTE5NjgwMDAwMA==26f908fcbd31ab5109aab8ba901fe020');

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
