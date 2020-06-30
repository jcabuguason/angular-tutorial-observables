import { Component, Input } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'commons-vof-renderer',
  template: ` <span title="Value Override Flag" [ngClass]="{ 'faded vof badge': vof !== 'N/A' }">{{ vof }}</span> `,
  styleUrls: ['../general-renderer.component.css'],
})
export class VofRendererComponent implements ICellRendererAngularComp {
  @Input() vof: string;

  agInit(params: any): void {
    if (params.data[params.taxonomy]) {
      this.vof = params.data[params.taxonomy]['statusIndicatorValueOverride'];
    }
  }

  refresh(): boolean {
    return false;
  }
}
