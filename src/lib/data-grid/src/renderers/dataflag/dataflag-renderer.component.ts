import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { dataFlagTranslationKey } from 'msc-dms-commons-angular/core/obs-util';

@Component({
  selector: 'commons-df-renderer',
  template: `
    <span title="{{ label(dataFlag) }}" [ngClass]="{ 'faded df badge': dataFlag !== 'N/A' }">{{ dataFlag }}</span>
  `,
  styleUrls: ['../general-renderer.component.css'],
})
export class DataFlagRendererComponent implements ICellRendererAngularComp {
  constructor(public translate: TranslateService) {}
  @Input() dataFlag: string;

  agInit(params: any): void {
    if (params.data[params.taxonomy] && params.data[params.taxonomy]['supplementaryInfo']) {
      console.log('agInit used for DataFlagRenderer, only the first DataFlag will populate!');

      const flags = params.data[params.taxonomy]['suppInfoDataFlags'];
      if (flags != null && flags.length > 0) {
        this.dataFlag = flags[0];
      }
    }
  }

  refresh(): boolean {
    return false;
  }

  label = (dataFlag: string) => this.translate.instant(dataFlagTranslationKey(dataFlag, 'label'));
}
