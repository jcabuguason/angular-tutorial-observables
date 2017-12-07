import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DataGridService } from './data-grid.service';

import { QaRendererComponent } from './column-configuration/renderers/qa-renderer.component';
import { DataFlagRendererComponent } from './column-configuration/renderers/dataflag-renderer.component';
import { QofRendererComponent } from './column-configuration/renderers/qof-renderer.component';
import { VofRendererComponent } from './column-configuration/renderers/vof-renderer.component';


@NgModule({
  declarations: [
    QaRendererComponent,
    DataFlagRendererComponent,
    QofRendererComponent,
    VofRendererComponent,
  ],
  imports: [
    CommonModule,
  ],
  providers: [
  ],
  exports: [
    DataGridService,
    QaRendererComponent,
    DataFlagRendererComponent,
    QofRendererComponent,
    VofRendererComponent,
  ],
  bootstrap: []
})
export class DataGridModule { }
