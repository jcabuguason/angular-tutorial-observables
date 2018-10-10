import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
import { SearchURLService } from './search-url.service';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { SpinnerModule } from 'primeng/spinner';
import { MessageService } from 'primeng/components/common/messageservice';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    AccordionModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    ChipsModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    InputTextModule,
    MenuModule,
    MessagesModule,
    MultiSelectModule,
    SpinnerModule,
  ],
  providers: [
    SearchService,
    SearchURLService,
    MessageService,
  ],
  declarations: [
    SearchComponent
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchModule { }
