import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class DataChartService {

    public chartColumnRequested = new EventEmitter();

    constructor() {}

    // Need to use the class structure that is currently in grid-service
    chartColumn(chartElementIDs: string[], observations) {

        const elemSeries: ElementSeries[] = this.createElementSeries(chartElementIDs, observations);
        const charts: any[] = [];

        charts.push(...elemSeries.map(elem => this.elementToChart(elem)));

        this.chartColumnRequested.emit(charts);
    }

    private elementToChart(element: ElementSeries) {
        return {
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
        };

    }

    private createElementSeries(chartElementIDs: string[], observations): ElementSeries[] {
        const elemSeries: ElementSeries[] = [];
        for (const obs of observations
                             .sort((o1, o2) =>
                                Date.parse(o1.obsDateTime) - Date.parse(o2.obsDateTime))) {

            const climateID = obs.metadataElements.find(elem => elem.name === 'clim_id');

            for (const chartElementID of chartElementIDs) {
                const foundElement = obs.dataElements.find((obsElem) => obsElem.elementID === chartElementID);

                if (!!foundElement) {
                    this.findChartSeries(this.findElementSeries(elemSeries, chartElementID), climateID)
                        .data.push([Date.parse(obs.obsDateTime), Number(foundElement.value)]);
                }
            }
        }
        return elemSeries;
    }

    private findElementSeries(elementSeries: ElementSeries[], elementID: string): ElementSeries {
        const foundElem = elementSeries.find(elem => elem.name === elementID);

        if (!!foundElem) { return foundElem; }
        const newIndex = elementSeries.push({name: elementID, series: []}) - 1;
        return elementSeries[newIndex];
    }

    private findChartSeries(elemSer: ElementSeries, climateID: string): ChartSeries {
        const foundChart = elemSer.series.find(chart => chart.name === climateID);

        if (!!foundChart) { return foundChart; }
        const newIndex =  elemSer.series.push({name: climateID, data: []}) - 1;
        return elemSer.series[newIndex];
    }
}

export interface ElementSeries {
    name: string;
    series: ChartSeries[];
}

export interface ChartSeries {
    name: string;
    data: any[];
}
