import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenuModule } from 'primeng/menu';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ChartFormComponent } from './chart-form.component';
import { LanguageModule } from 'msc-dms-commons-angular/shared/language';
import { CheckboxModule } from 'primeng/checkbox';

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
    MenuModule,
    MessagesModule,
    MultiSelectModule,
    SelectButtonModule,
    ToastModule,
    LanguageModule,
    CheckboxModule,
  ],
  providers: [MessageService],
  declarations: [ChartFormComponent],
  exports: [ChartFormComponent],
})
export class ChartFormModule {}
