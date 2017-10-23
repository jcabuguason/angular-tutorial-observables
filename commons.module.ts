import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    NgxChartsModule
  ]
})
export class CommonsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonsModule
    }
  }
}
