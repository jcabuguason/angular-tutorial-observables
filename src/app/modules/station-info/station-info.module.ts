import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StationInfoComponent } from './station-info.component';

@NgModule({
  declarations: [
    StationInfoComponent
  ],
  imports: [
    CommonModule,
  ],
  providers: [
  ],
  exports: [
    StationInfoComponent
  ],
  bootstrap: [StationInfoComponent]
})
export class StationInfoModule { }
