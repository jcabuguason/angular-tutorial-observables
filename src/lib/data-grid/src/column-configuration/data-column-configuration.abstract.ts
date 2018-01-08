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
          'pinned': true
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
