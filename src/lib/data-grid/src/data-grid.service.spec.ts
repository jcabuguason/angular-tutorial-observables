import { Injectable } from '@angular/core';
import { TestBed, getTestBed } from '@angular/core/testing';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import { DataGridService } from './data-grid.service';
import { VUColumnConfiguration } from './column-configuration/vu-column-configuration.class';
import { UserConfigService, ElementVisibility, MR_MAPPING_CONFIG } from 'msc-dms-commons-angular/core/user-config';
import { MatDialog } from '@angular/material/dialog';
import { StationInfoComponent } from './station-info/station-info.component';
import { UnitCodeConversionService, ObsElement, ValueFormatterService } from 'msc-dms-commons-angular/core/obs-util';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CombinedHttpLoader } from 'msc-dms-commons-angular/shared/language';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const noLoadElement = '1.19.265.7.1.1.0';
const hiddenElement = '1.24.314.7.10.4.6';
const blankElement = '1.x.0.0.0.0.0';

class MockUnitService {
  setPreferredUnits(element: ObsElement, usePreferredUnits: boolean) {}

  usePreferredUnits = (): boolean => false;
}

class MockValueFormatterService {
  setFormattedValue(element: ObsElement) {}
}

// Needs to be Injectable because it's extending the actual service. Can the needed functions be mocked instead?
@Injectable()
class MockConfigService extends UserConfigService {
  getElementOrder = () => [blankElement]; // forces a blank column
  getNestingDepth = () => 3;
  getFormattedNodeName = (elementID, index) => `node ${elementID}`;
  getFormattedSubHeader = (elementID) => '';
  getByElementName = (element) => '';
  getElementVisibility(elementID) {
    switch (elementID) {
      case noLoadElement:
        return ElementVisibility.NoLoad;
      case hiddenElement:
        return ElementVisibility.Hidden;
      default:
        return ElementVisibility.Default;
    }
  }
  getMetaElementVisibility(elementID) {}
  getDescription = (elementID: string, nodeIndex: number): string => '';
  getElementOfficialIndexTitle = (elementID: string) => 'Official';
  getDefaultTag = () => 'Layer';
}

