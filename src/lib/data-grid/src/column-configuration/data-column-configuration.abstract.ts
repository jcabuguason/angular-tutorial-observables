import { GridStationInfoComponent } from '../grid-station-info/grid-station-info.component';

export abstract class DataColumnConfiguration {

    getIdentityHeaders() {
        let identityHeader;

        identityHeader = {
          'headerName': 'Identity',
          'children': [],
          'suppressToolPanel': true
        };

        const stationHeader = {
          'headerName': 'Station',
          'field': 'station',
          'width': 100,
          'pinned': true,
          // Not actually editable, just the name of the Framework for double-clicking a cell for info
          'editable': true,
          'cellEditorFramework': GridStationInfoComponent,
        };
        identityHeader.children.push(stationHeader);

        const dateTimeHeader = {
          'headerName': 'Instance Date',
          'field': 'obsDateTime',
          'width': 220,
          'pinned': true
        };
        identityHeader.children.push(dateTimeHeader);

        return identityHeader;

    }

    getContextMenuItems() {
      return function(params) {
        const result = [
          'copy',
          'copyWithHeaders',
          'separator',
          'toolPanel',
          {
            name: 'Export',
            subMenu: [
              {
                name: 'CSV Export',
                action: function() {
                  params.api.exportDataAsCSV({columnGroups: true});
                }
              },
              {
                name: 'Excel Export',
                action: function() {
                  params.api.exportDataAsExcel({columnGroups: true});
                }

              }
            ]
          }
        ];
        return result;
      };
    }

    getMainMenuItems() {
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
        return menuItems;
      };
    }
}