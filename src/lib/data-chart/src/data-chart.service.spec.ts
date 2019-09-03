import { TestBed, getTestBed, async } from '@angular/core/testing';

import { Element, Station, ChartObject } from './model/chart.model';
import { DataChartService } from './data-chart.service';
import { UserConfigService } from 'msc-dms-commons-angular/core/metadata';
import { UnitCodeConversionService, DataElements } from 'msc-dms-commons-angular/core/obs-util';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { CombinedHttpLoader } from 'msc-dms-commons-angular/shared/language';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

class MockConfigService {
  getFullFormattedHeader(elementID: string) {
    return `mock ${elementID}`;
  }
  getElementOfficialIndexTitle = (elementID: string) => 'Official';
  getDefaultTag = () => 'Layer';
  getFormattedNodeName = elementID => `mock ${elementID}`;
  buildFullNodeName = elementID => `mock ${elementID}`;
}

class MockUnitService {
  setPreferredUnits(element: DataElements, usePreferredUnits: boolean) { }

  usePreferredUnits(): boolean {
    return false;
  }
}

describe('DataChartService', () => {
  let service: DataChartService;
  const hits = [
    ...require('./sample-data-1037090.json').hits.hits.map(json => json._source),
    ...require('./sample-data-1032731.json').hits.hits.map(json => json._source),
    ...require('./sample-data-1021831.json').hits.hits.map(json => json._source),
  ];
  const station = [new Station('COMOX, 1021831, CYQQ', 'COMOX', '1021831')];
  const chartObj = new ChartObject(
    [new Element('1.12.206.0.0.0.0')],
    [new Station('COMOX, 1021831, CYQQ', 'COMOX', '1021831')]
  );

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
        DataChartService,
        TranslateService,
        { provide: UserConfigService, useClass: MockConfigService },
        { provide: UnitCodeConversionService, useClass: MockUnitService },
      ],
    });

    service = getTestBed().get(DataChartService);
  });

  it('should create chart object', () => {
    const options = service.buildOptions(chartObj, hits, {});
    expect(options.title.text).toBe('COMOX, 1021831, CYQQ');
    expect(options.xAxis['type']).toBe('datetime');
    expect(options.series[0].data.length).toBe(7);
  });

  it('should build charts with a given element type', () => {
    const options = service.buildOptions(
      new ChartObject(
        [new Element('1.12.206.0.0.0.0', 'area')],
        [new Station('COMOX, 1021831, CYQQ', 'COMOX', '1021831')]
      ),
      hits
    );
    expect(options.series.length).toBe(1);
    expect(options.series[0].type).toBe('area');
  });

  it('should accept optional settings', () => {
    const options = service.buildOptions(chartObj, hits, {
      highchartsOptions: { chart: { type: 'area' }, credits: { enabled: true }, tooltip: { enabled: false } },
    });
    expect(options.chart.type).toBe('area');
    expect(options.credits.enabled).toBe(true);
    expect(options.tooltip.enabled).toBe(false);
  });

  it('should make element the title with multiple stations', () => {
    const elems = [new Element('1.12.206.0.0.0.0')];
    const stations = [new Station('TEST, 1, A', 'TEST', '1'), new Station('OTHER, 2, B', 'OTHER', '2')];
    const multiStations = new ChartObject(elems, stations);
    const options = service.buildOptions(multiStations, hits, {});
    expect(options.title.text).toBe('mock 1.12.206.0.0.0.0');
  });

  it('should make station the title with single station', () => {
    const elems = [new Element('1.12.206.0.0.0.0'), new Element('1.19.265.8.67.14.0')];
    const chartObj2 = new ChartObject(elems, station);
    const options1 = service.buildOptions(chartObj, hits, {});
    const options2 = service.buildOptions(chartObj2, hits, {});
    expect(options1.title.text).toBe('COMOX, 1021831, CYQQ');
    expect(options2.title.text).toBe('COMOX, 1021831, CYQQ');
  });

  it('should create a yAxis with the element as the title', () => {
    const options = service.buildOptions(chartObj, hits, {});
    expect(options.yAxis[0].title['text']).toBe('mock 1.12.206.0.0.0.0 (Pa)');
  });

  it('should create two yAxis with two different elements of different values', () => {
    const elems = [new Element('1.12.206.0.0.0.0'), new Element('1.19.265.8.67.14.0')];
    const chartObj2 = new ChartObject(elems, station);
    const options = service.buildOptions(chartObj2, hits, {});
    const yAxesArray: any = options.yAxis;
    expect(yAxesArray.length).toBe(2);
  });

  it('should create one yAxis with two different elements of the same value', () => {
    const elems = [new Element('1.12.206.0.0.0.0'), new Element('1.12.208.3.62.9.0')];
    const chartObj2 = new ChartObject(elems, station);
    const options = service.buildOptions(chartObj2, hits, {});
    const yAxesArray: any = options.yAxis;
    expect(yAxesArray.length).toBe(1);
  });

  it('should display no data message for elements with no data', () => {
    const elems = [new Element('dummy-elem')];
    const chartObj2 = new ChartObject(elems, station);
    const options = service.buildOptions(chartObj2, hits, {});
    expect(options.lang.noData).toBe('CHART.NO_DATA: <li>mock dummy-elem</li>');
  });
});
