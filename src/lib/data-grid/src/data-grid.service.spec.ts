import { TestBed, getTestBed } from '@angular/core/testing';

import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';

import { DataGridService } from './data-grid.service';
import { VUColumnConfiguration } from './column-configuration/vu-column-configuration.class';
import { UserConfigService, ElementVisibility, MR_MAPPING_CONFIG } from 'msc-dms-commons-angular/core/metadata';
import { MatDialog } from '@angular/material';
import { StationInfoComponent } from './station-info/station-info.component';
import { UnitCodeConversionService, DataElements } from 'msc-dms-commons-angular/core/obs-util';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CombinedHttpLoader } from 'msc-dms-commons-angular/shared/language';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockUnitService {
  setPreferredUnits(element: DataElements, usePreferredUnits: boolean) {}

  usePreferredUnits(): boolean {
    return false;
  }
}

describe('DataGridService', () => {
  let service: DataGridService;
  const hits = require('./sample-hits.json').map(row => row._source);
  const noLoadElement = '1.12.210.0.0.0.0';
  const hiddenElement = '1.13.215.0.0.0.0';
  const blankElement = '1.x.0.0.0.0.0';

  class MockConfigService extends UserConfigService {
    getElementOrder() {
      return [blankElement];
    } // forces a blank column
    getNestingDepth() {
      return 3;
    }
    getFormattedNodeName(elementID, index) {
      return `node ${elementID}`;
    }
    getFormattedSubHeader(elementID) {
      return `,sub header ${elementID}`;
    }
    getByElementName(element) {
      return '';
    }
    getElementVisibility(elementID) {
      switch (elementID) {
        case noLoadElement:
          return ElementVisibility.NO_LOAD;
        case hiddenElement:
          return ElementVisibility.HIDDEN;
        default:
          return ElementVisibility.DEFAULT;
      }
    }
    getMetaElementVisibility(elementID) {}
    getDescription(elementID: string, nodeIndex: number): string {
      return '';
    }
    getElementOfficialIndexTitle(elementID: string) {
      return 'Official';
    }
    getDefaultTag() {
      return 'Layer';
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: httpClient =>
              new CombinedHttpLoader(httpClient, [{ prefix: '../../../assets/i18n/', suffix: '.json' }]),
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
      ],
    });

    service = getTestBed().get(DataGridService);
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
      service.getColumnConfiguration().getIdentityHeaders().children.length
    );

    service.addRowData(hits[0]);
    expect(service.rowData.length).toBe(1);
    expect(service.columnDefs.length).toBe(16);
    expect(service.columnDefs[service.columnDefs.length - 1].groupId).toBe('raw');

    const row = service.rowData[0];
    expect(row['e_1_7_85_0_0_0_0'].value).toBe('1021270'); // Climate ID
    expect(row['e_1_7_83_0_0_0_0'].value).toBe('Campbell River'); // Station Name
    expect(row['e_1_24_340_0_10_4_6']).toBe('48');
    expect(row['e_7_7_7_7_7_7_7']).toBeUndefined();

    expect(
      service.columnDefs
        .filter(col => !(col.groupId === 'identity' || col.groupId === 'raw' || col.headerClass === 'meta'))
        .map(col => Number(col.nodeNumber))
    ).toEqual([11, 19, 12, 5, 20, 17, 23, 6, 24, 13, 2]);
  });

  it('should add a list of obs', () => {
    expect(service.rowData.length).toBe(0);

    service.addAllData(hits);

    expect(service.rowData.length).toBe(hits.length);

    const rows = service.rowData;
    expect(rows[0]['obsDateTime']).toBe('2018-03-05T01:00:00Z');
    expect(rows[1]['obsDateTime']).toBe('2018-03-05T02:00:00Z');
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
    expect(row['e_1_24_340_0_10_4_6_v']).toBe('48');
    expect(row['e_1_24_340_0_10_4_6_u']).toBe('°');
  });

  it('should avoid generating specific rows if configured', () => {
    const someDisplayCols = ['1.11.171.1.62.9.0', '1.12.212.0.0.0.0'];
    service.addRowData(hits[0]);

    const row = service.rowData[0];
    const getKey = (eti: string) => row['e_' + eti.replace(/\./g, '_')];
    expect(getKey(someDisplayCols[0])).toBe('MSNG');
    expect(getKey(someDisplayCols[1])).toBe('100900.0');
    expect(getKey(noLoadElement)).toBeUndefined();
    expect(service.columnDefs.length).toBe(16);
  });

  it('should hide non-displayed rows if configured', () => {
    service.addRowData(hits[0]);

    // only for one-layer of children headers
    const isHidden = eti =>
      service.columnDefs.find(n => n.headerName === `node ${eti}`).children.find(n => n.elementID === eti).hide;

    expect(isHidden(hiddenElement)).toBeTruthy();
    expect(service.columnDefs.length).toBe(16);
  });

  it('allow blank columns', () => {
    service.getColumnConfiguration().allowBlankDataColumns = true;
    service.addRowData(hits[0]);

    const row = service.rowData[0];
    const getKey = (eti: string) => row['e_' + eti.replace(/\./g, '_')];
    expect(getKey(blankElement)).toBeUndefined();
    expect(service.columnDefs.length).toBe(17);
  });

  it('should open filtered station info', () => {
    service.columnDefs = [
      {
        groupId: 'identity',
        children: [{ field: 'station', type: 'identity' }],
      },
      {
        headerClass: 'meta',
        children: [{ field: 'stn_nam', type: 'identity' }, { field: 'msc_id', type: 'identity' }],
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
        allData: [{ key: 'station', value: 'StationA' }, { key: 'msc_id', value: '1234567' }],
      },
    };
    spyOn(service.dialog, 'open');

    service.displayMetadataTable(data);
    expect(service.dialog.open).toHaveBeenCalledWith(StationInfoComponent, calledWithData);
  });
});
