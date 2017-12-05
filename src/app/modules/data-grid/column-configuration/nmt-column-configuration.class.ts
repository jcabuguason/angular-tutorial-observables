import { Component} from '@angular/core';
import { ICellRendererAngularComp} from 'ag-grid-angular';
import { QaRendererComponent } from './renderers/qa-renderer.component';
import { ElementColumnConfiguration } from './element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration-container.model';

@Component({
  selector: 'app-nmt-cell',
  template: `
            {{cellData?.value}}
            <span *ngIf="hideUnit" class="unit">{{cellData?.unit}}</span>
            <app-qa-renderer [qa]="cellData?.overallQASummary"></app-qa-renderer>
            `,
  styles: [
    '.unit { font-size: 75%; }',
  ]
})
export class NMTColumnConfiguration implements ElementColumnConfiguration, ICellRendererAngularComp {
  public cellData;
  public hideUnit = false;
  type = 'nmt';

  createElementHeader(workingNode: any, columnID: string) {
    workingNode.cellRendererFramework = NMTColumnConfiguration;
    workingNode.cellRendererParams = {
      taxonomy: columnID
    };
    workingNode.field = columnID;
    workingNode.valueGetter = function(params) {
      return ColumnConfigurationContainer.valueOrDash(params.data[columnID], 'value');
    };
    workingNode.children = undefined;
  }

  createElementData(element, columnID: string) {
    return '"' + columnID + '" : ' + JSON.stringify(element);
  }

  agInit(params: any): void {
    const taxonomy = params.taxonomy;
    this.cellData = params.data[taxonomy];
    if (this.cellData !== undefined) {
      this.hideUnit = (this.cellData.unit !== 'code' && this.cellData.unit !== 'unitless');
    }
  }

  refresh(): boolean {
      return false;
  }

}
