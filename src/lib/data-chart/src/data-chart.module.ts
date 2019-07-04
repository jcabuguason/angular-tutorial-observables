import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import { LanguageModule } from 'msc-dms-commons-angular/shared/language';

@NgModule({
  declarations: [],
  imports: [CommonModule, HighchartsChartModule, LanguageModule],
  exports: [],
})
export class DataChartModule {}
