import { Component} from '@angular/core';
import { ICellRendererAngularComp} from 'ag-grid-angular';
import { QaRendererComponent } from './renderers/qa-renderer.component';
// import { FlagRendererComponent } from './renderers/flag-renderer.component';
import { ElementColumnConfiguration } from './element-column-configuration.interface';
import { ColumnConfigurationContainer } from './column-configuration-container.model';
import { MidasEditorComponent } from './editors/midas-editor.component';

@Component({
  selector: 'app-midas-accordian-cell',
  template: `{{cellData?.value}} {{cellData?.unit}}`,
})
export class MidasAccordianColumnConfiguration implements ElementColumnConfiguration {
  public cellData;
  type = 'midas';

  createElementHeader(workingNode: any, columnID: string) {
    workingNode.children.push({
      'headerName': 'Value',
      'cellRendererFramework': MidasAccordianColumnConfiguration,
      'cellRendererParams': {
          'taxonomy': columnID
      },
      'editable': true,
      'cellEditorFramework': MidasEditorComponent,
      'cellEditorParams': {
        'taxonomy': columnID
      },
      'suppressToolPanel': true,
      'field': columnID,
      'valueGetter': function(params) {
        return ColumnConfigurationContainer.valueOrDash(params.data[columnID], 'value');
      },
    });

    // TODO: Make 3 configs
    //        One has all data in one column (double click to edit all)
    //        Other has indiv columns (wider, but lets you sort on the flags)
    //        Last has the Value+Unit in one cell, then a badges column?

    workingNode.children.push({
      'headerName': 'Overall Qa',
      'cellRendererFramework': QaRendererComponent,
      'cellRendererParams': {
        'taxonomy': columnID
      },
      'columnGroupShow': 'open',
      'suppressToolPanel': true,
      'field': columnID,
      'valueGetter': function(params) {
        return ColumnConfigurationContainer.valueOrDash(params.data[columnID], 'overallQASummary');
      },
    });

    // TODO: How do we want to display data-flags? Show a supp-info group w/ children? What's editable?
    workingNode.children.push({
      'headerName': 'Flags',
      // FlagRendererComponent basically did what the main MidasColumnConfig's templace does for df/qof/vof
      // 'cellRendererFramework': FlagRendererComponent,
      // 'cellRendererParams': {
      //   'taxonomy': columnID
      // },
      'columnGroupShow': 'open',
      'suppressToolPanel': true,
      'field': columnID,
      'valueGetter': function(params) {
        // TODO
        return 'temp';
      }
    });
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

}
