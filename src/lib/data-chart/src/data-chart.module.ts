import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { LanguageModule } from 'msc-dms-commons-angular/shared/language';
import exporting from 'highcharts/modules/exporting.src';
import offline_exporting from 'highcharts/modules/offline-exporting.src';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [exporting, offline_exporting];
}

@NgModule({
  declarations: [],
  imports: [CommonModule, ChartModule, LanguageModule],
  providers: [{ provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }],
  exports: [],
})
export class DataChartModule {}
