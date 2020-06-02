import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { LanguageModule } from 'msc-dms-commons-angular/shared/language';
import { HelpMenuComponent } from './help-menu.component';

@NgModule({
  declarations: [HelpMenuComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    LanguageModule,
  ],
  exports: [HelpMenuComponent],
})
export class HelpMenuModule {}
