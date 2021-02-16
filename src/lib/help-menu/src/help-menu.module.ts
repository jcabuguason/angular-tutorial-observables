import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { LanguageModule } from 'msc-dms-commons-angular/shared/language';
import { HelpMenuComponent } from './help-menu.component';

@NgModule({
  declarations: [HelpMenuComponent],
  imports: [CommonModule, TooltipModule, ButtonModule, OverlayPanelModule, LanguageModule],
  exports: [HelpMenuComponent],
})
export class HelpMenuModule {}
