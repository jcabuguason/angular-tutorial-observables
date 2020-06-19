import { Injectable, Inject } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ESOperator } from 'msc-dms-commons-angular/core/elastic-search';

import { ParameterName } from './enums/parameter-name.enum';
import { ParameterType } from './enums/parameter-type.enum';
import { SearchParameter } from './parameters/search-parameter';
import { SearchCheckbox } from './parameters/search-checkbox';
import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { SearchTaxonomy } from './search-taxonomy';

import { SearchModel, SearchableElement } from './model/search.model';
import { ShortcutModel } from './model/shortcut.model';

import { SEARCH_BOX_CONFIG, SearchBoxConfig } from './search-box.config';

import { SearchURLService } from './search-url.service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { subtractHours, addHours, isTimeBefore } from 'msc-dms-commons-angular/shared/util';

@Injectable()
export class SearchService {
  // all taxonomies
  taxonomies: SearchTaxonomy[] = [];
  // available search parameters to choose from
  availableParams: SearchParameter[] = [];
  // displayed or selected parameters
  displayParams: SearchParameter[] = [];
  // displayed parameters in custom form
  formParams: SearchParameter[] = [];
  // suggestions that show up
  suggestedParams: SearchParameter[] = [];
  // Serves as the announcer of new search requests
  searchRequested = new Subject<SearchModel>();
  searchConfigUpdated = new Subject<SearchBoxConfig>();
  // Maximum number of obs to return for a taxonomy
  maxNumObs = 1500;
  defaultNumObs = 300;

  displayForm = false;
  readOnlyBar: boolean;
  resetBarButton: boolean;

  shortcuts: ShortcutModel[] = [];
  shortcutSelected: ShortcutModel;
  shortcutButtons = [];

  formRangeParams: SearchParameter[] = [];
  hoursRangeParams: SearchParameter[] = [];
  dateRangeParams: SearchParameter[] = [];

  useDateAndHoursRange = false;
  selectedRangeType;
  rangeTypes = [
    { label: 'SEARCH_BAR.RELATIVE_DATE_PICKER_LABEL', value: 'hoursRange' },
    { label: 'SEARCH_BAR.ASOLUTE_DATE_PICKER_LABEL', value: 'dateRange' },
  ];

  constructor(
    @Inject(SEARCH_BOX_CONFIG)
    public config: SearchBoxConfig,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private urlService: SearchURLService,
  ) {
    this.updateConfig(config);
  }

  updateConfig(config: SearchBoxConfig) {
    this.removeAllDisplayParameters();

    this.config = config;
    this.taxonomies = this.config.taxonomies;
    this.availableParams = this.config.searchList;
    this.suggestedParams = this.availableParams;

    this.readOnlyBar = this.config.readOnlyBar;
    this.resetBarButton = this.config.resetBarButton;

    this.shortcuts = this.config.shortcuts;
    this.createShortcutButtons();

    this.hoursRangeParams = this.availableParams.filter(
      (p) => p.getName() === ParameterName.HOURS_RANGE || p.getName() === ParameterName.HOURS_RANGE_DATETIME,
    );
    this.dateRangeParams = this.availableParams.filter(
      (p) => p.getName() === ParameterName.FROM || p.getName() === ParameterName.TO,
    );
    this.useDateAndHoursRange = !!this.hoursRangeParams.length && !!this.dateRangeParams.length;
    this.setSelectedRangeType('hoursRange');

    this.addDefaultParameters();

    this.searchConfigUpdated.next(config);
  }

  /** Runs search using URL query parameters */
  searchByURLParameters(queryParams) {
    this.displayForm = false;
    this.addRequestParams(queryParams);
    this.submitSearch(false);
  }

