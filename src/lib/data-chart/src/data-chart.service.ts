import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import { range } from 'msc-dms-commons-angular/shared/util';
import { UserConfigService } from 'msc-dms-commons-angular/core/metadata';
import {
  CLIMATE_ID_ELEMENT,
  ICAO_ID_ELEMENT,
  STATION_NAME_ELEMENT,
  TC_ID_ELEMENT,
  UnitCodeConversionService,
  compareObsTimeFromObs,
  findObsIdentifier,
  formatQAValue,
  getIndexLabelTranslationKey,
  latestFromArray,
  updateNodeValue,
} from 'msc-dms-commons-angular/core/obs-util';
import { Subject } from 'rxjs';
import { Chart, Element, SeriesType, Station, QualifierType } from './model/chart.model';
import { DataChartOptions } from './model/options.model';

@Injectable()
export class DataChartService {
  public wipeCharts = new Subject();

  readonly minQualifierHourly = 86;
  readonly maxQualifierHourly = 109;
  readonly qualifierHourlyValues = range(this.minQualifierHourly, this.maxQualifierHourly);

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

  // Assuming just basic chart for now
  buildOptions(chartObj: Chart, observations, options: DataChartOptions) {
    return Object.assign(
      {
        chart: {
          zoomType: 'xy',
        },
        title: {
          text: this.determineChartTitle(chartObj),
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: this.instantSingle('CHART', 'DATE_TIME'),
          },
        },
        yAxis: this.buildYAxes(chartObj, observations),
        series: this.createSeries(chartObj, observations, options),
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

  findQualifierElementName(id: string, qualifierType: QualifierType) {
    const key = (type: QualifierType): string => {
      switch (type) {
        case QualifierType.HOURLY:
          return 'CHART.HOURLY';
      }
    };
    return `${this.configService.getFormattedNodeName(id, 3)}  (${this.translate.instant(key(qualifierType))})`;
  }

  private determineChartTitle(chartObj: Chart): string {
    if (chartObj.stations.length === 1) {
      return chartObj.stations[0].label;
    } else {
      return chartObj.qualifierType === QualifierType.NONE
        ? this.configService.getFullFormattedHeader(chartObj.elements[0].id)
        : this.findQualifierElementName(chartObj.elements[0].id, chartObj.qualifierType);
    }
  }

  private determineSeriesName(chartObj: Chart, stationName: string, elementID: string): string {
    if (chartObj.stations.length === 1) {
      return chartObj.qualifierType === QualifierType.NONE
        ? this.configService.buildFullNodeName(elementID)
        : this.findQualifierElementName(elementID, chartObj.qualifierType);
    } else {
      return stationName;
    }
  }

  private createSeries(chartObj: Chart, observations, options: DataChartOptions) {
    const series = [];
    const yTypes = [];
    const stations = chartObj.stations;
    const elements = chartObj.elements;
    const sortedObs = observations.filter(latestFromArray).sort(compareObsTimeFromObs);
    const isSingleStation = stations.length === 1;

    for (const element of elements) {
      for (const station of stations) {
        const sensor = {};
        let stationName = '';
        for (const obs of sortedObs.filter(ob => findObsIdentifier(ob, station.identifierID) === station.value)) {
          const foundElems = this.grabElementsFromObs(obs, element.id, chartObj.qualifierType);
          this.buildSensor(
            foundElems,
            sensor,
            obs.obsDateTime,
            yTypes,
            options,
            chartObj.qualifierType,
            element.seriesType,
          );
          if (!isSingleStation && !stationName) {
            // Workaround for report-based pages. Re-use the label from their dropdown.
            stationName = this.createStationLabel(obs.metadataElements) || station.label;
          }
        }
        const seriesType = element.seriesType || this.getSeriesType(element.id);
        const name = this.determineSeriesName(chartObj, stationName, element.id);
        this.buildSeries(series, sensor, name, yTypes, seriesType, options);
      }
    }
    return series;
  }

  private buildSeries(series, sensor, name, yTypes, type, options: DataChartOptions) {
    const custom = options.customOptions;
    series.push(
      ...Object.keys(sensor).map((key, index) => ({
        name: `${name} ${sensor[key]['sensorType']}`,
        showInLegend: true,
        data: sensor[key],
        yAxis: yTypes.indexOf(sensor[key][0].unit),
        type: type,
        zIndex: sensor[key]['isOfficial'] ? 1 : 0,
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

  private buildDateValue(obsDateTime, elementID: string, qualifierType: QualifierType): number {
    const chartDate = new Date(obsDateTime);
    switch (qualifierType) {
      case QualifierType.NONE:
        break;
      case QualifierType.HOURLY:
        const reportHour = +elementID.split('.')[4];
        const hour = (chartDate.getUTCHours() + reportHour - this.minQualifierHourly) % 24;
        chartDate.setUTCHours(hour);
    }

    return chartDate.getTime();
  }

  private buildSensor(
    foundElems,
    sensor,
    obsDateTime,
    yTypes,
    options: DataChartOptions,
    qualifierType: QualifierType,
    seriesType: SeriesType,
  ) {
    for (const e of foundElems) {
      const sensorType = this.getSensorType(e);
      const isSensor = !!e.index && e.index.name === 'sensor_index';
      if (!!e) {
        const value = Number(this.parseElementValue(e, options, 'value'));
        const qa = this.parseElementValue(e, options, 'overallQASummary');
        if (value == null || isNaN(value)) {
          continue;
        }
        if (!yTypes.includes(e.unit)) {
          yTypes.push(e.unit);
        }
        this.unitService.setPreferredUnits(e);
        const key = e.indexValue;
        if (!sensor[key]) {
          sensor[key] = [];
        }
        sensor[key]['sensorType'] = sensorType;
        sensor[key]['isSensor'] = isSensor;
        sensor[key]['isOfficial'] = e.indexValue === 0;
        sensor[key].push({
          x: this.buildDateValue(obsDateTime, e.elementID, qualifierType),
          y: value,
          // custom fields
          unit: e.unit || '',
          qa: formatQAValue(qa),
          // optional color fields
          ...(this.shouldAddQA(options, seriesType) && {
            color: this.getQAColor(qa),
            marker: {
              lineColor: 'black',
              lineWidth: 2,
            },
          }),
        });
      }
    }

    Object.values(sensor).forEach(s => this.sortByX(s));
  }

  private shouldAddQA(options: DataChartOptions, seriesType: SeriesType) {
    return !!options.customOptions && options.customOptions.showQAColors && seriesType !== SeriesType.BAR;
  }

  private sortByX = s => s.sort((a, b) => (a.x === b.x ? 0 : a.x < b.x ? -1 : 1));

  private parseElementValue(element, options: DataChartOptions, property: 'value' | 'overallQASummary') {
    const custom = options.customOptions;
    return !!custom && custom.showOriginalValue && element.hasOwnProperty('original')
      ? element.original[property]
      : element[property];
  }

  private duplicateElemFilter(foundElems) {
    const isProblemElem = foundElems.length > 1 && foundElems.every(e => !e.index || e.index.name !== 'sensor_index');
    return isProblemElem ? foundElems.filter(e => !e.dataType) : foundElems;
  }

  private grabElementsFromObs(obs, givenID: string, qualifierType: QualifierType): any[] {
    let ids = [];
    switch (qualifierType) {
      case QualifierType.NONE:
        ids = [givenID];
        break;
      case QualifierType.HOURLY:
        ids = this.qualifierHourlyValues.map(nodeValue => updateNodeValue(givenID, nodeValue, 4));
        break;
    }

    return this.duplicateElemFilter(obs.dataElements.filter(elem => ids.includes(elem.elementID)));
  }

  private buildYAxes(chartObj: Chart, observations) {
    const elements: Element[] = chartObj.elements;
    const stations: Station[] = chartObj.stations;
    const names = [];
    const values = [];

    for (const station of stations) {
      for (const elem of elements) {
        for (const obs of observations.filter(ob => findObsIdentifier(ob, station.identifierID) === station.value)) {
          const foundElems = this.grabElementsFromObs(obs, elem.id, chartObj.qualifierType);
          if (foundElems.length > 0) {
            // NOTE: This behaviour is a bit odd when working with flat-tables with renamed elements
            if (!values.includes(foundElems[0].unit)) {
              const depth = chartObj.qualifierType === QualifierType.NONE ? 2 : 3;
              values.push(foundElems[0].unit);
              names.push({
                unit: foundElems[0].unit,
                name: this.configService.getFormattedNodeName(foundElems[0].elementID, depth),
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

  getSensorType(e) {
    if (e.indexValue === 0) {
      return this.translate.instant('OBS.OFFICIAL');
    } else if (e.indexValue > 0) {
      return `${this.translate.instant(getIndexLabelTranslationKey(e))} ${e.indexValue}`;
    } else {
      return '';
    }
  }

  // get the chart type for an element
  getSeriesType(elem): SeriesType {
    if (elem === '1.17.253.0.0.0.0' || elem === '1.17.438.0.0.0.0') {
      return SeriesType.AREA;
    } else if (elem.split('.')[1] === '11') {
      return SeriesType.BAR;
    } else {
      return SeriesType.LINE;
    }
  }

  private createStationLabel(metadataElements) {
    const getObjValue = elementID => {
      const obj = metadataElements.find(elem => elem.elementID === elementID);
      return obj ? obj.value : '';
    };
    const formatId = elementID => {
      const id = getObjValue(elementID);
      return !!id ? ` - ${id}` : '';
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
