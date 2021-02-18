import { Injectable } from '@angular/core';
import { UserConfigService } from 'msc-dms-commons-angular/core/user-config';
import { Chart, Element, QualifierType, Station, SeriesOption } from '../model/chart.model';
import { DataChartService } from '../data-chart.service';
import { Subject } from 'rxjs';
@Injectable()
export class ChartFormService {
  public formattedStations: Station[] = [];
  public formattedElements: Element[] = [];
  public chosenStations: Station[] = [];
  public chosenElements: Element[] = [];
  public display: boolean = false;
  public showSeriesOptions: boolean = false;
  public edit: boolean = false;
  public editIndex: number;

  public uniqueStnNames = [];

  public chartRequested = new Subject();
  public chartEditRequested = new Subject();

  constructor(
    private userConfigService: UserConfigService,
    private chartService: DataChartService,
  ) {}

  setupChartForm(obs, elements) {}

  buildDefaultChart(stnId, elemId) {}

  getFormattedSeriesOption(id) {
    return new SeriesOption({
      seriesType: this.chartService.getSeriesType(id),
      useQaColor: false,
    });
  }

  createChartElements(elements) {
    this.formattedElements = elements
      .map(
        (elem) =>
          new Element({
            label: this.userConfigService.getFullFormattedHeader(elem),
            id: elem,
            qualifierType: QualifierType.None,
            seriesOption: this.getFormattedSeriesOption(elem),
          }),
      )
      .sort(this.labelSorter);
  }

  createStations(observations) {}

  updateElementSettings() {}

  updateEquivalencyWarnings() {}

  labelSorter = (a, b) => (a.label > b.label ? 1 : b.label > a.label ? -1 : 0);

  /* Creates a new chart form */
  createChartForm(elements) {
    this.createChartElements(elements);
    this.prefillDefaults();
    this.display = true;
    this.edit = false;
  }

  resetForm() {
    this.chosenStations = [];
    this.chosenElements = [];
  }

  clearAll() {
    this.resetForm();
    this.formattedStations = [];
    this.formattedElements = [];
    this.uniqueStnNames = [];
  }

  populateChartForm(observations) {
    this.clearAll();
    this.createStations(observations);
  }

  setupFormElements(elements) {
    this.createChartElements(elements);
  }

  clearNeighbourOptions() {}

  createNeighbourOptions(neighbours) {}

  getChosenSeries(): (Station | Element)[] {
    return this.chosenStations.length === 1 ? this.chosenElements : this.chosenStations;
  }

  createChart(chartObj: Chart) {
    this.edit ? this.chartEditRequested.next(chartObj) : this.chartRequested.next([chartObj]);
    this.display = false;
    this.chosenElements = [];
    this.showSeriesOptions = false;
    this.edit = false;
  }

  openPresetBox(options, elements) {
    this.createChartForm(elements);
    if (!!options.station) {
      this.chosenStations = this.findFormattedStations([options.station]);
    }
    if (!!options.element) {
      this.chosenElements = this.findFormattedElements([options.element]);
    }
    this.updateElementSettings();
  }

  openEditForm(chart: Chart, i: number, elements) {
    this.createChartElements(elements);
    this.edit = true;
    this.editIndex = i;
    this.chosenStations = this.findFormattedStations(chart.stations.map((stn) => stn.value));
    this.chosenElements = this.findFormattedElements(chart.elements.map((elem) => elem.id));
    this.updateElementSettings();
    this.showSeriesOptions = false;
    this.display = true;
  }

  createPredefinedCharts() {}

  isPredefinedType() {
    return false;
  }

  prefillDefaults() {
    this.chosenStations = this.formattedStations.length === 1 ? this.formattedStations : [];
    this.chosenElements = this.formattedElements.length === 1 ? this.formattedElements : [];
  }

  findFormattedStations(ids: string[]): Station[] {
    return this.formattedStations.filter((stn) => ids.includes(stn.value));
  }

  findFormattedElements(ids: string[]): Element[] {
    return this.formattedElements.filter((elem) => ids.includes(elem.id));
  }
}
