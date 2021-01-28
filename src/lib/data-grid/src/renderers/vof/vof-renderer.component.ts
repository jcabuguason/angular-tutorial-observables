import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { vofTranslationKey } from 'msc-dms-commons-angular/core/obs-util';

@Component({
  selector: 'commons-vof-renderer',
  template: ` <span title="{{ label(vof) }}" [ngClass]="{ 'faded vof badge': vof !== 'N/A' }">{{ vof }}</span> `,
  styleUrls: ['../general-renderer.component.css'],
})
export class VofRendererComponent implements ICellRendererAngularComp {
  constructor(public translate: TranslateService) {}
  @Input() vof: string;

  agInit(params: any): void {
    if (params.data[params.taxonomy]) {
      this.vof = params.data[params.taxonomy]['statusIndicatorValueOverride'];
    }
  }

  refresh(): boolean {
    return false;
  }

  label = (flag: string) => this.translate.instant(vofTranslationKey(flag, 'label'));
}
