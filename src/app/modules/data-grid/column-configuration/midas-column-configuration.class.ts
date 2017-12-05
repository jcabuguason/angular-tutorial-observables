import { Component } from '@angular/core';
import { ICellRendererAngularComp} from 'ag-grid-angular';
import { QaRendererComponent } from './renderers/qa-renderer.component';
import { DataFlagRendererComponent } from './renderers/dataflag-renderer.component';
import { QofRendererComponent } from './renderers/qof-renderer.component';
import { VofRendererComponent } from './renderers/vof-renderer.component';
import { ElementColumnConfiguration } from './element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration-container.model';
import { MidasEditorComponent } from './editors/midas-editor.component';

@Component({
  selector: 'app-midas-cell',
  template: `{{cellData?.value}} {{cellData?.unit}}
  <span style="float: right">
  <app-qa-renderer *ngIf='cellData?.overallQASummary' [qa]='cellData.overallQASummary'></app-qa-renderer>
  <app-df-renderer *ngFor="let current of cellData?.supplementaryInfo" [dataFlag]='current?.dataFlag'></app-df-renderer>
  <app-qof-renderer *ngIf='cellData?.qaFlagOverride' [qof]='cellData.qaFlagOverride'></app-qof-renderer>
  <app-vof-renderer *ngIf='cellData?.valueOverride' [vof]='cellData.valueOverride'></app-vof-renderer>
  </span>
  `,
})
export class MidasColumnConfiguration implements ElementColumnConfiguration {
  public cellData;
  type = 'midas';

  createElementHeader(workingNode: any, columnID: string) {
    const params = {
      'taxonomy': columnID
    };
    workingNode.cellRendererFramework = MidasColumnConfiguration;
    workingNode.cellRendererParams = params;
    workingNode.editable = true;
    workingNode.cellEditorFramework = MidasEditorComponent;
    workingNode.cellEditorParams = params;
    workingNode.field = columnID;
    workingNode.valueGetter = function(getterParams) {
      return ColumnConfigurationContainer.valueOrDash(getterParams.data[columnID], 'value');
    };
    workingNode.children = undefined;
  }

  createElementData(element, columnID: string) {
    return '"' + columnID + '" : ' + JSON.stringify(element);
  }

  agInit(params: any): void {
    const taxonomy = params.taxonomy;
    this.cellData = params.data[taxonomy];
  }

  refresh(): boolean {
    return false;
  }

  getMenuItems = (params) => {
    let menuItems = params.defaultItems.slice(0);
    menuItems.push('separator');
    menuItems.push({
      name: 'Column Stats',
      action: function() {
        let sum = 0;
        let total = 0;
        let min: number;
        let max: number;
        params.api.forEachNode(node => {
          const cell = node.data[params.column.getId()];
          if (cell) {
            // Move to valueNum when available
            const value = Number(cell.value);
            total++;
            sum += value;
            min = (min < value) ? min : value;
            max = (max > value) ? max : value;
          }
        });
        // TODO: Make nicer UI (Material-Angular Snackbar?)
        alert('Avg: ' + sum / total + '\nMin: ' + min + '\nMax: ' + max);
      }
    });
    return menuItems;
  };

}
