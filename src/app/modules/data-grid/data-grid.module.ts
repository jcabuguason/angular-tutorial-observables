import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from 'ag-grid-angular/main';

import { DataGridComponent } from './data-grid.component';
import { DataGridService } from './data-grid.service';

import { MidasColumnConfiguration } from './column-configuration/midas-column-configuration.class';
import { NMTColumnConfiguration } from './column-configuration/nmt-column-configuration.class';
import { QaRendererComponent } from './column-configuration/renderers/qa-renderer.component';
import { DataFlagRendererComponent } from './column-configuration/renderers/dataflag-renderer.component';
import { QofRendererComponent } from './column-configuration/renderers/qof-renderer.component';
import { VofRendererComponent } from './column-configuration/renderers/vof-renderer.component';
import { MidasEditorComponent } from './column-configuration/editors/midas-editor.component';


@NgModule({
  declarations: [
    DataGridComponent,
    MidasColumnConfiguration,
    NMTColumnConfiguration,
    QaRendererComponent,
    DataFlagRendererComponent,
    QofRendererComponent,
    VofRendererComponent,
    MidasEditorComponent
  ],
  imports: [
    CommonModule,
    AgGridModule.withComponents([
      MidasColumnConfiguration,
      NMTColumnConfiguration,
      QaRendererComponent,
      DataFlagRendererComponent,
      QofRendererComponent,
      VofRendererComponent,
      MidasEditorComponent
    ])
  ],
  providers: [
  ],
  exports: [
    DataGridComponent
  ],
  bootstrap: [DataGridComponent]
})
export class DataGridModule { }
