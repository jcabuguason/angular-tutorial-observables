import { Injectable, EventEmitter } from '@angular/core';

import { Highcharts } from 'angular-highcharts';

@Injectable()
export class DataChartService {

    public chartColumnRequested = new EventEmitter();

    constructor() {}

    // Need to use the class structure that is currently in grid-service
    chartColumn(chartElementIDs: string[], observations) {

        const elemSeries: ElementSeries[] = this.createElementSeries(chartElementIDs, observations);
        const charts: any[] = [];

        for (const element of elemSeries) {
            charts.push( {
                chart: {
                    type: 'spline'
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
                yAxis: {
                    title: {
                        text: element.name
                    }
                },
                series: element.series
            });

        }

        this.chartColumnRequested.emit(charts);
    }

    private createElementSeries(chartElementIDs: string[], observations): ElementSeries[] {
        let climateID: string;
        let obsTime: string;
        const elemSeries: ElementSeries[] = [];

        for (const obs of observations
                             .sort((o1, o2) =>
                                Date.parse(o1.obsDateTime) - Date.parse(o2.obsDateTime))) {

            obsTime = obs.obsDateTime;

            for (const element of obs.metadataElements) {
                if (element.name === 'clim_id') {
                    climateID = element.value;
                }
            }

            for (const obsElement of obs.dataElements) {
                for (const chartElementID of chartElementIDs) {
                    if (obsElement.elementID === chartElementID) {
                        this.getChartSeries(elemSeries, chartElementID, climateID)
                            .data.push([Date.parse(obsTime), Number(obsElement.value)]);
                    }
                }
            }

        }

        return elemSeries;

    }

    private getElementSeries(elementSeries: ElementSeries[], elementID: string): ElementSeries {
        for (const elemSer of elementSeries) {
            if (elemSer.name === elementID) {
                return elemSer;
            }
        }
        const newSeries: ElementSeries = {name: elementID, series: []};
        elementSeries.push(newSeries);
        return newSeries;
    }

    private getChartSeries(elementSeries: ElementSeries[], elementID: string, climateID: string): ChartSeries {
        const elemSer = this.getElementSeries(elementSeries, elementID);

        for (const chartSer of elemSer.series) {
            if (chartSer.name === climateID) {
                return chartSer;
            }
        }

        const newSeries: ChartSeries = {name: climateID, data: []};
        elemSer.series.push(newSeries);
        return newSeries;
    }
}

export interface ElementSeries {
    name: string;
    series: ChartSeries[];
}

// Series object will be an array of these
export interface ChartSeries {
    name: string;
    data: any[];
}

