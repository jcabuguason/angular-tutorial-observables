import { Injectable, EventEmitter } from '@angular/core';

import { Chart, Highcharts } from 'angular-highcharts';
import { ChartObject, Element, Station } from './model/chart.model';

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
    public unitService: UnitCodeConversionService
  ) {
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const months = [
      'JANUARY',
      'FEBRUARY',
      'MARCH',
      'APRIL',
      'MAY',
      'JUNE',
      'JULY',
      'AUGUST',
      'SEPTEMBER',
      'OCTOBER',
      'NOVEMBER',
      'DECEMBER',
    ];
    translate.onLangChange.subscribe(evt =>
      Highcharts.setOptions({
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
        },
      })
    );
  }

  chart(chartObj: ChartObject, obs, extraOptions = {}): Chart {
    const series =
      chartObj.stations.length === 1
        ? this.chartMulti(chartObj, obs, extraOptions)
        : this.chartSingle(chartObj, obs, extraOptions);

    return new Chart(series);
  }

  private chartSingle(chartObj: ChartObject, obs, extraOptions) {
    return Object.assign(
      {
        chart: {
          zoomType: 'xy',
        },
        title: {
          text: this.configService.getFullFormattedHeader(chartObj.elements[0].id),
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: this.instantSingle('CHART', 'DATE_TIME'),
          },
        },
        yAxis: this.buildYAxes(chartObj, obs),
        credits: {
          enabled: false,
        },
        series: this.createSingleSeries(chartObj, obs),
        lang: {
          noData: this.buildNoDataString(chartObj),
        },
      },
      extraOptions
    );
  }

  private createSingleSeries(chartObj: ChartObject, observations) {
    const series = [];
    const yTypes = [];
    const stations = chartObj.stations;
    const elements = chartObj.elements;

    for (const station of stations) {
      const sensor = {};
      let name;

      for (const obs of observations
        .filter(obsUtil.latestFromArray)
        .filter(ob => ob.identifier === station.id)
        .sort(obsUtil.compareObsTimeFromObs)) {
        for (const e of elements) {
          const foundElems = obs.dataElements.filter(elem => elem.elementID === e.id);
          this.buildSensor(foundElems, sensor, obs, yTypes);
          name = this.createStationLabel(obs.metadataElements);
        }
      }
      const element = chartObj.elements[0];
      const elemType = element.chartType ? element.chartType : this.getElementType(element.id);
      this.buildSeries(series, sensor, name, yTypes, elemType);
    }
    return series;
  }

  private buildSeries(series, sensor, name, yTypes, type) {
    series.push(
      ...Object.keys(sensor).map((key, index) => ({
        name: `${name} ${sensor[key]['sensorType']}`,
        showInLegend: true,
        data: sensor[key],
        yAxis: yTypes.indexOf(sensor[key][0].unit),
        type: type,
        isSensor: sensor[key]['isSensor'],
      }))
    );
  }

  private buildSensor(foundElems, sensor, obs, yTypes) {
    for (const e of foundElems) {
      const sensorType = this.getSensorType(e);
      const isSensor = !!e.index && e.index.name === 'sensor_index';
      if (!!e) {
        if (yTypes.indexOf(e.unit) === -1) {
          yTypes.push(e.unit);
        }
        this.unitService.setPreferredUnits(e);
        const key = e.indexValue;
        if (!sensor[key]) {
          sensor[key] = [];
        }
        sensor[key]['sensorType'] = sensorType;
        sensor[key]['isSensor'] = isSensor;
        sensor[key].push({
          x: Date.parse(obs.obsDateTime),
          y: Number(e.value),
          // custom fields
          unit: e.unit || '',
          qa: obsUtil.formatQAValue(e.overallQASummary),
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
        for (const obs of observations.filter(ob => ob.identifier === station.id)) {
          const hasUnit = elem.hasOwnProperty('unit');
          const foundElem = obs.dataElements.find(elemt => elemt.elementID === elem.id && !hasUnit);

          if (!!foundElem) {
            if (values.indexOf(foundElem.unit) === -1) {
              values.push(foundElem.unit);
              names.push({
                unit: foundElem.unit,
                name: this.configService.getFormattedNodeName(foundElem.elementID, 2),
              });
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
        },
      },
      opposite: !!(index % 2),
    }));
  }

  private chartMulti(chartObj: ChartObject, observations, extraOptions) {
    return Object.assign(
      {
        chart: {
          zoomType: 'xy',
        },
        title: {
          text: chartObj.stations[0].label,
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: this.instantSingle('CHART', 'DATE_TIME'),
          },
        },
        yAxis: this.buildYAxes(chartObj, observations),
        series: this.createMultiSeries(chartObj, observations),
        lang: {
          noData: this.buildNoDataString(chartObj),
        },
        credits: {
          enabled: false,
        },
      },
      extraOptions
    );
  }

  createMultiSeries(chartObj: ChartObject, observations) {
    const series = [];
    const yTypes = [];
    const station = chartObj.stations[0];
    const elements = chartObj.elements;

    for (const element of elements) {
      const sensor = {};

      for (const obs of observations.sort(obsUtil.compareObsTimeFromObs).filter(ob => ob.identifier === station.id)) {
        const foundElems = obs.dataElements.filter(elemt => elemt.elementID === element.id);
        this.buildSensor(foundElems, sensor, obs, yTypes);
      }

      const name = this.configService.buildFullNodeName(element.id);
      const type = element.chartType ? element.chartType : this.getElementType(element.id);
      this.buildSeries(series, sensor, name, yTypes, type);
    }
    return series;
  }

  getSensorType(e) {
    if (e.indexValue === 0) {
      return this.translate.instant('GRID.OFFICIAL');
    } else if (e.indexValue > 0) {
      const label = this.translate.instant(`GRID.${e.index.name.toUpperCase()}_LABEL`);
      return `${label} ${e.indexValue}`;
    } else {
      return '';
    }
  }

  // get the graph type for an element
  getElementType(elem) {
    if (elem === '1.17.253.0.0.0.0' || elem === '1.17.438.0.0.0.0') {
      return 'area';
    } else if (elem.split('.')[1] === '11') {
      return 'column';
    } else {
      return 'spline';
    }
  }

  private createStationLabel(metadataElements) {
    const getObjValue = name => {
      const obj = metadataElements.find(elem => elem.name === name);
      return obj ? obj.value : null;
    };
    const formatId = name => {
      const id = getObjValue(name);
      return id != null ? ` - ${id}` : '';
    };
    return `${getObjValue('stn_nam')}` + formatId('clim_id') + (formatId('tc_id') || formatId('icao_stn_id'));
  }

  private buildNoDataString(chartObj) {
    const elems = chartObj.elements.map(elem => `<li>${this.configService.buildFullNodeName(elem.id)}</li>`).join('');
    return `${this.instantSingle('CHART', 'NO_DATA')}: ${elems}`;
  }

  private instantSingle = (header, key) => this.translate.instant(`${header}.${key}`);
  private instantArray = (header, keys) => keys.map(key => this.instantSingle(header, key));
}
