import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import { UserConfigService } from 'msc-dms-commons-angular/core/metadata';
import * as obsUtil from 'msc-dms-commons-angular/core/obs-util';
import {
  CLIMATE_ID_ELEMENT,
  ICAO_ID_ELEMENT,
  STATION_NAME_ELEMENT,
  TC_ID_ELEMENT,
  UnitCodeConversionService,
} from 'msc-dms-commons-angular/core/obs-util';
import { Subject } from 'rxjs';
import { ChartObject, Element, Station } from './model/chart.model';

@Injectable()
export class DataChartService {
  public wipeCharts = new Subject();

  constructor(
    public translate: TranslateService,
    public configService: UserConfigService,
    public unitService: UnitCodeConversionService,
  ) {
    HC_no_data_to_display(Highcharts);
    HC_exporting(Highcharts);
    HC_offline_exporting(Highcharts);

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
          shortMonths: this.instantArray(
            'DATES',
            months.map(month => `${month}_SHORT`),
          ),
          months: this.instantArray('DATES', months),
          weekdays: this.instantArray('DATES', weekdays),
        },
      }),
    );
  }

  buildOptions(chartObj: ChartObject, obs, options = {}) {
    return chartObj.stations.length === 1
      ? this.chartMulti(chartObj, obs, options)
      : this.chartSingle(chartObj, obs, options);
  }

  private chartSingle(chartObj: ChartObject, obs, options) {
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
        series: this.createSingleSeries(chartObj, obs, options),
        lang: {
          noData: this.buildNoDataString(chartObj),
        },
      },
      options.highchartsOptions,
    );
  }

  private createSingleSeries(chartObj: ChartObject, observations, options) {
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
          const type = e.chartType ? e.chartType : this.getElementType(e.id);
          this.buildSensor(foundElems, sensor, obs, yTypes, options, type);
          name = this.createStationLabel(obs.metadataElements);
        }
      }
      const element = chartObj.elements[0];
      const elemType = element.chartType ? element.chartType : this.getElementType(element.id);
      this.buildSeries(series, sensor, name, yTypes, elemType, options);
    }
    return series;
  }

  private buildSeries(series, sensor, name, yTypes, type, options) {
    const custom = options.customOptions;
    series.push(
      ...Object.keys(sensor).map((key, index) => ({
        name: `${name} ${sensor[key]['sensorType']}`,
        showInLegend: true,
        data: sensor[key],
        yAxis: yTypes.indexOf(sensor[key][0].unit),
        type: type,
        isSensor: sensor[key]['isSensor'],
        visible: sensor[key]['isSensor'] && !!custom ? custom.showSensors : true,
        turboThreshold: 1500,
      })),
    );
  }

  private getQAColor(sensorQA: Number): string {
    switch (sensorQA) {
      case 100:
        return '#008000';
      case 101:
        return '#ffc0cb';
      case 110:
        return '#eeeeee';
      case 20:
        return '#0000ff';
      case 15:
        return '#ffff00';
      case 10:
        return '#FFA500';
      case 0:
        return '#ff0000';
      case -1:
        return '#000000';
      case -10:
        return '#8b4513';
      default:
        return '#FFFFFF';
    }
  }

  private buildSensor(foundElems, sensor, obs, yTypes, options, chartType) {
    const newFoundElems = this.duplicateElemFilter(foundElems);
    for (const e of newFoundElems) {
      const sensorType = this.getSensorType(e);
      const isSensor = !!e.index && e.index.name === 'sensor_index';
      if (!!e) {
        if (!yTypes.includes(e.unit)) {
          yTypes.push(e.unit);
        }
        this.unitService.setPreferredUnits(e);
        const key = e.indexValue;
        if (!sensor[key]) {
          sensor[key] = [];
        }
        const qa = this.parseElementValue(e, options, 'overallQASummary');
        sensor[key]['sensorType'] = sensorType;
        sensor[key]['isSensor'] = isSensor;
        sensor[key].push({
          x: Date.parse(obs.obsDateTime),
          y: Number(this.parseElementValue(e, options, 'value')),
          // custom fields
          unit: e.unit || '',
          qa: obsUtil.formatQAValue(qa),
          ...(this.shouldAddQA(options, chartType) && {
            color: this.getQAColor(qa),
            marker: {
              lineColor: 'black',
              lineWidth: 2,
            },
          }),
        });
      }
    }
  }

  private shouldAddQA(options, chartType) {
    return !!options.customOptions && options.customOptions.showQAColors && chartType !== 'column';
  }

  private parseElementValue(element, options, property: 'value' | 'overallQASummary') {
    const custom = options.customOptions;
    return !!custom && custom.showOriginalValue && element.hasOwnProperty('original')
      ? element.original[property]
      : element[property];
  }

  private duplicateElemFilter(foundElems) {
    const isProblemElem = foundElems.length > 1 && foundElems.every(e => !e.index || e.index.name !== 'sensor_index');
    return isProblemElem ? foundElems.filter(e => !e.dataType) : foundElems;
  }

  private buildYAxes(chartObj: ChartObject, observations) {
    const elements: Element[] = chartObj.elements;
    const stations: Station[] = chartObj.stations;
    const names = [];
    const values = [];

    for (const station of stations) {
      for (const elem of elements) {
        for (const obs of observations.filter(ob => ob.identifier === station.id)) {
          const hasUnit = elem.hasOwnProperty('unit');
          const foundElem = obs.dataElements.filter(elemt => elemt.elementID === elem.id && !hasUnit);
          const newFoundElems = this.duplicateElemFilter(foundElem);
          if (newFoundElems.length > 0) {
            if (!values.includes(newFoundElems[0].unit)) {
              values.push(newFoundElems[0].unit);
              names.push({
                unit: newFoundElems[0].unit,
                name: this.configService.getFormattedNodeName(newFoundElems[0].elementID, 2),
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

  private chartMulti(chartObj: ChartObject, observations, options) {
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
        series: this.createMultiSeries(chartObj, observations, options),
        lang: {
          noData: this.buildNoDataString(chartObj),
        },
        credits: {
          enabled: false,
        },
      },
      options.highchartsOptions,
    );
  }

  createMultiSeries(chartObj: ChartObject, observations, options) {
    const series = [];
    const yTypes = [];
    const station = chartObj.stations[0];
    const elements = chartObj.elements;

    for (const element of elements) {
      const sensor = {};
      const type = element.chartType ? element.chartType : this.getElementType(element.id);

      for (const obs of observations
        .filter(obsUtil.latestFromArray)
        .sort(obsUtil.compareObsTimeFromObs)
        .filter(ob => ob.identifier === station.id)) {
        const foundElems = obs.dataElements.filter(elemt => elemt.elementID === element.id);
        this.buildSensor(foundElems, sensor, obs, yTypes, options, type);
      }

      const name = this.configService.buildFullNodeName(element.id);
      this.buildSeries(series, sensor, name, yTypes, type, options);
    }
    return series;
  }

  getSensorType(e) {
    if (e.indexValue === 0) {
      return this.translate.instant('OBS.OFFICIAL');
    } else if (e.indexValue > 0) {
      return `${this.translate.instant(obsUtil.getIndexLabelTranslationKey(e))} ${e.indexValue}`;
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
    const getObjValue = elementID => {
      const obj = metadataElements.find(elem => elem.elementID === elementID);
      return obj ? obj.value : null;
    };
    const formatId = elementID => {
      const id = getObjValue(elementID);
      return id != null ? ` - ${id}` : '';
    };
    return (
      `${getObjValue(STATION_NAME_ELEMENT)}${formatId(CLIMATE_ID_ELEMENT)}` +
      `${formatId(TC_ID_ELEMENT) || formatId(ICAO_ID_ELEMENT)}`
    );
  }

  private buildNoDataString(chartObj) {
    const elems = chartObj.elements.map(elem => `<li>${this.configService.buildFullNodeName(elem.id)}</li>`).join('');
    return `${this.instantSingle('CHART', 'NO_DATA')}: ${elems}`;
  }

  private instantSingle = (header, key) => this.translate.instant(`${header}.${key}`);
  private instantArray = (header, keys) => keys.map(key => this.instantSingle(header, key));
}
