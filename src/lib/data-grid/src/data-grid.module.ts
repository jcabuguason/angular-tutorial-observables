import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { QaRendererComponent } from './renderers/qa-renderer.component';
import { DataFlagRendererComponent } from './renderers/dataflag-renderer.component';
import { QofRendererComponent } from './renderers/qof-renderer.component';
import { VofRendererComponent } from './renderers/vof-renderer.component';
import { StationComponent } from './station-info/station-info.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material';
import { MatSortModule } from '@angular/material';




@NgModule({
  declarations: [
    QaRendererComponent,
    DataFlagRendererComponent,
    QofRendererComponent,
    VofRendererComponent,
    StationComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatDialogModule,
    MatSortModule
  ],
  exports: [
    QaRendererComponent,
    DataFlagRendererComponent,
    QofRendererComponent,
    VofRendererComponent,
  ],
  entryComponents: [StationComponent],
})
  export class DataGridModule { }
