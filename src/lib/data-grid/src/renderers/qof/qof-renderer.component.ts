import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { qofTranslationKey } from 'msc-dms-commons-angular/core/obs-util';

@Component({
  selector: 'commons-qof-renderer',
  template: ` <span title="{{ label(qof) }}" [ngClass]="{ 'faded qof badge': qof !== 'N/A' }">{{ qof }}</span> `,
  styleUrls: ['../general-renderer.component.css'],
})
export class QofRendererComponent implements ICellRendererAngularComp {
  constructor(public translate: TranslateService) {}
  @Input() qof: string;

  agInit(params: any): void {
    if (params.data[params.taxonomy]) {
      this.qof = params.data[params.taxonomy]['statusIndicatorQaFlagOverride'];
    }
  }

  refresh(): boolean {
    return false;
  }

  label = (qof: string) => this.translate.instant(qofTranslationKey(qof, 'label'));
}
