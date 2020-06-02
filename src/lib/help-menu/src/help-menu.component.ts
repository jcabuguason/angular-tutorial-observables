import { Component, Input } from '@angular/core';

import { LanguageService } from 'msc-dms-commons-angular/shared/language';

import { HelpMenuInfo } from './help-menu.model';

@Component({
  selector: 'commons-help-menu',
  templateUrl: './help-menu.component.html',
  styleUrls: ['./help-menu.component.css'],
})
export class HelpMenuComponent {
  @Input() helpMenuInfo: HelpMenuInfo;

  constructor(private i18n: LanguageService) {}
}