  /** Re-directs to url with search parameters */
  updateUrl(clearUrl = false) {
    const urlParams: Params = clearUrl ? {} : this.buildUrlParameters();
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: urlParams,
    });
  }

  buildUrlParameters(): Params {
    const urlParams: Params = {};
    for (const param of this.urlService.createUrlParams(this.displayParams, this.shortcutSelected)) {
      urlParams.hasOwnProperty(param.name)
        ? urlParams[param.name].push(param.value)
        : (urlParams[param.name] = [param.value]);
    }
    return urlParams;
  }

  /** Add and display parameter with value if it exists */
  addSuggestedParameter(parameter: SearchParameter, values?: any[]) {
    if (!this.displayParams.includes(parameter)) {
      this.displayParams.push(parameter);
      this.updateSuggestedParameters();
    }

    if (values != null) {
      values
        .filter((val) => val != null && val !== '')
        .forEach((val) => {
          if (parameter.getName() === ParameterName.SIZE) {
            val = this.fixNumObs(val).toString();
          }
          parameter.addSelected(val);
        });
    }
  }

  /** Add and display parameter (by name) with value if it exists */
  addParameterByName(name: string, values?: any[]) {
    const parameter = this.availableParams.find((p) => p.getName() === name);
    if (parameter != null) {
      this.addSuggestedParameter(parameter, values);
    }
  }

  /** Add default parameters and values */
  addDefaultParameters() {
    // empty, but allow apps to overwrite this
  }

  /** Suggest parameters that are not already selected */
  updateSuggestedParameters() {
    this.suggestedParams = this.availableParams.filter((p) => !this.displayParams.includes(p));
  }

  removeDisplayParameter(displayParam: SearchParameter) {
    const index = this.displayParams.indexOf(displayParam);
    if (this.displayParams[index] != null) {
      this.displayParams[index].resetAllSelected(true);
      this.displayParams.splice(index, 1);
      this.updateSuggestedParameters();
    }
  }

  removeAllDisplayParameters() {
    this.displayParams.forEach((p) => p.resetAllSelected(true));
    this.displayParams = [];
    this.updateSuggestedParameters();
  }

  resetSearch() {
    this.removeAllDisplayParameters();
    this.addDefaultParameters();
  }

  /** Emits the search model used for ES and updates the url */
  submitSearch(updateUrlParams: boolean = true, shortcut?: ShortcutModel) {
    this.shortcutSelected = shortcut;

    if (this.hasValidParameters()) {
      const datesChanged = this.adjustDates();
      const model = this.buildSearchModel();
      if (updateUrlParams || datesChanged) {
        this.updateUrl();
      }
      this.searchRequested.next(model);
      this.displayForm = false;
    }
  }

  /** Gets the search model used for ES and updates any values outside of its limits (ex. size and hours range) */
  buildSearchModel(): SearchModel {
    const queryChunks = {
      station: {
        operator: ESOperator.Or,
        elements: [],
      },
      province: {
        operator: ESOperator.Or,
        elements: [],
      },
    };
    let startDate: Date;
    let endDate: Date;
    let numObs: number = this.defaultNumObs;
    let hoursRangeDate: Date;

    this.displayParams.forEach((p) => {
      const selected = p.getSelectedModels().map((model) => model.value);
      const updateValue = (value, index, newValue) => {
        if (newValue !== value) {
          p.setSelectedAt(index, newValue);
        }
      };

      switch (p.getName()) {
        case ParameterName.STATION_ID:
          queryChunks.station.elements.push(
            ...selected.map((value) => ({
              elementID: this.determineStationElementID(value.replace(/\s+/g, '')),
              value: value,
              isCaseless: isNaN(value),
            })),
          );
          break;
        case ParameterName.STATION_NAME:
          queryChunks.station.elements.push(
            ...selected.map((value) => ({
              elementID: SearchableElement.STATION_NAME.id,
              value: value,
              isCaseless: isNaN(value),
            })),
          );
          break;
        case ParameterName.PROVINCE:
          queryChunks.province.elements.push(
            ...selected.map((value) => ({
              elementID: SearchableElement.PROVINCE.id,
              value: value,
            })),
          );
          break;
        case ParameterName.SIZE:
          selected.forEach((s, index) => {
            numObs = this.fixNumObs(s);
            updateValue(s, index, String(numObs));
          });
          break;
        case ParameterName.FROM:
          startDate = (p as SearchDatetime).getFullDatetime();
          break;
        case ParameterName.TO:
          endDate = (p as SearchDatetime).getFullDatetime();
          break;
        case ParameterName.HOURS_RANGE_DATETIME:
          hoursRangeDate = (p as SearchDatetime).getFullDatetime();
          break;
      }
    });

    if (this.selectedRangeType === 'hoursRange' && hoursRangeDate != null) {
      const hoursRange = this.hoursRangeParams.find(
        (p) => p.getName() === ParameterName.HOURS_RANGE,
      ) as SearchHoursRange;
      if (hoursRange != null) {
        startDate = subtractHours(hoursRangeDate, hoursRange.hoursBefore);
        endDate = addHours(hoursRangeDate, hoursRange.hoursAfter);
      }
    }
    return {
      taxonomy: this.determineTaxonomies(),
      from: startDate,
      to: endDate,
      size: numObs,
      query: Object.values(queryChunks).filter((chunk) => chunk.elements.length > 0),
      httpParams: new HttpParams({ fromObject: this.buildUrlParameters() }),
    };
  }

  findMissingRequiredParameters(): SearchParameter[] {
    return this.availableParams.filter((p) => p.isRequired()).filter((p) => !this.displayParams.includes(p));
  }

  openForm() {
    if (this.readOnlyBar) {
      this.resetForm();
      this.displayParams.forEach((p) => p.populateFormValues());
      this.displayForm = true;
    }
  }

  resetForm() {
    this.availableParams.forEach((p) => p.resetAllFormValues(true));
  }

  submitSearchForm() {
    this.removeAllDisplayParameters();
    this.availableParams.forEach((p) => {
      p.applyFormValues();
      if (!p.isUnfilledForm()) {
        this.addSuggestedParameter(p);
      }
    });
    this.submitSearch();
  }

  setSelectedRangeType(type: 'dateRange' | 'hoursRange') {
    this.selectedRangeType = type === 'hoursRange' ? this.rangeTypes[0].value : this.rangeTypes[1].value;
    this.formRangeParams = type === 'hoursRange' ? this.hoursRangeParams : this.dateRangeParams;
  }

  onParameterValueChange(parameter: SearchParameter, newValue: any) {}

  /** Determines the element ID depending on the station entered (defaults to MSC_ID) */
  determineStationElementID(stationID: string): string {
    const stationType = SearchableElement.STATION_TYPE;
    const defaultID = stationType.MSC_ID.id;

    const result = Object.keys(stationType).find((key) => stationID.match(stationType[key].regex) != null);

    return result != null ? stationType[result].id : defaultID;
  }

  /** Find added parameters but are not filled in */
  findEmptyDisplayParameters(): SearchParameter[] {
    this.displayParams.forEach((p) => p.removeInvalidValues());
    return this.displayParams.filter((p) => p.isUnfilled());
  }

  /** Determines if all the search parameters are empty */
  private isEmptySearch() {
    return this.availableParams.every((param) => param.isUnfilled());
  }

  /** Checks for any missing parameters and displays a message */
  hasValidParameters(): boolean {
    if (this.useDateAndHoursRange) {
      const removeParams = this.selectedRangeType === 'dateRange' ? this.hoursRangeParams : this.dateRangeParams;
      removeParams.forEach((p) => this.removeDisplayParameter(p));
    }

    const emptyParams = this.findEmptyDisplayParameters().map((p) => p.getDisplayName());
    const missingParams = this.findMissingRequiredParameters().map((p) => p.getDisplayName());
    const checkboxes = this.availableParams.filter(
      (param) => param.getType() === ParameterType.SEARCH_CHECKBOX && !param.isUnfilled(),
    ) as SearchCheckbox[];
    let valid = true;

    this.messageService.clear();

    if (missingParams.length > 0) {
      this.messageService.add({
        key: 'search-messages',
        summary: 'SEARCH_BAR.MISSING_REQUIRED',
        data: missingParams,
        sticky: true,
      });
      valid = false;
    } else if (checkboxes.length > 0) {
      for (const checkbox of checkboxes) {
        if (!checkbox.hasFilledRequirements()) {
          this.messageService.add({
            key: 'search-messages',
            summary: 'SEARCH_BAR.QUERY_MISSING',
            data: checkbox.requiredParams.map((box) => box.getDisplayName()),
            sticky: true,
          });
          valid = false;
        }
      }
    } else if (emptyParams.length > 0) {
      this.messageService.add({
        key: 'search-messages',
        summary: 'SEARCH_BAR.UNFILLED_FIELD',
        data: emptyParams,
        sticky: true,
      });
      valid = false;
    } else if (this.isEmptySearch()) {
      this.messageService.add({
        key: 'search-messages',
        summary: 'SEARCH_BAR.NO_PARAMS',
        sticky: true,
      });
      valid = false;
    }

    return valid;
  }

  private adjustDates(): boolean {
    const findFilledDate = (name: ParameterName.FROM | ParameterName.TO): SearchDatetime =>
      this.availableParams.find((param) => param.getName() === name && !param.isUnfilled()) as SearchDatetime;

    const fromDate = findFilledDate(ParameterName.FROM);
    const toDate = findFilledDate(ParameterName.TO);

    const shouldAdjust = !!fromDate && !!toDate && isTimeBefore(toDate.getFullDatetime(), fromDate.getFullDatetime());
    if (shouldAdjust) {
      const temp = fromDate.getFullDatetime();
      fromDate.setFullDatetime(toDate.getFullDatetime());
      toDate.setFullDatetime(temp);
    }

    return shouldAdjust;
  }

  determineTaxonomies(): string[] {
    const taxParameters = this.displayParams.filter((p) => this.isTaxonomyParam(p) && p.getSelectedModels().length);

    if (!taxParameters.length) {
      return this.taxonomies.map((current) => current.taxonomy);
    }

    const matchingChoice = (choices, code) => choices.some((choice) => choice.uri.toLowerCase() === code.toLowerCase());

    const getAllSelected = (name) =>
      taxParameters
        .filter((p) => p.getName() === name)
        .map((p) => p.getSelectedModels())
        .reduce((allSelected, selected) => allSelected.concat(selected), []);

    const organizations = getAllSelected(ParameterName.ORGANIZATION);
    const networks = getAllSelected(ParameterName.NETWORK);

    return this.taxonomies
      .filter((tax) => organizations.length === 0 || matchingChoice(organizations, tax['organizationCode']))
      .filter((tax) => networks.length === 0 || matchingChoice(networks, tax['networkCode']))
      .map((current) => current.taxonomy);
  }

  /** Parameters used to determine taxonomy */
  private isTaxonomyParam(param: SearchParameter): boolean {
    return param.getName() === ParameterName.NETWORK || param.getName() === ParameterName.ORGANIZATION;
  }

  /** Populate search box with information from specific URL parameters */
  private addRequestParams(qParams) {
    const matchingName = (param: SearchParameter, name: string) => param.getName() === name;
    const allRequestParams = this.urlService.getAllRequestParams(qParams, this.availableParams, this.shortcuts);
    const useHoursRange = allRequestParams.some((obj) => matchingName(obj.param, ParameterName.HOURS_RANGE_DATETIME));
    const paramsFilter = (param) =>
      useHoursRange
        ? !matchingName(param, ParameterName.FROM) && !matchingName(param, ParameterName.TO)
        : !matchingName(param, ParameterName.HOURS_RANGE) && !matchingName(param, ParameterName.HOURS_RANGE_DATETIME);

    allRequestParams
      .filter((obj) => paramsFilter(obj.param))
      .forEach((obj) => this.addSuggestedParameter(obj.param, obj.value));

    if (useHoursRange && this.displayParams.find((p) => p.getName() === ParameterName.HOURS_RANGE) == null) {
      this.addParameterByName(ParameterName.HOURS_RANGE);
    }

    this.setSelectedRangeType(useHoursRange ? 'hoursRange' : 'dateRange');
  }

  /** Limits the number of observations to return from ES */
  private fixNumObs(value) {
    return this.fixValue(value, 0, this.maxNumObs, this.defaultNumObs);
  }

  private fixValue(input: any, min: number, max: number, defaultNum: number = 0): number {
    input = isNaN(input) ? defaultNum : input;
    if (max <= input) {
      return max;
    } else if (input <= min) {
      return min;
    }
    return input;
  }

  /** This is currently not used by the webapps */
  private createShortcutButtons() {
    if (this.shortcuts != null) {
      const createButton = (shortcut: ShortcutModel) => ({
        label: shortcut.label,
        command: () => {
          this.removeAllDisplayParameters();
          shortcut.addParameters.forEach((p) => this.addParameterByName(p.name, p.values));
          this.submitSearch(true, shortcut);
        },
      });
      this.shortcutButtons = this.shortcuts.map(createButton);
    }
  }
}
