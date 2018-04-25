import { Injectable, EventEmitter } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';

import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';

@Injectable()
export class DataChartService {

    public wipeCharts = new EventEmitter();

    constructor() {}

    // Need to use the class structure that is currently in grid-service
    chartColumn(elementFields: string[], observations, extraOptions: Highcharts.Options = {}): Chart[] {
        const elemSeries: ElementSeries[] = this.createElementSeries(elementFields, observations);

        return elemSeries.map(elem => new Chart(this.elementToChart(elem, extraOptions)));
    }

    /**
     * Element fields are identified as 'e_1_2_3_4_5_6_7' with an optional '-L#' suffix for index layer
     * This is getting passed in for now since element chart input comes from the grid
     * For 2.5.8, element chart selection UI will be separate and will require changes to the State,
     * making this function unneeded.
    */
    decryptField(field: string): ElementInfo {
        const splitField = field.split('-L');
        const res = <ElementInfo>{ elementID: splitField[0].replace('e_', '').replace(/_/g, '.') };
        if (splitField.length > 1) { res.indexValue = Number(splitField[1]); }
        return res;
    }

    chartLabel(stnName: string, info: ElementInfo): string {
        let result = stnName;
        if (info.hasOwnProperty('indexValue')) {
            result += (info.indexValue === 0) ? ' (Official)' : ` (Layer ${info.indexValue})`;
        }
        return result;
    }

    private elementToChart(element: ElementSeries, extraOptions: Highcharts.Options) {
        return Object.assign({
            chart: {
                type: (element.isBar) ? 'column' : 'spline'
            },
            title: {
                text: element.name
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                }
            },
            series: element.series,
            tooltip: {
                pointFormat:
                    '<span style="color:{point.color}">\u25CF</span> ' +
                    '{series.name}: <b>{point.y}</b>, ' +
                    'QA: <b>{point.qa}</b><br/>',
                valueSuffix: ' {point.unit}'
            },
            exporting: {
                enabled: true,
                sourceWidth: 1080,
                filename: element.name,
            }
        }, extraOptions);
    }

    private createElementSeries(elementFields: string[], observations): ElementSeries[] {
        const elemSeries: ElementSeries[] = [];
        for (const obs of observations.filter(obsUtil.latestFromArray).sort(obsUtil.compareObsTimeFromObs)) {

            const stnNameObj = obs.metadataElements.find(elem => elem.name === 'stn_nam');
            const stnName = (!!stnNameObj) ? stnNameObj.value : null;

            elementFields.map(current => this.decryptField(current)).forEach(field => {
                const hasLayer = field.hasOwnProperty('indexValue');
                const foundElem = obs.dataElements
                    .find(elem => elem.elementID === field.elementID &&
                        (!hasLayer || elem.indexValue === field.indexValue));
                if (!!foundElem) {

                    const elementChart = this.findElementSeries(elemSeries, field.elementID);
                    this.findChartSeries(elementChart, this.chartLabel(stnName, field))
                        .addPoint(obs.obsDateTime, foundElem);
                }
            });
        }
        return elemSeries;
    }

    private findElementSeries = (elementSeries: ElementSeries[], elementID: string): ElementSeries => {
        return this.findSeries(elementSeries, elementID, () => new ElementSeries(elementID));
    }


    private findChartSeries = (elemSer: ElementSeries, climateID: string): ChartSeries => {
        return this.findSeries(elemSer.series, climateID, () => new ChartSeries(climateID));
    }

    private findSeries = (series: any[], name: string, buildDefault: () => Series) => {
        let index = series.findIndex(elem => elem.name === name);
        if (index < 0) {
            index = series.push(buildDefault()) - 1;
        }
        return series[index];
    }
}

export class Series {
    name: string;
    constructor(name: string) { this.name = name; }
}

export class ElementSeries extends Series {
    // Will be removed/changed when new Chart Selection UI is available
    isBar: boolean = (this.name.split('.')[1] === '11');
    series: ChartSeries[] = [];
}

export class ChartSeries extends Series {
    data: any[] = [];

    addPoint = (date, element) => this.data.push({
        x: Date.parse(date),
        y: Number(element.value),
        // custom fields
        unit: element.unit || '',
        qa: obsUtil.formatQAValue(element.overallQASummary)
    })
}

export class ElementInfo {
    elementID: string;
    indexValue?: number;
}
