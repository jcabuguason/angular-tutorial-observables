import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { instrumentTranslationKey } from 'msc-dms-commons-angular/core/obs-util';

@Component({
  selector: 'commons-instrument-renderer',
  templateUrl: './instrument-renderer.component.html',
  styleUrls: ['../general-renderer.component.css', './instrument-renderer.component.css'],
})
export class InstrumentRendererComponent implements ICellRendererAngularComp {
  constructor(public translate: TranslateService) {}
  // Used if the component is called in another template
  @Input() summary: string;

  // Used if the component is set up as the column's renderer framework
  agInit(params: any): void {
    if (params.data[params.taxonomy] !== undefined) {
      this.summary = params.data[params.taxonomy]['overallInstrumentSummary'];
    }
  }

  refresh(): boolean {
    return false;
  }

  className(summary): string {
    switch (Number(summary)) {
      case 195:
        return 'unexpected';
      case 199:
        return 'missing';
      case 200:
        return 'alarm';
      case 210:
        return 'warning';
      case 300:
        return 'normal';
      default:
        return '';
    }
  }

  label = (summary): string => this.translate.instant(instrumentTranslationKey(summary, 'description'));
}
