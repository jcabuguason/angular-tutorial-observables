import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { ChartOption } from './chart-option.enum';
import { ChartFormService } from './chart-form.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Chart, Element, SeriesType, Station, SeriesOption } from '../model/chart.model';
import { ChartFormConfig } from './model/chart-form-config.model';
@Component({
  selector: 'commons-chart-form',
  templateUrl: './chart-form.component.html',
  styleUrls: ['./chart-form.component.scss'],
  encapsulation: ViewEncapsulation.None, // Needed to apply disabled class for multi select
})
export class ChartFormComponent implements OnDestroy {
  @Input() configOptions: ChartFormConfig;

  private ngUnsubscribe = new Subject();
  selectedQa = false;

  neighbourElementWarning = false;
  baseStationWarning = false;

  illegibleWarning = false;
  displayBarQaWarning = false;
  seriesTypes = [
    { label: 'CHART.LINE', value: SeriesType.Line },
    { label: 'CHART.BAR', value: SeriesType.Bar },
    { label: 'CHART.AREA', value: SeriesType.Area },
  ];

  constructor(
    private messageService: MessageService,
    public chartFormService: ChartFormService,
    public translate: TranslateService,
  ) {}

  public get chartOption(): typeof ChartOption {
    return ChartOption;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  initializeOptions() {
    this.displayBarQaWarning = false;
    this.illegibleWarning = false;
    this.chartFormService.showSeriesOptions = false;

    if (this.configOptions.checkForEquivElem) {
      this.neighbourElementWarning = false;
      this.chartFormService.updateEquivalencyWarnings();
    } else {
      this.handleDropdownSelection(this.chartFormService.chosenElements, ChartOption.Element);
      this.handleDropdownSelection(this.chartFormService.chosenStations, ChartOption.Station);
    }

    this.checkWarnings();
  }

  submit() {
    if (this.hasEmptySelection()) {
      this.addMessage(this.translate.instant('CHART.UNFILLED_ERROR'));
    } else if (this.hasPassedSelectionLimit()) {
      this.addMessage(this.translate.instant('CHART.LIMIT_ERROR'));
    } else if (this.hasMultipleQualifierTypes()) {
      this.addMessage(this.translate.instant('CHART.MULTI_QUALIFIER_ERROR'));
    } else {
      const chosenQualifierType = this.chartFormService.chosenElements[0].qualifierType;
      this.chartFormService.createChart(
        new Chart({
          qualifierType: chosenQualifierType,
          stations: this.chartFormService.chosenStations,
          elements: this.chartFormService.chosenElements,
        }),
      );
    }
  }

  submitPredefined() {
    this.isSingleStationSelected()
      ? this.chartFormService.createPredefinedCharts()
      : this.addMessage(this.translate.instant('CHART.PREDEFINED_ERROR'));
  }

  reset() {
    this.clearElements();
    this.clearStations();
  }

  handleDropdownSelection(options: Element[] | Station[], type: ChartOption) {
    if (options.length === 0) {
      this.chartFormService.showSeriesOptions = false;
    }
    this.limitSelection(options, this.determineLimit(type));
    this.chartFormService.updateElementSettings();
    if (this.configOptions.checkForEquivElem) {
      this.chartFormService.updateEquivalencyWarnings();
    }
    this.checkWarnings();
  }

  clearStations() {
    this.chartFormService.chosenStations = [];
    this.handleDropdownSelection([], ChartOption.Station);
  }

  clearElements() {
    this.chartFormService.chosenElements = [];
    this.handleDropdownSelection([], ChartOption.Element);
  }

  /** If 1 station is selected (including base station), then multiple elements can be charted.
   * If more than 1 station is selected, only 1 element can be charted.
   * */
  determineLimit(type: ChartOption): number {
    const isStation = type === ChartOption.Station;
    const isOtherMulti = isStation
      ? this.chartFormService.chosenElements.length > 1
      : this.chartFormService.chosenStations.length > 1;

    const limit = isStation ? this.configOptions.maxStations : this.configOptions.maxElements;
    return isOtherMulti ? 1 : limit;
  }

  limitSelection(options: Element[] | Station[], limit: number) {
    if (options.length > limit) {
      options.pop();
    }
  }

  checkWarnings() {
    const selectedOptions: SeriesOption[] = this.chartFormService
      .getChosenSeries()
      .map((series: any) => series.seriesOption);

    this.displayBarQaWarning = selectedOptions.some(
      (option) => option.seriesType === SeriesType.Bar && !!option.useQaColor,
    );
    this.illegibleWarning = selectedOptions.filter((option) => option.useQaColor).length > 1;

    if (this.configOptions.hasNeighbours) {
      this.baseStationWarning = !this.chartFormService.chosenStations.some((stn) => stn.stationInfo.isBase);
      this.neighbourElementWarning = this.chartFormService.chosenStations.some((stn) => stn.stationInfo.elementWarning);
    }
  }

  hasWarnings(): boolean {
    return (
      this.illegibleWarning ||
      this.displayBarQaWarning ||
      (this.configOptions.hasNeighbours && (this.baseStationWarning || this.neighbourElementWarning))
    );
  }

  isSingleStationSelected(): boolean {
    return this.chartFormService.chosenStations.length === 1;
  }

  hasEmptySelection(): boolean {
    return this.chartFormService.chosenStations.length === 0 || this.chartFormService.chosenElements.length === 0;
  }

  hasPassedSelectionLimit(): boolean {
    return this.chartFormService.chosenStations.length > 1 && this.chartFormService.chosenElements.length > 1;
  }

  hasMultipleQualifierTypes(): boolean {
    return this.chartFormService.chosenElements.some((elem, index, arr) => elem.qualifierType !== arr[0].qualifierType);
  }

  canBuildPredefinedCharts(): boolean {
    return this.configOptions.hasPredefinedCharts
      ? this.isSingleStationSelected() && !this.chartFormService.edit && this.chartFormService.isPredefinedType()
      : false;
  }

  determineDropdownClass(type: ChartOption): string {
    const selections =
      type === ChartOption.Station ? this.chartFormService.chosenStations : this.chartFormService.chosenElements;
    return selections.length >= this.determineLimit(type) ? 'disabled' : '';
  }

  styleElementDropdown = (type) => ({ hourly: type === 1 });

  private addMessage(message: string) {
    this.messageService.add({ key: 'chart-form-messages', severity: 'error', summary: message });
  }

  private isDropdownSelected(type: ChartOption): boolean {
    const mainLength = (type === ChartOption.Station
      ? this.chartFormService.chosenElements
      : this.chartFormService.chosenStations
    ).length;
    const otherLength = (type === ChartOption.Station
      ? this.chartFormService.chosenStations
      : this.chartFormService.chosenElements
    ).length;

    return mainLength > 1 && otherLength !== 0;
  }
}
