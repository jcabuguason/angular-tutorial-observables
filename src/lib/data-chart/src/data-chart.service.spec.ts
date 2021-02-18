import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserConfigService } from 'msc-dms-commons-angular/core/user-config';
import {
  ObsElement,
  UnitCodeConversionService,
  updateNodeValue,
  findFirstValue,
} from 'msc-dms-commons-angular/core/obs-util';
import { CombinedHttpLoader } from 'msc-dms-commons-angular/shared/language';
import { DataChartService } from './data-chart.service';
import { Element, Station, Chart, SeriesType, QualifierType } from './model/chart.model';

class MockConfigService {
  getFullFormattedHeader(elementID: string) {
    return `mock ${elementID}`;
  }
  getElementOfficialIndexTitle = (elementID: string) => 'Official';
  getDefaultTag = () => 'Layer';
  getFormattedNodeName = (elementID) => `mock ${elementID}`;
  buildFullNodeName = (elementID) => `mock ${elementID}`;
}

class MockUnitService {
  setPreferredUnits(element: ObsElement, usePreferredUnits: boolean) {}

  usePreferredUnits(): boolean {
    return false;
  }
}

describe('DataChartService', () => {
  let service: DataChartService;

  const hits = require('../../../assets/sample-data/502s001.json').hits.hits.map((h) => h._source);
  const defaultStation = new Station({
    label: 'WINNIPEG, 502S001',
    value: '502S001',
  });

  const defaultElement = new Element({
    id: '1.5.66.2.60.7.0',
    seriesOption: { seriesType: SeriesType.Area, useQaColor: false },
  });
  const defaultChart = new Chart({
    elements: [defaultElement],
    stations: [defaultStation],
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (httpClient) =>
              new CombinedHttpLoader(httpClient, '0', [{ prefix: '../../assets/i18n/', suffix: '.json' }]),
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

    service = getTestBed().inject(DataChartService);
  });

  it('should create chart object', () => {
    const options = service.buildOptions(defaultChart, hits, {});
    expect(options.title.text).toBe('WINNIPEG, 502S001');
    expect(options.xAxis['type']).toBe('datetime');
    expect(options.series[0].data.length).toBe(3);
  });

  it('should build charts with a given element type', () => {
    const options = service.buildOptions(
      new Chart({
        stations: [defaultStation],
        elements: [
          new Element({
            id: '1.11.174.2.20.3.0',
            seriesOption: { seriesType: SeriesType.Area, useQaColor: false },
          }),
        ],
      }),
      hits,
      {},
    );
    expect(options.series.length).toBe(1);
    expect(options.series[0].type).toBe('area');
  });

  it('should accept optional settings', () => {
    const options = service.buildOptions(defaultChart, hits, {
      highchartsOptions: { chart: { type: 'area' }, credits: { enabled: true }, tooltip: { enabled: false } },
    });
    expect(options.chart.type).toBe('area');
    expect(options.credits.enabled).toBe(true);
    expect(options.tooltip.enabled).toBe(false);
  });

  it('should make element the title with multiple stations', () => {
    const multiStations = new Chart({
      elements: [
        new Element({
          id: '1.5.66.2.60.7.0',
        }),
      ],
      stations: [
        new Station({
          label: 'TEST, 1, A',
          value: '1',
          seriesOption: { seriesType: SeriesType.Area, useQaColor: false },
        }),
        new Station({
          label: 'OTHER, 2, B',
          value: '2',
          seriesOption: { seriesType: SeriesType.Area, useQaColor: false },
        }),
      ],
    });
    const options = service.buildOptions(multiStations, hits, {});
    expect(options.title.text).toBe('mock 1.5.66.2.60.7.0');
  });

  it('should make station the title with single station', () => {
    const multiElementChart = new Chart({
      elements: [
        defaultElement,
        new Element({ id: '1.19.265.8.67.14.0', seriesOption: { seriesType: SeriesType.Area, useQaColor: false } }),
      ],
      stations: [defaultStation],
    });
    const defaultOptions = service.buildOptions(defaultChart, hits, {});
    const multiElementOptions = service.buildOptions(multiElementChart, hits, {});
    expect(defaultOptions.title.text).toBe('WINNIPEG, 502S001');
    expect(multiElementOptions.title.text).toBe('WINNIPEG, 502S001');
  });

  it('should create a yAxis with the element as the title', () => {
    const options = service.buildOptions(defaultChart, hits, {});
    expect(options.yAxis[0].title['text']).toBe('mock 1.5.66.2.60.7.0 (%)');
  });

  it('should create two yAxis with two different elements of different values', () => {
    const multiElemDiffGroup = new Chart({
      elements: [
        defaultElement,
        new Element({ id: '1.19.267.2.60.7.0', seriesOption: { seriesType: SeriesType.Area, useQaColor: false } }),
      ],
      stations: [defaultStation],
    });
    const options = service.buildOptions(multiElemDiffGroup, hits, {});
    const yAxesArray: any = options.yAxis;
    expect(yAxesArray.length).toBe(2);
  });

  it('should create one yAxis with two different elements of the same value', () => {
    const multiElemSameGroupUnit = new Chart({
      elements: [
        defaultElement,
        new Element({ id: '1.2.11.1.1.1.0', seriesOption: { seriesType: SeriesType.Area, useQaColor: false } }),
      ],
      stations: [defaultStation],
    });
    const options = service.buildOptions(multiElemSameGroupUnit, hits, {});
    const yAxesArray: any = options.yAxis;
    expect(yAxesArray.length).toBe(1);
  });

  it('should display no data message for elements with no data', () => {
    const badChart = new Chart({
      elements: [new Element({ id: 'dummy-elem', seriesOption: { seriesType: SeriesType.Area, useQaColor: false } })],
      stations: [defaultStation],
    });
    const options = service.buildOptions(badChart, hits, {});
    expect(options.lang.noData).toBe('CHART.NO_DATA: <li>mock dummy-elem</li>');
  });

  // TODO: Needs flat-json sample report
  it('should create a longitudinal chart for hourly qualifiers', () => {
    const placeholderID = '8.7.98.0.0.0.0';
    const hourlyChart = new Chart({
      elements: [new Element({ id: placeholderID, seriesOption: { seriesType: SeriesType.Area, useQaColor: false } })],
      stations: [
        new Station({
          label: 'Data from report',
          value: '46251',
          identifierID: '8.7.80.0.0.0.0',
        }),
      ],
      qualifierType: QualifierType.Hourly,
    });
    const reportHits = [require('../../../assets/sample-data/flat_report_fake.json')];
    const options = service.buildOptions(hourlyChart, reportHits, {});

    const actualIDs = service.qualifierHourlyValues.map((nodeValue) => updateNodeValue(placeholderID, nodeValue, 4));
    const hasMatchingElem = (id) => !!findFirstValue(reportHits[0], id);

    expect(reportHits.length).toBe(1);
    expect(hasMatchingElem(placeholderID)).toBeFalsy();
    actualIDs.forEach((id) => expect(hasMatchingElem(id)).toBeTruthy());
    expect(options.series.length).toBe(1);

    expect(options.series[0].data.length).toBe(24);
  });
});
