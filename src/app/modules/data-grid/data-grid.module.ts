import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { QaRendererComponent } from './renderers/qa-renderer.component';
import { DataFlagRendererComponent } from './renderers/dataflag-renderer.component';
import { QofRendererComponent } from './renderers/qof-renderer.component';
import { VofRendererComponent } from './renderers/vof-renderer.component';


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
    QaRendererComponent,
    DataFlagRendererComponent,
    QofRendererComponent,
    VofRendererComponent,
  ],
  bootstrap: []
})
export class DataGridModule { }
