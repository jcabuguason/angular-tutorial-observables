import {Component, Input} from '@angular/core';

import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'commons-vof-renderer',
    template: `<span title="Value Override Flag" class="wip vof badge">{{ vof }}</span>`,
    styleUrls: ['./general-renderer.component.css']
})
export class VofRendererComponent implements ICellRendererAngularComp {
    @Input() vof: string;

    agInit(params: any): void {
      if (params.data[params.taxonomy] !== undefined) {
        this.vof = params.data[params.taxonomy]['valueOverride'];
      }
    }

    refresh(): boolean {
        return false;
    }
}
