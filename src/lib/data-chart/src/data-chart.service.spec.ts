import { TestBed, getTestBed } from '@angular/core/testing';

import { Chart } from 'angular-highcharts';
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
    return 'mock ' + elementID;
  }
  getElementOfficialIndexTitle = (elementID: string) => 'Official';
  getDefaultTag = () => 'Layer';
  getFormattedNodeName = elementID => 'mock ' + elementID;
  buildFullNodeName = elementID => 'mock ' + elementID;
}

class MockUnitService {
  setPreferredUnits(element: DataElements, usePreferredUnits: boolean) {}

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
    const chart = service.chart(chartObj, hits, {});
    expect(chart.options.title.text).toBe('COMOX, 1021831, CYQQ');
    expect(chart.options.xAxis['type']).toBe('datetime');
    expect(chart.options.series[0].data.length).toBe(7);
  });

  it('should accept optional settings', () => {
    const chart = service.chart(chartObj, hits, { chart: { type: 'area' } });
    expect(chart.options.chart.type).toBe('area');
  });

  it('should make element the title with multiple stations', () => {
    const elems = [new Element('1.12.206.0.0.0.0')];
    const stations = [new Station('TEST, 1, A', 'TEST', '1'), new Station('OTHER, 2, B', 'OTHER', '2')];
    const multiStations = new ChartObject(elems, stations);
    const chart = service.chart(multiStations, hits, {});
    expect(chart.options.title.text).toBe('mock 1.12.206.0.0.0.0');
  });

  it('should make station the title with single station', () => {
    const elems = [new Element('1.12.206.0.0.0.0'), new Element('1.19.265.8.67.14.0')];
    const chartObj2 = new ChartObject(elems, station);
    const chart1 = service.chart(chartObj, hits, {});
    const chart2 = service.chart(chartObj2, hits, {});
    expect(chart1.options.title.text).toBe('COMOX, 1021831, CYQQ');
    expect(chart2.options.title.text).toBe('COMOX, 1021831, CYQQ');
  });

  it('should create a yAxis with the element as the title', () => {
    const chart = service.chart(chartObj, hits, {});
    expect(chart.options.yAxis[0].title['text']).toBe('mock 1.12.206.0.0.0.0 (Pa)');
  });

  it('should create two yAxis with two different elements of different values', () => {
    const elems = [new Element('1.12.206.0.0.0.0'), new Element('1.19.265.8.67.14.0')];
    const chartObj2 = new ChartObject(elems, station);
    const chart = service.chart(chartObj2, hits, {});
    const yAxesArray: any = chart.options.yAxis;
    expect(yAxesArray.length).toBe(2);
  });

  it('should create one yAxis with two different elements of the same value', () => {
    const elems = [new Element('1.12.206.0.0.0.0'), new Element('1.12.208.3.62.9.0')];
    const chartObj2 = new ChartObject(elems, station);
    const chart = service.chart(chartObj2, hits, {});
    const yAxesArray: any = chart.options.yAxis;
    expect(yAxesArray.length).toBe(1);
  });

  it('should display no data message for elements with no data', () => {
    const elems = [new Element('dummy-elem')];
    const chartObj2 = new ChartObject(elems, station);
    const chart = service.chart(chartObj2, hits, {});
    expect(chart.options.lang.noData).toBe('CHART.NO_DATA: <li>mock dummy-elem</li>');
  });
});
