import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { SearchService } from './search.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    SearchService
  ],
  declarations: [
    SearchComponent
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchModule { }
