import { Injectable, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { addHours, subHours } from 'date-fns';

import { SearchParameter, ParameterName, ParameterType } from './parameters/search-parameter';
import { SearchQueryType } from './parameters/search-query-type';
import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { SearchTaxonomy } from './search-taxonomy';

import { SearchModel, SearchElement, SearchableElement } from './model/search.model';
import { ShortcutModel } from './model/shortcut.model';

import { SEARCH_BOX_CONFIG, SearchBoxConfig } from './search-box.config';

import { SearchURLService } from './search-url.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { Subject } from 'rxjs';

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
    private urlService: SearchURLService
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

    this.shortcuts = this.config.shortcuts;
    this.createShortcutButtons();

    this.hoursRangeParams = this.availableParams.filter(
      p => p.getName() === ParameterName.HOURS_RANGE || p.getName() === ParameterName.HOURS_RANGE_DATETIME
    );
    this.dateRangeParams = this.availableParams.filter(
      p => p.getName() === ParameterName.FROM || p.getName() === ParameterName.TO
    );
    this.useDateAndHoursRange = !!this.hoursRangeParams.length && !!this.dateRangeParams.length;
    this.setSelectedRangeType('hoursRange');

    this.searchConfigUpdated.next(config);
  }

  /** Executes parameters for a search request */
  executeSearch(qParams) {
    this.displayForm = false;
    this.addRequestParams(qParams);
    this.submitSearch(false);
  }

  /** Re-directs to url with search parameters */
  updateUrl(clearUrl = false) {
    const urlParams: Params = {};
    if (!clearUrl) {
      this.urlService
        .createUrlParams(this.displayParams, this.shortcutSelected)
        .forEach(param =>
          urlParams.hasOwnProperty(param.name)
            ? urlParams[param.name].push(param.value)
            : (urlParams[param.name] = [param.value])
        );
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: urlParams,
    });
  }

  /** Add and display parameter with value if it exists */
  addSuggestedParameter(parameter: SearchParameter, values?: any[]) {
    if (this.displayParams.indexOf(parameter) === -1) {
      this.displayParams.push(parameter);
      this.updateSuggestedParameters();
    }

    if (values != null) {
      values
        .filter(val => val != null && val !== '')
        .forEach(val => {
          if (parameter.getName() === ParameterName.SIZE) {
            val = this.fixNumObs(val).toString();
          }
          parameter.addSelected(val);
        });
    }
  }

  /** Add and display parameter (by name) with value if it exists */
  addParameterByName(name: string, values?: any[]) {
    const parameter = this.availableParams.find(p => p.getName() === name);
    if (parameter != null) {
      this.addSuggestedParameter(parameter, values);
    }
  }

  /** Suggest parameters that are not already selected */
  updateSuggestedParameters() {
    this.suggestedParams = this.availableParams.filter(p => this.displayParams.indexOf(p) === -1);
  }

  removeDisplayParameter(displayParam: SearchParameter) {
    const index = this.displayParams.indexOf(displayParam);
    if (this.displayParams[index] != null) {
      this.displayParams[index].removeAllSelected();
      this.displayParams.splice(index, 1);
      this.updateSuggestedParameters();
    }
  }

  removeAllDisplayParameters() {
    this.displayParams.forEach(p => p.removeAllSelected());
    this.displayParams = [];
    this.updateSuggestedParameters();
  }

  /** Emits the search model used for ES and updates the url */
  submitSearch(updateUrlParams: boolean = true, shortcut?: ShortcutModel) {
    this.shortcutSelected = shortcut;

    if (this.hasValidParameters()) {
      const model = this.getSearchModel();
      if (updateUrlParams) {
        this.updateUrl();
      }
      this.searchRequested.next(model);
      this.displayForm = false;
    }
  }

  /** Gets the search model used for ES and updates any values outside of its limits (ex. size and hours range) */
  getSearchModel(): SearchModel {
    let model = new SearchModel([], []);

    const elements: SearchElement[] = [];
    let startDate: Date;
    let endDate: Date;
    let numObs: number = this.defaultNumObs;
    let operator: string;
    let hoursRangeDate: Date;

    const addToElements = (elementID, value) =>
      elements.push(new SearchElement(elementID, 'metadataElements', 'value', value));

    this.displayParams.forEach(p => {
      const selected = p.getSelectedModels().map(model => model.value);
      const addStationToElements = (station, stdPkgId = null) => {
        const adjusted = this.adjustWildcard(station);
        const id = stdPkgId || this.determineStdPkgId(adjusted);
        addToElements(id, adjusted);
      };
      const updateValue = (value, index, newValue) => {
        if (newValue !== value) {
          p.setSelectedAt(index, newValue);
        }
      };

      switch (p.getName()) {
        case ParameterName.STATION_ID:
          selected.forEach((value, index) => {
            const stationID = value.replace(/\s+/g, '');
            updateValue(value, index, stationID);
            addStationToElements(stationID);
          });
          operator = 'AND';
          break;
        case ParameterName.STATION_NAME:
          selected.forEach(value => addStationToElements(value, SearchableElement.STATION_NAME.id));
          operator = 'AND';
          break;
        case ParameterName.PROVINCE:
          selected.forEach(s => addToElements(SearchableElement.PROVINCE.id, s));
          operator = 'AND';
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

    if (this.selectedRangeType.value === 'hoursRange' && hoursRangeDate != null) {
      const hoursRange = this.hoursRangeParams.find(p => p.getName() === ParameterName.HOURS_RANGE) as SearchHoursRange;
      if (hoursRange != null) {
        startDate = subHours(hoursRangeDate, hoursRange.hoursBefore);
        endDate = addHours(hoursRangeDate, hoursRange.hoursAfter);
      }
    }
    model = new SearchModel(this.determineTaxonomies(), elements, startDate, endDate, numObs, operator);
    return model;
  }

  findMissingRequiredParameters(): SearchParameter[] {
    return this.availableParams.filter(p => p.isRequired()).filter(p => this.displayParams.indexOf(p) === -1);
  }

  openForm() {
    if (this.readOnlyBar) {
      this.resetForm();
      this.displayParams.forEach(p => p.populateFormValues());
      this.displayForm = true;
    }
  }

  resetForm() {
    this.availableParams.forEach(p => p.removeAllFormValues());
  }

  submitSearchForm() {
    this.removeAllDisplayParameters();
    this.availableParams.forEach(p => {
      p.applyFormValues();
      if (!p.isUnfilledForm()) {
        this.addSuggestedParameter(p);
      }
    });
    this.submitSearch();
  }

  setSelectedRangeType(type: 'dateRange' | 'hoursRange') {
    this.selectedRangeType = type === 'hoursRange' ? this.rangeTypes[0] : this.rangeTypes[1];
    this.formRangeParams = type === 'hoursRange' ? this.hoursRangeParams : this.dateRangeParams;
  }

  onParameterValueChange(parameter: SearchParameter, newValue: any) { }

  /** Determines the std-pkg-id depending on the station entered (defaults to MSC_ID) */
  private determineStdPkgId(stationID: string) {
    const stationType = SearchableElement.STATION_TYPE;
    const defaultID = stationType.MSC_ID.id;

    const result = Object.keys(stationType).find(key => stationID.match(stationType[key].regex) != null);

    return result != null ? stationType[result].id : defaultID;
  }

  /** Ensures station id/name is formatted as `.*` if `*` is found */
  private adjustWildcard(station: string) {
    return station.replace(/[.]?[*]/g, '.*');
  }

  /** Find added parameters but are not filled in */
  findEmptyDisplayParameters(): SearchParameter[] {
    this.displayParams.forEach(p => p.removeInvalidValues());
    return this.displayParams.filter(p => p.isUnfilled());
  }

  /** Determines if all the search parameters are empty */
  private isEmptySearch() {
    return this.availableParams.every(param => param.isUnfilled());
  }

  /** Checks for any missing parameters and displays a message */
  hasValidParameters(): boolean {
    if (this.useDateAndHoursRange) {
      const removeParams = this.selectedRangeType.value === 'dateRange' ? this.hoursRangeParams : this.dateRangeParams;
      removeParams.forEach(p => this.removeDisplayParameter(p));
    }

    const emptyParams = this.findEmptyDisplayParameters().map(p => p.getDisplayName());
    const missingParams = this.findMissingRequiredParameters().map(p => p.getDisplayName());
    const queryParams = this.availableParams.filter(
      param => param.getType() === ParameterType.SEARCH_QUERY_TYPE && !param.isUnfilled()
    ) as SearchQueryType[];
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
    } else if (queryParams.length > 0) {
      for (let param of queryParams) {
        if (!param.hasFilledRequirements()) {
          this.messageService.add({
            key: 'search-messages',
            summary: 'SEARCH_BAR.QUERY_MISSING',
            data: param.requiredParams.map(p => p.getDisplayName()),
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

  private determineTaxonomies() {
    const taxParameters = this.displayParams.filter(p => this.isTaxonomyParam(p) && p.getSelectedModels().length);

    if (!taxParameters.length) {
      return this.taxonomies.map(current => current.taxonomy);
    }

    const matchingChoice = (choices, code) => choices.some(choice => choice.uri.toLowerCase() === code.toLowerCase());

    const getAllSelected = name =>
      taxParameters
        .filter(p => p.getName() === ParameterName.forTaxonomy[name])
        .map(p => p.getSelectedModels())
        .reduce((allSelected, selected) => allSelected.concat(selected), []);

    const organizations = getAllSelected('ORGANIZATION');
    const networks = getAllSelected('NETWORK');

    return this.taxonomies
      .filter(tax => organizations.length === 0 || matchingChoice(organizations, tax['organizationCode']))
      .filter(tax => networks.length === 0 || matchingChoice(networks, tax['networkCode']))
      .map(current => current.taxonomy);
  }

  /** Parameters used to determine taxonomy */
  private isTaxonomyParam(param: SearchParameter): boolean {
    return Object.keys(ParameterName.forTaxonomy).some(name => ParameterName.forTaxonomy[name] === param.getName());
  }

  /** Populate search box with information from specific URL parameters */
  private addRequestParams(qParams) {
    const matchingName = (param: SearchParameter, name: string) => param.getName() === name;
    const allRequestParams = this.urlService.getAllRequestParams(qParams, this.availableParams, this.shortcuts);
    const useHoursRange = allRequestParams.some(obj => matchingName(obj.param, ParameterName.HOURS_RANGE_DATETIME));
    const paramsFilter = param =>
      useHoursRange
        ? !matchingName(param, ParameterName.FROM) && !matchingName(param, ParameterName.TO)
        : !matchingName(param, ParameterName.HOURS_RANGE) && !matchingName(param, ParameterName.HOURS_RANGE_DATETIME);

    allRequestParams
      .filter(obj => paramsFilter(obj.param))
      .forEach(obj => this.addSuggestedParameter(obj.param, obj.value));

    if (useHoursRange && this.displayParams.find(p => p.getName() === ParameterName.HOURS_RANGE) == null) {
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
          shortcut.addParameters.forEach(p => this.addParameterByName(p.name, p.values));
          this.submitSearch(true, shortcut);
        },
      });
      this.shortcutButtons = this.shortcuts.map(createButton);
    }
  }
}
