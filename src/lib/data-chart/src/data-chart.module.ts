import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataChartService } from './data-chart.service';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import exporting from 'highcharts/modules/exporting.src';
import { LanguageModule } from 'msc-dms-commons-angular/shared/language';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [ exporting ];
}

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ChartModule,
    LanguageModule
  ],
  providers: [
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
  ],
  exports: [
  ]
})
export class DataChartModule { }
