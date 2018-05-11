import { GridStationInfoComponent } from '../grid-station-info/grid-station-info.component';
import { getTime } from 'date-fns';
import { DataGridService } from '../data-grid.service';
import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';

export abstract class DataColumnConfiguration {

  public ignoreHideableColumns = false;

  getIdentityHeaders() {
    return {
      'headerName': 'Identity',
      'suppressToolPanel': true,
      'children': [
        {
          'headerName': 'Station',
          'field': 'station',
          'width': 100,
          'pinned': true,
          // Not actually editable, just the name of the Framework for double-clicking a cell for info
          'editable': true,
          'cellEditorFramework': GridStationInfoComponent,
          'type': 'identity'
        },
        {
          'headerName': 'Instance Date',
          'field': 'obsDateTime',
          'width': 220,
          'pinned': true,
          'sort': 'asc',
          'comparator': obsUtil.compareObsTime,
          'cellRenderer': this.renderObsTime,
          'type': 'identity'
        },
        // What about dailies that send back a completed revision?
        {
          'headerName': 'Rev',
          'field': 'revision',
          'pinned': true,
          'width': 75,
          'sort': 'asc',
          'comparator': obsUtil.compareRevision,
          'type': 'identity',
        },
      ],
    };
  }

  csvExcelExporter(params) {
    const settings = { columnGroups: true };
    return {
      name: 'Export',
      subMenu: [
        {
          name: 'CSV Export',
          action: () => params.api.exportDataAsCsv(settings)
        },
        {
          name: 'Excel Export',
          action: () => params.api.exportDataAsExcel(settings)
        }
      ]
    };
  }

  getContextMenuItems() {
    return (params) => this.addContextMenuItems(params);
  }

  addContextMenuItems(params): any {
    return [
      'copy',
      'copyWithHeaders',
      'separator',
      'toolPanel',
      this.csvExcelExporter(params),
    ];
  }

  // TODO: Get rid of gridService here once the chart select UI changes
  getMainMenuItems(gridService: DataGridService) {
    return function(params) {
      const menuItems = params.defaultItems.slice(0);
      menuItems.push(
        'separator',
        {
          name: 'Column Stats',
          action: function() {
            let sum = 0;
            let total = 0;
            let min: number;
            let max: number;
            params.api.forEachNode(node => {
              const cell = node.data[params.column.getId()];
              if (cell) {
                const value = Number(cell.value);
                if (!Number.isNaN(value)) {
                  total++;
                  sum += value;
                  min = (min < value) ? min : value;
                  max = (max > value) ? max : value;
                }
              }
            });
            // TODO: Make nicer UI (Material-Angular Snackbar?)
            alert('Avg: ' + sum / total + '\nMin: ' + min + '\nMax: ' + max);
          }
        },
      );
      // When dedicated chart-selection UI is added, this will be removed
      menuItems.push({
        name: 'Chart Element',
        action: function() {
          gridService.chartColumn(params.column.colDef.field);
        }
      });
      return menuItems;
    };
  }

  renderObsTime(params) {
    return `<a href="/core${params.data.uri}" target="_blank">${params.value}</a>`;
  }

  // TODO: Remove this when call is removed from MIDAS
  compareObsTime(date1, date2): number {
    return obsUtil.compareObsTime(date1, date2);
  }

  // TODO: Remove this when call is removed from MIDAS
  compareRevision(cor1, cor2): number {
    return obsUtil.compareRevision(cor1, cor2);
  }
}
