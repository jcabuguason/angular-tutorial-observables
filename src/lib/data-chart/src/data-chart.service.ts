import { Injectable, EventEmitter } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';

import { UserConfigService } from 'msc-dms-commons-angular/core/metadata';
import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';

import { UnitCodeConversionService } from 'msc-dms-commons-angular/core/obs-util';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DataChartService {

    public wipeCharts = new EventEmitter();

    constructor(
        public translate: TranslateService,
        public configService: UserConfigService,
        public unitService: UnitCodeConversionService,
    ) {
        const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const months =
            ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        translate.onLangChange.subscribe(evt => Highcharts.setOptions({
            lang: {
                contextButtonTitle: this.instantSingle('CHART_DEFAULTS', 'contextButtonTitle'),
                printChart: this.instantSingle('CHART_DEFAULTS', 'printChart'),
                downloadPNG: this.instantSingle('CHART_DEFAULTS', 'downloadPNG'),
                downloadJPEG: this.instantSingle('CHART_DEFAULTS', 'downloadJPEG'),
                downloadPDF: this.instantSingle('CHART_DEFAULTS', 'downloadPDF'),
                downloadSVG: this.instantSingle('CHART_DEFAULTS', 'downloadSVG'),
                loading: this.instantSingle('CHART_DEFAULTS', 'loading'),
                resetZoom: this.instantSingle('CHART_DEFAULTS', 'resetZoom'),
                resetZoomTitle: this.instantSingle('CHART_DEFAULTS', 'resetZoomTitle'),
                shortMonths: this.instantArray('DATES', months.map(month => `${month}_SHORT`)),
                months: this.instantArray('DATES', months),
                weekdays: this.instantArray('DATES', weekdays),
            }
        }));
    }

    chartColumn(chartObj: ChartObject, obs, extraOptions = {}): Chart {

        const series = (chartObj.stations.length === 1)
            ? this.chartMulti(chartObj, obs, extraOptions)
            : this.chartSingle(chartObj, obs, extraOptions);

        return new Chart(series);
    }

    private chartSingle(chartObj: ChartObject, obs, extraOptions) {
        const name = chartObj.elements[0];
        return Object.assign({
            chart: {
                type: !!(name) ? this.getElementType(name) : '',
                zoomType: 'xy',
            },
            title: {
                text: (!!(name) ? this.configService.getFullFormattedHeader(name) : ''),
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: this.instantSingle('CHART', 'DATE_TIME'),
                }
            },
            yAxis: this.buildYAxes(chartObj, obs),
            credits: {
                enabled: false
            },
            series: this.createSingleSeries(chartObj, obs),
            lang: {
                noData: this.buildNoDataString(chartObj),
            },
        }, extraOptions);
    }

    private createSingleSeries(chartObj: ChartObject, observations) {
        const series = [];
        const yTypes = [];
        const stations = chartObj.stations;
        const elements = chartObj.elements;
        let colorIndex = 0;

        for (const station of stations) {
            const sensor = {};
            let name;

            for (const obs of observations.filter(obsUtil.latestFromArray)
                .filter(ob => ob.identifier === station['id']).sort(obsUtil.compareObsTimeFromObs)) {
                name = this.createStationLabel(obs.metadataElements);

                for (const field of elements) {
                    const foundElems = obs.dataElements.filter(elem => elem.elementID === field);
                    this.buildSensor(foundElems, sensor, obs, yTypes, colorIndex);
                }
                colorIndex++;
            }
            this.buildSeries(series, sensor, name, yTypes, this.getElementType(elements[0]));
        }
        return series;
    }

    private buildSeries(series, sensor, name, yTypes, type) {
        series.push(...Object.keys(sensor)
            .map((key, index) => ({
                name: name,
                showInLegend: (index === 0),
                data: sensor[key],
                yAxis: yTypes.indexOf((sensor[key][0].unit)),
                type: type,
                color: Highcharts.getOptions().colors[sensor[key]['colorIndex']],
            })
            )
        );
    }

    private buildSensor(foundElems, sensor, obs, yTypes, colorIndex) {
        for (const e of foundElems) {
            if (!!e) {
                if (yTypes.indexOf(e.unit) === -1) {
                    yTypes.push(e.unit);
                }
                this.unitService.setPreferredUnits(e);
                const key = e.indexValue;
                if (!sensor[key]) { sensor[key] = []; }
                sensor[key]['colorIndex'] = colorIndex;
                sensor[key].push({
                    x: Date.parse(obs.obsDateTime),
                    y: Number(e.value),
                    // custom fields
                    unit: e.unit || '',
                    qa: obsUtil.formatQAValue(e.overallQASummary)
                });
            }
        }
    }

    private buildYAxes(chartObj: ChartObject, observations) {
        const elements = chartObj.elements;
        const stations = chartObj.stations;
        const names = [];
        const values = [];

        for (const station of stations) {
            for (const elem of elements) {
                for (const obs of observations.filter(ob => ob.identifier === station['id'])) {
                    const hasUnit = elem.hasOwnProperty('unit');
                    const foundElem = obs.dataElements
                        .find(elemt => elemt.elementID === elem && (!hasUnit));

                    if (!!foundElem) {
                        if (values.indexOf(foundElem.unit) === -1) {
                            values.push(foundElem.unit);
                            names.push({ unit: foundElem.unit, name: this.configService.getFormattedNodeName(foundElem.elementID, 2) });
                        }
                    }
                    // TODO: Replace when packaged with ES6
                    // const names = [...new Set(
                    //     elements.map(elem => this.configService.getFormattedNodeName(elem, 2))
                    // )];
                }
            }
        }
        return names.map((axis, index) => ({
            title: {
                gridLineWidth: 0,
                text: `${axis.name} (${axis.unit})`,
                style: {
                    color: 'black',
                },
                rotation: 270,
                labels: {
                    format: '{value}',
                }
            },
            opposite: !!(index % 2),
        }));
    }

    private chartMulti(chartObj: ChartObject, observations, extraOptions) {
        return Object.assign({
            chart: {
                zoomType: 'xy',
                marginBottom: 160,
            },
            title: {
                text: chartObj.stations[0]['label'],
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: this.instantSingle('CHART', 'DATE_TIME'),
                }
            },
            yAxis: this.buildYAxes(chartObj, observations),
            legend: {
                layout: 'vertical',
                align: 'left',
                x: 80,
                itemMarginTop: 0,
                verticalAlign: 'bottom',
                floating: true,
                backgroundColor: 'rgba(255,255,255,0.25)'
            },
            series: this.createMultiSeries(chartObj, observations),
            lang: {
                noData: this.buildNoDataString(chartObj),
            },
        }, extraOptions);
    }

    createMultiSeries(chartObj: ChartObject, observations) {
        const series = [];
        const yTypes = [];
        const station = chartObj.stations[0];
        const elements = chartObj.elements;
        let colorIndex = 0;

        for (const element of elements) {
            const sensor = {};

            for (const obs of observations.sort(obsUtil.compareObsTimeFromObs)
                .filter(ob => ob.identifier === station['id'])) {
                const hasLayer = element.hasOwnProperty('indexValue');
                const foundElems = obs.dataElements.filter(elemt => elemt.elementID === element && (!hasLayer));
                this.buildSensor(foundElems, sensor, obs, yTypes, colorIndex);
            }

            const name = this.configService.getFullFormattedHeader(element);
            const type = this.getElementType(element);
            this.buildSeries(series, sensor, name, yTypes, type);
            colorIndex++;
        }
        return series;
    }

    // get the graph type for an element
    getElementType(elem) {
        if (elem.split('.')[1] === '11') {
            return 'column';
        } else { return 'spline'; }
    }

    private createStationLabel(metadataElements) {
        const getObjValue = (name) => {
            const obj = metadataElements.find(elem => elem.name === name);
            return (obj) ? obj.value : null;
        };
        const formatId = (name) => {
            const id = getObjValue(name);
            return (id != null) ? ` - ${id}` : '';
        };
        return `${getObjValue('stn_nam')}`
            + formatId('clim_id')
            + (formatId('tc_id') || formatId('icao_stn_id'));
    }

    private buildNoDataString(chartObj) {
        const elems = chartObj.elements.map(elem => `<li>${this.configService.getFullFormattedHeader(elem)}</li>`).join('');
        return `${this.instantSingle('CHART', 'NO_DATA')}: ${elems}`;
    }

    private instantSingle = (header, key) => this.translate.instant(`${header}.${key}`);
    private instantArray = (header, keys) => keys.map(key => this.instantSingle(header, key));
}

export class ChartObject {
    constructor(
        public elements: string[],
        public stations: string[],
    ) { }
}
