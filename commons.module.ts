import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule
  ]
})
export class CommonsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CommonsModule
    }
  }
}
