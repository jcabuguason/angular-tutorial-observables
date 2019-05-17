import { DataGridService } from '../data-grid.service';
import { StationInfoComponent } from '../station-info/station-info.component';
import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';

export abstract class DataColumnConfiguration {
  public allowBlankDataColumns = false;
  public expandNestedDataColumns = false;

  getIdentityHeaders(): any {
    return {
      headerValueGetter: params => this.instantWrapper('IDENTITY'),
      groupId: 'identity',
      suppressPaste: true,
      children: this.buildIdentityChildren(),
    };
  }

  buildIdentityChildren(): any[] {
    return [this.buildStationHeader(), this.buildDatetimeHeader(), this.buildRevisionHeader()];
  }

  buildStationHeader(): any {
    return {
      headerValueGetter: params => this.instantWrapper('STATION'),
      field: 'station',
      colId: 'station',
      width: 100,
      pinned: true,
      lockVisible: true,
      type: 'identity',
    };
  }

  buildDatetimeHeader(): any {
    return {
      headerValueGetter: params => this.instantWrapper('INSTANCE_DATE'),
      field: 'obsDateTime',
      colId: 'obsDateTime',
      width: 220,
      pinned: true,
      sort: 'asc',
      comparator: obsUtil.compareObsTime,
      lockVisible: true,
      type: 'identity',
    };
  }

  buildReceivedDatetimeHeader(): any {
    return {
      headerValueGetter: params => this.instantWrapper('RECEIVED_DATE'),
      field: 'receivedDateTime',
      colId: 'receivedDateTime',
      width: 220,
      pinned: true,
      comparator: obsUtil.compareObsTime,
      type: 'identity',
    };
  }

  buildRevisionHeader(): any {
    return {
      headerValueGetter: params => this.instantWrapper('REV'),
      field: 'revision',
      colId: 'revision',
      pinned: true,
      width: 75,
      sort: 'asc',
      comparator: obsUtil.compareRevision,
      lockVisible: true,
      type: 'identity',
    };
  }

  buildNetworkHeader() {
    return {
      headerValueGetter: () => this.instantWrapper('NETWORK'),
      headerTooltip: this.instantWrapper('NETWORK_TOOLTIP'),
      field: 'taxonomy',
      colId: 'network',
      width: 100,
      pinned: true,
      suppressPaste: true,
      lockVisible: false,
      type: 'identity',
    };
  }

  csvExcelExporter(params): any {
    const settings = { columnGroups: true };
    return {
      name: this.instantWrapper('EXPORT'),
      subMenu: [
        {
          name: this.instantWrapper('CSV_EXPORT'),
          action: () => params.api.exportDataAsCsv(settings),
        },
        {
          name: this.instantWrapper('EXCEL_EXPORT'),
          action: () => params.api.exportDataAsExcel(settings),
        },
      ],
    };
  }

  getContextMenuItems(gridService: DataGridService) {
    return params => this.addContextMenuItems(params, gridService);
  }

  addContextMenuItems(params, gridService): any[] {
    if (!params.column) {
      return [this.csvExcelExporter(params)];
    }

    return [
      'copy',
      'copyWithHeaders',
      'separator',
      this.csvExcelExporter(params),
      {
        name: this.instantWrapper('STATION_INFO'),
        action: () => gridService.displayMetadataTable(params.node.data),
      },
    ];
  }

  // TODO: Get rid of gridService here once the chart select UI changes
  getMainMenuItems(gridService: DataGridService) {
    const instWrap = label => this.instantWrapper(label);
    return function(params) {
      const menuItems = params.defaultItems.slice(0).filter(item => item !== 'toolPanel');

      menuItems.push(
        'separator',
        {
          name: instWrap('EXPAND_COLUMNS'),
          action: () => gridService.expandAllColumns(params.columnApi, true),
        },
        {
          name: instWrap('COLLAPSE_COLUMNS'),
          action: () => gridService.expandAllColumns(params.columnApi, false),
        }
      );

      menuItems.push('separator', {
        name: instWrap('COLUMN_STATS'),
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
                min = min < value ? min : value;
                max = max > value ? max : value;
              }
            }
          });
          // TODO: Make nicer UI (Material-Angular Snackbar?)
          alert(`${instWrap('AVG')}: ${sum / total}\n${instWrap('MIN')}: ${min}\n${instWrap('MAX')}: ${max}`);
        },
      });
      const element = params.column.colDef;
      if (!!element && element.field.startsWith('e')) {
        menuItems.push({
          name: instWrap('CHART_ELEMENT'),
          action: function() {
            gridService.chartFormOnColumn(element.field);
          },
        });
      }
      // get the elementID and only add the submenu if it exists
      if (element.elementID) {
        menuItems.push({
          name: instWrap('ELEMENT_INFO'),
          subMenu: [
            {
              name: `${instWrap('ELEMENT_ID')}: ${element.elementID}`,
              // copy elementID to clipboard
              action: function() {
                const textarea = document.createElement('textarea');
                textarea.setAttribute('type', 'hidden');
                textarea.textContent = element.elementID;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
              },
              icon: '<span class="ag-icon ag-icon-copy"/>',
            },
          ],
        });
      }
      return menuItems;
    };
  }

  // TODO: Find nicer solution, step away from Col-Conf classes?
  // Needs to be overwritten by `instantWrapper = (key) =>  LanguageService.translator.instant(`GRID.${key}`);` in
  // app-level Col-Conf class...
  instantWrapper = key => `key`;
}
