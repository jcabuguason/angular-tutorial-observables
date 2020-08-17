import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import HC_no_data_to_display from 'highcharts/modules/no-data-to-display';
import HC_offline_exporting from 'highcharts/modules/offline-exporting';
import { range } from 'msc-dms-commons-angular/shared/util';
import { UserConfigService } from 'msc-dms-commons-angular/core/user-config';
import {
  CLIMATE_ID_ELEMENT,
  ICAO_ID_ELEMENT,
  STATION_NAME_ELEMENT,
  TC_ID_ELEMENT,
  DMSObs,
  ObsElement,
  UnitCodeConversionService,
  compareObsTimeFromObs,
  findAllElements,
  findFirstValue,
  findObsIdentifier,
  formatQAValue,
  getIndexLabelTranslationKey,
  grabIndexValue,
  latestFromArray,
  updateNodeValue,
} from 'msc-dms-commons-angular/core/obs-util';
import { Subject, BehaviorSubject } from 'rxjs';
import { Chart, Element, SeriesType, Station, QualifierType } from './model/chart.model';
import { DataChartOptions } from './model/options.model';

@Injectable()
export class DataChartService {
  public wipeCharts = new Subject();
  public chartLoading$ = new BehaviorSubject(undefined);

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
    translate.onLangChange.subscribe((evt) =>
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
            months.map((month) => `${month}_SHORT`),
          ),
          months: this.instantArray('DATES', months),
          weekdays: this.instantArray('DATES', weekdays),
        },
      }),
    );
  }

  // Assuming just basic chart for now
  buildOptions(chartObj: Chart, observations: DMSObs[], options: DataChartOptions) {
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

  isMatchingObs(obs: DMSObs, station: Station): boolean {
    return findObsIdentifier(obs, station.identifierID).toLowerCase() === station.value.toLowerCase();
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

  private createSeries(chartObj: Chart, observations: DMSObs[], options: DataChartOptions) {
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
        for (const obs of sortedObs.filter((ob) => this.isMatchingObs(ob, station))) {
          const foundElems = this.grabElementsFromObs(obs, element.id, chartObj.qualifierType);
          this.buildSensor(
            foundElems,
            sensor,
            obs.obsDateTime,
            yTypes,
            options,
            chartObj.qualifierType,
            element.seriesType,
            element.useQaColor,
          );
          if (!isSingleStation && !stationName) {
            stationName = this.createStationLabel(obs, station.label);
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
    foundElems: ObsElement[],
    sensor,
    obsDateTime,
    yTypes,
    options: DataChartOptions,
    qualifierType: QualifierType,
    seriesType: SeriesType,
    useQaColor: boolean,
  ) {
    for (const elem of foundElems) {
      if (!!elem) {
        const value = Number(this.parseElementValue(elem, options, 'value'));
        const qa = this.parseElementValue(elem, options, 'overallQASummary');
        if (value == null || isNaN(value)) {
          continue;
        }
        if (!yTypes.includes(elem.unit)) {
          yTypes.push(elem.unit);
        }
        const key = grabIndexValue(elem);
        if (!sensor[key]) {
          sensor[key] = [];
        }
        sensor[key]['sensorType'] = this.getSensorType(elem);
        sensor[key]['isSensor'] = elem.indexName === 'sensor_index';
        sensor[key]['isOfficial'] = elem.dataType === 'official';
        sensor[key].push({
          x: this.buildDateValue(obsDateTime, elem.elementID, qualifierType),
          y: value,
          unit: elem.unit || '',
          qa: formatQAValue(qa),
          ...(seriesType === SeriesType.BAR && {
            borderColor: 'white',
            groupPadding: 0.75,
            pointWidth: 10,
          }),
          ...(this.shouldAddQA(useQaColor, seriesType) && {
            color: this.getQAColor(qa),
            marker: {
              lineColor: 'black',
              lineWidth: 2,
            },
          }),
        });
      }
    }

    Object.values(sensor).forEach((s) => this.sortByX(s));
  }

  private shouldAddQA(useQaColor: boolean, seriesType: SeriesType): boolean {
    return useQaColor && seriesType !== SeriesType.BAR;
  }

  private sortByX = (s) => s.sort((a, b) => (a.x === b.x ? 0 : a.x < b.x ? -1 : 1));

  private parseElementValue(element, options: DataChartOptions, property: 'value' | 'overallQASummary') {
    const custom = options.customOptions;
    return !!custom && custom.showOriginalValue && element.hasOwnProperty('original')
      ? element.original[property]
      : element[property];
  }

  private grabElementsFromObs(obs: DMSObs, givenID: string, qualifierType: QualifierType): ObsElement[] {
    let ids = [];
    switch (qualifierType) {
      case QualifierType.NONE:
        ids = [givenID];
        break;
      case QualifierType.HOURLY:
        ids = this.qualifierHourlyValues.map((nodeValue) => updateNodeValue(givenID, nodeValue, 4));
        break;
    }

    return ids.map((id) => findAllElements(obs, id)).reduce((acc, val) => acc.concat(val), []);
  }

  private buildYAxes(chartObj: Chart, observations: DMSObs[]) {
    const elements: Element[] = chartObj.elements;
    const stations: Station[] = chartObj.stations;
    const names = [];
    const values = [];

    for (const station of stations) {
      for (const elem of elements) {
        for (const obs of observations.filter((ob) => this.isMatchingObs(ob, station))) {
          const foundElems = this.grabElementsFromObs(obs, elem.id, chartObj.qualifierType);
          foundElems.forEach((el) => this.unitService.setPreferredUnits(el));

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

  getSensorType(elem: ObsElement) {
    if (elem.dataType === 'official') {
      return this.translate.instant('OBS.OFFICIAL');
    } else if (elem.indexValue > 0) {
      return `${this.translate.instant(getIndexLabelTranslationKey(elem))} ${elem.indexValue}`;
    } else {
      return '';
    }
  }

  // get the chart type for an element
  getSeriesType(id: string): SeriesType {
    if (id === '1.17.253.0.0.0.0' || id === '1.17.438.0.0.0.0') {
      return SeriesType.AREA;
    } else if (id.split('.')[1] === '11') {
      return SeriesType.BAR;
    } else {
      return SeriesType.LINE;
    }
  }

  createStationLabel(obs: DMSObs, defaultLabel: string = ''): string {
    const shortID = findFirstValue(obs, TC_ID_ELEMENT) || findFirstValue(obs, ICAO_ID_ELEMENT);
    const stationObsLabel = [
      findFirstValue(obs, STATION_NAME_ELEMENT),
      findFirstValue(obs, CLIMATE_ID_ELEMENT),
      shortID,
    ]
      .filter((label) => !!label)
      .join(' - ');

    // Workaround for report-based pages. Re-use the label from their dropdown.
    return stationObsLabel || defaultLabel;
  }

  private buildNoDataString(chartObj) {
    const elems = chartObj.elements.map((elem) => `<li>${this.configService.buildFullNodeName(elem.id)}</li>`).join('');
    return `${this.instantSingle('CHART', 'NO_DATA')}: ${elems}`;
  }

  private instantSingle = (header, key) => this.translate.instant(`${header}.${key}`);
  private instantArray = (header, keys) => keys.map((key) => this.instantSingle(header, key));
}
