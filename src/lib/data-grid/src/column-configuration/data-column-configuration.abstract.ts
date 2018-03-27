import { GridStationInfoComponent } from '../grid-station-info/grid-station-info.component';
import { getTime } from 'date-fns';
import { DataGridService } from '../data-grid.service';

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
        },
        {
          'headerName': 'Instance Date',
          'field': 'obsDateTime',
          'width': 220,
          'pinned': true,
          'sort': 'asc',
          'comparator': this.compareObsTime,
          'cellRenderer': this.renderObsTime,
        },
        // What about dailies that send back a completed revision?
        {
          'headerName': 'Rev',
          'field': 'revision',
          'pinned': true,
          'width': 75,
          'sort': 'asc',
          'comparator': this.compareRevision,
        },
      ],
    };
  }

  getContextMenuItems() {
    return (params) => [
      'copy',
      'copyWithHeaders',
      'separator',
      'toolPanel',
      {
        name: 'Export',
        subMenu: [
          {
            name: 'CSV Export',
            action: () => params.api.exportDataAsCsv({columnGroups: true})
          },
          {
            name: 'Excel Export',
            action: () => params.api.exportDataAsExcel({columnGroups: true})
          }
        ]
      }
    ];
  }

  // TODO: Get rid of gridService here once the chart select UI changes
  getMainMenuItems(gridService: DataGridService) {
    return function(params) {
      const menuItems = params.defaultItems.slice(0);
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
      });
      menuItems.push({
        name: 'Chart Element',
        action: function() {
          gridService.chartColumn(params.column.colDef.elementID);
        }
      });
      return menuItems;
    };
  }

  renderObsTime(params) {
    return `<a href="/core${params.data.uri}" target="_blank">${params.value}</a>`;
  }

  // TODO: Add standard revision comparison
  compareObsTime(date1, date2): number {
    const date1Time = getTime(date1);
    const date2Time = getTime(date2);
    if (isNaN(date1Time) && isNaN(date2Time)) { return 0; }
    if (isNaN(date1Time)) { return -1; }
    if (isNaN(date2Time)) { return 1; }
    return date1Time - date2Time;
  }

  compareRevision(cor1, cor2): number {
    const rev1 = cor1.split('_v');
    const rev2 = cor2.split('_v');
    rev1[1] = (rev1.length === 1) ? 0 : Number(rev1[1]);
    rev2[1] = (rev2.length === 1) ? 0 : Number(rev2[1]);

    if (rev1[0] === rev2[0] && rev1[1] === rev2[1]) { return 0; }
    if (rev1[0] === rev2[0]) { return rev1[1] - rev2[1]; }

    rev1[0] = (rev1[0] === 'orig') ? '' : rev1[0];
    rev2[0] = (rev2[0] === 'orig') ? '' : rev2[0];
    return (rev1[0] <= rev2[0]) ? -1 : 1;
  }
}
