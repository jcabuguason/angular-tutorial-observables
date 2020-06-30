import { Component, Input } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'commons-qof-renderer',
  template: ` <span title="Qa Override Flag" [ngClass]="{ 'faded qof badge': qof !== 'N/A' }">{{ qof }}</span> `,
  styleUrls: ['../general-renderer.component.css'],
})
export class QofRendererComponent implements ICellRendererAngularComp {
  @Input() qof: string;

  agInit(params: any): void {
    if (params.data[params.taxonomy]) {
      this.qof = params.data[params.taxonomy]['statusIndicatorQaFlagOverride'];
    }
  }

  refresh(): boolean {
    return false;
  }
}
