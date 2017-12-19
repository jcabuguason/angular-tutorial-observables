import {Component, Input} from '@angular/core';

import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'commons-qof-renderer',
    template: `<span title="Qa Override Flag" class="wip qof badge">{{ qof }}</span>`,
    styleUrls: ['./general-renderer.component.css'],
})
export class QofRendererComponent implements ICellRendererAngularComp {
    @Input() qof: string;

    agInit(params: any): void {
      if (params.data[params.taxonomy] !== undefined) {
        this.qof = params.data[params.taxonomy]['qaFlagOverride'];
      }
    }

    refresh(): boolean {
        return false;
    }
}