describe('DataGridService', () => {
  let service: DataGridService;
  const hits = require('../../../assets/sample-data/502s001.json').hits.hits.map((row) => row._source);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (httpClient) =>
              new CombinedHttpLoader(httpClient, '0', [{ prefix: '../../../assets/i18n/', suffix: '.json' }]),
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        DataGridService,
        TranslateService,
        { provide: UserConfigService, useClass: MockConfigService },
        { provide: MR_MAPPING_CONFIG, useValue: {} },
        { provide: MatDialog, useValue: { open: () => {} } },
        { provide: UnitCodeConversionService, useClass: MockUnitService },
        { provide: ValueFormatterService, useClass: MockValueFormatterService },
      ],
    });

    service = getTestBed().inject(DataGridService);
  });

  it('should set column configurations', () => {
    const getName = () => service.getColumnConfiguration().constructor.name;
    expect(getName()).toBe('DefaultColumnConfiguration');

    service.setColumnConfiguration(new VUColumnConfiguration());
    expect(getName()).toBe('VUColumnConfiguration');
  });

  it('should add a single obs', () => {
    expect(service.rowData.length).toBe(0);
    expect(service.columnDefs.length).toBe(1);
    expect(service.columnDefs[0].groupId).toBe('identity');
    expect(service.columnDefs[0].children.length).toBe(
      service.getColumnConfiguration().getIdentityHeaders().children.length,
    );

    service.addRowData(hits[0]);
    expect(service.rowData.length).toBe(1);
    expect(service.columnDefs.length).toBe(12);
    expect(service.columnDefs[service.columnDefs.length - 1].groupId).toBe('raw');

    const row = service.rowData[0];
    expect(row['e_1_7_85_0_0_0_0'].value).toBe('502S001'); // Climate ID
    expect(row['e_1_7_83_0_0_0_0'].value).toBe('WINNIPEG'); // Station Name
    expect(row['e_1_24_320_12_1_1_6']).toBe('5.72993');
    expect(row['e_7_7_7_7_7_7_7']).toBeUndefined();

    expect(
      service.columnDefs
        .filter((col) => !(col.groupId === 'identity' || col.groupId === 'raw' || col.headerClass === 'meta'))
        .map((col) => Number(col.nodeNumber)),
    ).toEqual([5, 2, 19, 11, 24, 12, 14, 4]);
  });

  it('should add a list of obs', () => {
    expect(service.rowData.length).toBe(0);

    service.addAllData(hits);

    expect(service.rowData.length).toBe(hits.length);

    const rows = service.rowData;
    expect(rows[0]['obsDateTime']).toBe('2019-12-01T06:48:00.000Z');
    expect(rows[1]['obsDateTime']).toBe('2019-12-01T07:01:00.000Z');
  });

  it('should clear the data', () => {
    service.addAllData(hits);
    service.removeAllData();

    expect(service.rowData).toEqual([]);
    expect(service.columnDefs.length).toBe(1);
  });

  it('should add value-unit rows when configured', () => {
    service.setColumnConfiguration(new VUColumnConfiguration());
    service.addRowData(hits[0]);

    const row = service.rowData[0];
    expect(row['e_1_24_320_12_1_1_6_v']).toBe('5.72993');
    expect(row['e_1_24_320_12_1_1_6_u']).toBe('°');
  });

  it('should avoid generating specific rows if configured', () => {
    service.addRowData(hits[0]);

    const row = service.rowData[0];
    const getKey = (eti: string) => row[`e_${eti.replace(/\./g, '_')}`];
    expect(getKey(noLoadElement)).toBeUndefined(); // Avoided
    expect(service.columnDefs.length).toBe(12);
  });

  it('should hide non-displayed rows if configured', () => {
    service.addRowData(hits[0]);

    // only for one-layer of children headers
    const isHidden = (eti) =>
      service.columnDefs
        .find((col) => col.nodeNumber === eti.split('.')[1])
        .children.find((col) => col.headerName === `node ${eti}`).hide;

    expect(isHidden(hiddenElement)).toBeTruthy();
    expect(service.columnDefs.length).toBe(12);
  });

  it('allow blank columns', () => {
    service.getColumnConfiguration().allowBlankDataColumns = true;
    service.addRowData(hits[0]);

    const row = service.rowData[0];
    const getKey = (eti: string) => row[`e_${eti.replace(/\./g, '_')}`];
    expect(getKey(blankElement)).toBeUndefined();
    expect(service.columnDefs.length).toBe(13);
  });

  it('should open filtered station info', () => {
    service.columnDefs = [
      {
        groupId: 'identity',
        children: [{ field: 'station', type: 'identity' }],
      },
      {
        headerClass: 'meta',
        children: [
          { field: 'stn_nam', type: 'identity' },
          { field: 'msc_id', type: 'identity' },
        ],
      },
      {
        headerName: 'Rain',
        children: [{ field: 'e_1_2_3_4_5_6_7' }],
      },
      {
        groupId: 'raw',
        children: [{ field: 'raw_header' }],
      },
    ];
    const data = {
      e_1_7_83_0_0_0_0: 'Test!',
      station: 'StationA',
      msc_id: '1234567',
      e_1_2_3_4_5_6_7: 'element',
      raw_header: 'raw header',
    };

    const calledWithData = {
      data: {
        name: 'Test!',
        allData: [
          { key: 'station', value: 'StationA' },
          { key: 'msc_id', value: '1234567' },
        ],
      },
    };
    spyOn(service.dialog, 'open');

    service.displayMetadataTable(data);
    expect(service.dialog.open).toHaveBeenCalledWith(StationInfoComponent, calledWithData);
  });
});
