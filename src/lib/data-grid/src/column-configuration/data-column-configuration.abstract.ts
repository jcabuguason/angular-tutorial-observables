import { GridStationInfoComponent } from '../grid-station-info/grid-station-info.component';

export abstract class DataColumnConfiguration {

    getIdentityHeaders() {
        let identityHeader;

        identityHeader = {
          'headerName': 'Identity',
          'children': []
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

}
