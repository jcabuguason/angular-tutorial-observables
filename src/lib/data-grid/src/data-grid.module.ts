import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { QaRendererComponent } from './renderers/qa-renderer.component';
import { DataFlagRendererComponent } from './renderers/dataflag-renderer.component';
import { QofRendererComponent } from './renderers/qof-renderer.component';
import { VofRendererComponent } from './renderers/vof-renderer.component';
import { StationInfoComponent } from './station-info/station-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import { LanguageModule } from 'msc-dms-commons-angular/shared/language';

@NgModule({
  declarations: [
    QaRendererComponent,
    DataFlagRendererComponent,
    QofRendererComponent,
    VofRendererComponent,
    StationInfoComponent,
  ],
  imports: [CommonModule, MatDialogModule, MatTableModule, MatDialogModule, MatSortModule, LanguageModule],
  exports: [QaRendererComponent, DataFlagRendererComponent, QofRendererComponent, VofRendererComponent],
  entryComponents: [StationInfoComponent],
})
export class DataGridModule {}
