import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

import { addHours, subHours } from 'date-fns';

import { SearchParameter, ParameterName } from './parameters/search-parameter';
import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { SearchTaxonomy } from './search-taxonomy';

import { SearchModel, SearchElement, SearchableElement } from './model/search.model';
import { ShortcutModel } from './model/shortcut.model';

import { SEARCH_BOX_CONFIG, SearchBoxConfig } from './search-box.config';

import { SearchURLService } from './search-url.service';
import { MessageService } from 'primeng/components/common/messageservice';

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

  searchRequested = new EventEmitter();

  // Maximum number of obs to return for a taxonomy
  maxNumObs = 1500;
  defaultNumObs = 300;

  addParamsOnBar: boolean;
  useForm: boolean;
  displayForm = false;

  shortcuts: ShortcutModel[] = [];
  shortcutSelected: ShortcutModel;
  shortcutButtons = [];

  popupMessage = [];
  details;

  messageSummaries = {
    'missingRequired': 'Missing required search fields:',
    'unfilledField': 'Fields added but do not have a value or correct format (note: Invalid values could have been automatically removed):',
  };


  constructor(
    @Inject(SEARCH_BOX_CONFIG)
    public config: SearchBoxConfig,
    public location: Location,
    private messageService: MessageService,
    private urlService: SearchURLService,
  ) {
    this.taxonomies = this.config.taxonomies;
    this.availableParams = this.config.searchList;
    this.suggestedParams = this.availableParams;

    this.addParamsOnBar = this.config.addParamsOnBar;
    this.useForm = this.config.useForm;

    this.shortcuts = this.config.shortcuts;
    this.createShortcutButtons();
  }

  clearMessages() {
    this.popupMessage = [];
  }

  /** Executes parameters for a search request */
  executeSearch(qParams) {
    this.displayForm = false;
    this.addRequestParams(qParams);
    this.submitSearch(false);
  }

  /** Re-directs to url with search parameters */
  updateUrl(clearUrl = false) {
    if (clearUrl) {
      this.location.go('/');
    } else {
      const urlParams = new URLSearchParams();
      this.urlService.createUrlParams(this.displayParams, this.shortcutSelected)
        .forEach(p => urlParams.append(p.name, p.value));
      this.location.go('/?' + urlParams.toString().replace(/\+/gi, ' '));
    }
  }

  /** Add and display parameter with value if it exists */
  addSuggestedParameter(parameter: SearchParameter, values?: any[]) {
    if (this.displayParams.indexOf(parameter) === -1) {
      this.displayParams.push(parameter);
      this.updateSuggestedParameters();
    }

    if (values != null) {
      values.filter(val => val != null && val !== '')
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
    const model = this.getSearchModel();

    if (updateUrlParams) {
      this.updateUrl();
    }
    this.searchRequested.emit(model);
    this.displayForm = false;
  }

  /** Gets the search model used for ES and updates any values outside of its limits (ex. size and hours range) */
  getSearchModel(): SearchModel {
    let model = new SearchModel([], []);

    if (this.hasValidParameters()) {
      const elements: SearchElement[] = [];
      let startDate: Date;
      let endDate: Date;
      let numObs: number = this.defaultNumObs;
      let operator: string;

      const taxonomies = this.determineTaxonomies().map(val => val.getTaxonomy());

      const addToElements = (elementID, value) => elements.push(
        new SearchElement(elementID, 'metadataElements', 'value', value)
      );

      this.displayParams.forEach(p => {
        const selected = p.getSelected();
        const addStationToElements = (station, stdPkgId = null) => {
          const adjusted = this.adjustWildcard(station);
          const id = stdPkgId || this.determineStdPkgId(adjusted);
          addToElements(id, adjusted);
        };
        const updateValue = (value, index, newValue) => {
          if (newValue !== value) { p.setSelectedAt(index, newValue); }
        };

        switch (p.getName()) {
          case ParameterName.STATION_ID:
            selected.forEach((value, index) => {
              const stationID = value.toUpperCase().replace(/\s+/g, '');
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
        }
      });

      // apps currently do not use both endDate and hoursRange
      // Pegasus uses: start date and end date
      // Midas uses: a date and hours range
      // TODO: need to handle it if both features are combined (maybe with toggle to switch on/off which pair of params to use)
      const hoursParam = this.availableParams.find(p => p.getName() === ParameterName.HOURS_RANGE && !p.isUnfilled());
      if (startDate != null && hoursParam != null) {
        const range = hoursParam as SearchHoursRange;
        const date = startDate;
        range.limitRange();
        startDate = subHours(date, range.hoursBefore);
        endDate = addHours(date, range.hoursAfter);
      }

      model = new SearchModel(taxonomies, elements, startDate, endDate, numObs, operator);
    }
    return model;
  }

  findMissingRequiredParameters(): SearchParameter[] {
    return this.availableParams.filter(p => p.isRequired())
      .filter(p => this.displayParams.indexOf(p) === -1);
  }

  openForm() {
    this.resetForm();
    this.displayParams.forEach(p => p.populateFormValues());
    this.displayForm = true;
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

  /** Determines the std-pkg-id depending on the station entered (defaults to MSC_ID) */
  private determineStdPkgId(stationID: string) {
    const stationType = SearchableElement.STATION_TYPE;
    const defaultID = stationType.MSC_ID.id;

    const result = Object.keys(stationType)
      .find(key => stationID.match(stationType[key].regex) != null);

    return result != null ? stationType[result].id : defaultID;
  }

  /** Ensures station id/name is formatted as `.*` if `*` is found */
  private adjustWildcard(station: string) {
    return station.replace(/[.]?[*]/g, '.*');
  }

  /** Find added parameters but are not filled in */
  private findEmptyDisplayParameters(): SearchParameter[] {
    this.displayParams.forEach(p => p.removeInvalidValues());
    return this.displayParams.filter(p => p.isUnfilled());
  }

  /** Checks for any missing parameters and displays a message */
  private hasValidParameters(): boolean {
    const empty = this.findEmptyDisplayParameters().map(p => p.getDisplayName());
    const missing = this.findMissingRequiredParameters().map(p => p.getDisplayName());

    let valid = true;

    this.messageService.clear();
    this.popupMessage = [];

    if (empty.length > 0) {
      this.popupMessage.push(this.messageSummaries.unfilledField);
      this.messageService.add({ summary: this.messageSummaries['unfilledField'], data: empty, sticky: true });
      valid = false;
    }
    if (missing.length > 0) {
      this.popupMessage.push(this.messageSummaries.missingRequired);
      this.messageService.add({ summary: this.messageSummaries['missingRequired'], data: missing, sticky: true });
      valid = false;
    }
    return valid;
  }

  /** Gets the taxonomies based on words that are associated with it */
  private determineTaxonomies(): SearchTaxonomy[] {
    let taxResult: SearchTaxonomy[] = this.taxonomies;
    let temp: SearchTaxonomy[] = [];

    this.displayParams.filter(p => this.isTaxonomyParam(p) && p.getSelectedModels().length)
      .forEach(p => {
        // if searching two values that belong to the same category, it would return the combined result
        temp = [];
        p.getSelectedModels().forEach(val => {
          const filtered = taxResult.filter(t => t.includesSearchWord(p.getName(), val.label));
          temp = temp.concat(filtered);
        });
        taxResult = temp;
      });
    return taxResult;
  }

  /** Parameters used to determine taxonomy */
  private isTaxonomyParam(param: SearchParameter): boolean {
    return Object.keys(ParameterName.forTaxonomy)
      .some(name => ParameterName.forTaxonomy[name] === param.getName());
  }

  /** Populate search box with information from specific URL parameters */
  private addRequestParams(qParams) {
    this.urlService.getAllRequestParams(qParams, this.availableParams, this.shortcuts)
      .forEach(obj => this.addSuggestedParameter(obj.param, obj.value));
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
        'label': shortcut.label,
        'command': () => {
          this.removeAllDisplayParameters();
          shortcut.addParameters.forEach(p => this.addParameterByName(p.name, p.values));
          this.submitSearch(true, shortcut);
        }
      });
      this.shortcutButtons = this.shortcuts.map(createButton);
    }
  }

}
