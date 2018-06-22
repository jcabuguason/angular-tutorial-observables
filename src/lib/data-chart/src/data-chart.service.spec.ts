import { TestBed, getTestBed } from '@angular/core/testing';

import { Chart } from 'angular-highcharts';

import { DataChartService } from './data-chart.service';
import { UserConfigService } from 'msc-dms-commons-angular/core/metadata';

class MockConfigService {
    getFullFormattedHeader(elementID: string) {
        return 'mock ' + elementID;
    }
}

describe('DataChartService', () => {
    let service: DataChartService;
    const hits = [
        ...require('./sample-data-1037090.json').hits.hits.map(json => json._source),
        ...require('./sample-data-1032731.json').hits.hits.map(json => json._source),
        ...require('./sample-data-1021831.json').hits.hits.map(json => json._source),

    ];
    const fieldName = (eID, index = null) => {
        const suffix = (index == null) ? '' : `-L${index}`;
        return `e_${eID.replace(/\./g, '_')}${suffix}`;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DataChartService,
                { provide: UserConfigService, useClass: MockConfigService }
            ],
        });

        service = getTestBed().get(DataChartService);
    });

    it('should create the plot label', () => {
        expect(service.chartLabel('Toronto', {
            elementID: '7.7.7.7.7.7.7'
        })).toBe('Toronto');

        expect(service.chartLabel('Montreal', {
            elementID: '8.8.8.8.8.8.8',
            indexValue: 0
        })).toBe('Montreal (Official)');

        expect(service.chartLabel('Vancouver', {
            elementID: '9.9.9.9.9.9.9',
            indexValue: 2
        })).toBe('Vancouver (Layer 2)');
    });

    it('should decrypts a field', () => {
        expect(service.decryptField('e_1_2_34_567_8_9_0')).toEqual({
            elementID: '1.2.34.567.8.9.0'
        });

        expect(service.decryptField('e_1_2_3_4_5_6_7-L0')).toEqual({
            elementID: '1.2.3.4.5.6.7',
            indexValue: 0
        });

        expect(service.decryptField('e_11_22_33_44_55_66_77-L1')).toEqual({
            elementID: '11.22.33.44.55.66.77',
            indexValue: 1
        });
    });

    it('should create chart object', () => {
        const charts: Chart[] = service.chartColumn(
            [fieldName('1.5.66.8.60.7.0')],
            hits,
        );
        expect(charts.length).toBe(1);
        const chart = charts[0];
        expect(chart.options.chart.type).toBe('spline');
        expect(chart.options.title.text).toBe('mock 1.5.66.8.60.7.0');
        expect(chart.options.series.length).toBe(2);
        expect(chart.options.series[0].data.length).toBe(4);
        expect(chart.options.series[1].data.length).toBe(4);
    });

    it('should accept optional settings', () => {
        const chart: Chart = service.chartColumn(
            [fieldName('1.5.66.8.60.7.0')],
            hits,
            {chart: { type: 'pie'}}
        )[0];

        expect(chart.options.chart.type).toBe('pie');
    });

    it('should create multiple charts', () => {
        const charts: Chart[] = service.chartColumn(
            [fieldName('1.5.66.8.60.7.0'), fieldName('1.19.265.2.1.1.0')],
            hits,
        );
        expect(charts.length).toBe(2);
        const avgAirChart = charts[1];
        expect(avgAirChart.options.title.text).toBe('mock 1.19.265.2.1.1.0');
        expect(avgAirChart.options.series.length).toBe(2);
        const wfgStnData = avgAirChart.options.series.find(series => series.name === 'SARTINE ISLAND (AUT) - 1037090 - WFG');
        const dataPoint = (x, y, qa) => ({x: Date.parse(x), y: y, qa: qa, unit: '°C'});
        expect(wfgStnData).toBeDefined();
        expect(wfgStnData.data).toEqual([
            dataPoint('2018-04-22T00:00:00.000Z', 8.07, '100'),
            dataPoint('2018-04-22T01:00:00.000Z', -77, '0'),
            dataPoint('2018-04-22T02:00:00.000Z', -62.33, '0'),
            dataPoint('2018-04-22T03:00:00.000Z', -57.15, '0'),
        ]);
    });

    it('should display icao id if station does not have tc id', () => {
        const chart: Chart = service.chartColumn(
            [fieldName('1.12.206.0.0.0.0')],
            hits,
        )[0];
        const comoxStn = chart.options.series.find(series => series.name === 'COMOX - 1021831 - CYQQ');
        expect(comoxStn).toBeDefined();
    });

});
