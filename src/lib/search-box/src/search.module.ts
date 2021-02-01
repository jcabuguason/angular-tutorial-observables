import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LanguageModule } from 'msc-dms-commons-angular/shared/language';

import { SearchComponent } from './search.component';
import { SearchService } from './search.service';
import { SearchURLService } from './search-url.service';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    LanguageModule,

    AccordionModule,
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    ChipsModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    InputTextModule,
    MenuModule,
    MessagesModule,
    MultiSelectModule,
    InputNumberModule,
    SelectButtonModule,
  ],
  providers: [SearchService, SearchURLService, MessageService],
  declarations: [SearchComponent],
  exports: [SearchComponent],
})
export class SearchModule {}
