import {Component, Input} from '@angular/core';

import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'commons-df-renderer',
    template: `<span title="DataFlag" class="df wip badge">{{ dataFlag }}</span>`,
    styleUrls: ['./general-renderer.component.css']
})
export class DataFlagRendererComponent implements ICellRendererAngularComp {
    @Input() dataFlag: string;

    agInit(params: any): void {
      if (params.data[params.taxonomy] && params.data[params.taxonomy]['supplementaryInfo']) {
        console.log('agInit used for DataFlagRenderer, only the first DataFlag will populate!');
        for (const element of params.data[params.taxonomy]['supplementaryInfo']) {
          if (element.dataFlag) {
            this.dataFlag = element.dataFlag;
            break;
          }
        }
      }
    }

    refresh(): boolean {
        return false;
    }
}
