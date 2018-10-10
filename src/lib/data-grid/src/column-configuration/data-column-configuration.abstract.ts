import { DataGridService } from '../data-grid.service';
import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';

export abstract class DataColumnConfiguration {

  public allowBlankDataColumns = false;

  getIdentityHeaders(): any {
    return {
      'headerName': 'Identity',
      'suppressPaste': true,
      'children': this.buildIdentityChildren()
    };
  }

  buildIdentityChildren(): any[] {
    return [
      this.buildStationHeader(),
      this.buildDatetimeHeader(),
      this.buildRevisionHeader(),
    ];
  }

  buildStationHeader(): any {
    return {
      'headerName': 'Station',
      'field': 'station',
      'width': 100,
      'pinned': true,
      'lockVisible': true,
      'type': 'identity',
    };
  }

  buildDatetimeHeader(): any {
    return {
      'headerName': 'Instance Date',
      'field': 'obsDateTime',
      'width': 220,
      'pinned': true,
      'sort': 'asc',
      'comparator': obsUtil.compareObsTime,
      'cellRenderer': this.renderObsTime,
      'lockVisible': true,
      'type': 'identity',
    };
  }

  buildRevisionHeader(): any {
    return {
      'headerName': 'Rev',
      'field': 'revision',
      'pinned': true,
      'width': 75,
      'sort': 'asc',
      'comparator': obsUtil.compareRevision,
      'lockVisible': true,
      'type': 'identity',
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

  getContextMenuItems(gridService: DataGridService) {
    return (params) => this.addContextMenuItems(params, gridService);
  }

  addContextMenuItems(params, gridService): any[] {
    if (!params.column) {return [this.csvExcelExporter(params)]; }

    return [
      'copy',
      'copyWithHeaders',
      'separator',
      this.csvExcelExporter(params),
      {
        name: 'Station Info',
        action: () => gridService.displayMetadataTable(params.node.data)
      },
    ];
  }

  // TODO: Get rid of gridService here once the chart select UI changes
  getMainMenuItems(gridService: DataGridService) {
    return function(params) {
      const menuItems = params.defaultItems.slice(0)
        .filter(item => item !== 'toolPanel');
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
      // get the elementID and only add the submenu if it exists
      const elementID = params.column.colDef.elementID;
      if (elementID) {
        menuItems.push({
          name: 'Element Info',
          subMenu : [
            {
              name: 'Element ID: ' + elementID,
              // copy elementID to clipboard
              action: function() {
                const textarea = document.createElement('textarea');
                textarea.setAttribute('type', 'hidden');
                textarea.textContent = elementID;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
              },
              icon: '<span class="ag-icon ag-icon-copy"/>',
            },
          ]
        });
      }
      return menuItems;
    };
  }

  renderObsTime(params) {
    return `<a href="/core${params.data.uri}" target="_blank">${params.value}</a>`;
  }

}
