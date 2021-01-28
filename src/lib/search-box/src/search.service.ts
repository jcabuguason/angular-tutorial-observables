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
import { TimeModel } from './model/time.model';
import { TimeModelOptions } from './model/time-options.model';
import { TabOption } from './enums/tab-option.enum';

import { SEARCH_BOX_CONFIG, SearchBoxConfig } from './search-box.config';

import { SearchURLService } from './search-url.service';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { calculateDate, isTimeBefore, TimeOperator, TimeUnit } from 'msc-dms-commons-angular/shared/util';
import { SearchQuick } from './parameters/search-quick';

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
  quickRangeParams: SearchParameter[] = [];

  useDateAndHoursRange = false;
  useQuickRange = false;
  selectedRangeType;
  rangeTypes = [
    { label: 'SEARCH_BAR.QUICK_DATE_PICKER_LABEL', value: TabOption.Quick },
    { label: 'SEARCH_BAR.RELATIVE_DATE_PICKER_LABEL', value: TabOption.Relative },
    { label: 'SEARCH_BAR.ABSOLUTE_DATE_PICKER_LABEL', value: TabOption.Absolute },
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
      (p) => p.getName() === ParameterName.HoursRange || p.getName() === ParameterName.RelativeDatetime,
    );
    this.dateRangeParams = this.availableParams.filter(
      (p) => p.getName() === ParameterName.From || p.getName() === ParameterName.To,
    );
    this.quickRangeParams = this.availableParams.filter(
      (p) =>
        p.getName() === ParameterName.QuickRangeOptions ||
        p.getName() === ParameterName.QuickRangeFrom ||
        p.getName() === ParameterName.QuickRangeTo,
    );

    //Default tab: Relative
    this.useDateAndHoursRange =
      !!this.hoursRangeParams.length && !!this.dateRangeParams.length && !!this.quickRangeParams.length;

    this.setSelectedRangeType(TabOption.Relative);

    this.addDefaultParameters();

    this.searchConfigUpdated.next(config);
  }

  /** Runs search using URL query parameters */
  searchByUrlParameters(queryParams) {
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
          if (parameter.getName() === ParameterName.Size) {
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
    let relativeDate: Date;

    this.displayParams.forEach((p) => {
      const selected = p.getSelectedModels().map((model) => model.value);
      const updateValue = (value, index, newValue) => {
        if (newValue !== value) {
          p.setSelectedAt(index, newValue);
        }
      };

      switch (p.getName()) {
        case ParameterName.StationID:
          queryChunks.station.elements.push(
            ...selected.map((value) => ({
              elementID: this.determineStationElementID(value.replace(/\s+/g, '')),
              value: value,
              isCaseless: isNaN(value),
            })),
          );
          break;
        case ParameterName.StationName:
          queryChunks.station.elements.push(
            ...selected.map((value) => ({
              elementID: SearchableElement.STATION_NAME.id,
              value: value,
              isCaseless: isNaN(value),
            })),
          );
          break;
        case ParameterName.Province:
          queryChunks.province.elements.push(
            ...selected.map((value) => ({
              elementID: SearchableElement.PROVINCE.id,
              value: value,
            })),
          );
          break;
        case ParameterName.Size:
          selected.forEach((s, index) => {
            numObs = this.fixNumObs(s);
            updateValue(s, index, String(numObs));
          });
          break;
        case ParameterName.From:
          startDate = (p as SearchDatetime).getFullDatetime();
          break;
        case ParameterName.To:
          endDate = (p as SearchDatetime).getFullDatetime();
          break;
        case ParameterName.RelativeDatetime:
          relativeDate = (p as SearchDatetime).getFullDatetime();
          break;
        case ParameterName.QuickRangeFrom:
          startDate = (p as SearchDatetime).getFullDatetime();
          break;
        case ParameterName.QuickRangeTo:
          endDate = (p as SearchDatetime).getFullDatetime();
          break;
      }
    });

    if (this.selectedRangeType === TabOption.Relative && relativeDate != null) {
      const hoursRange = this.hoursRangeParams.find(
        (p) => p.getName() === ParameterName.HoursRange,
      ) as SearchHoursRange;
      if (hoursRange != null) {
        startDate = calculateDate({
          date: relativeDate,
          mode: TimeOperator.Subtract,
          unit: TimeUnit.Hours,
          amount: hoursRange.hoursBefore,
        });
        endDate = calculateDate({
          date: relativeDate,
          mode: TimeOperator.Add,
          unit: TimeUnit.Hours,
          amount: hoursRange.hoursAfter,
        });
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
      this.resetForm(false);
      this.displayParams.forEach((p) => p.populateFormValues());
      this.displayForm = true;
    }
  }

  resetForm(clearBtnHighlights: boolean) {
    if (clearBtnHighlights) {
      this.setButtonHighlight();
    }
    this.availableParams.forEach((p) => p.resetAllFormValues(true));
  }

  setButtonHighlight(index?: number) {
    const quickOptions = this.quickRangeParams.find(
      (p) => p.getName() === ParameterName.QuickRangeOptions,
    ) as SearchQuick;
    quickOptions.btnHighlight.fill(false);
    if (index != null) {
      quickOptions.btnHighlight[index] = true;
    }
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

  setSelectedRangeType(type: TabOption) {
    switch (type) {
      case TabOption.Quick:
        this.selectedRangeType = this.rangeTypes[0].value;
        this.formRangeParams = this.quickRangeParams;
        break;
      case TabOption.Relative:
        this.selectedRangeType = this.rangeTypes[1].value;
        this.formRangeParams = this.hoursRangeParams;
        break;
      case TabOption.Absolute:
        this.selectedRangeType = this.rangeTypes[2].value;
        this.formRangeParams = this.dateRangeParams;
        break;
    }
  }

  /** Gets called by buttons to update calendar quick field parameters */
  updateQuickField(timeOptions: TimeModelOptions, uriLabel: string, index?: number) {
    const fromDate = this.quickRangeParams.find((p) => p.getName() === ParameterName.QuickRangeFrom) as SearchDatetime;
    const toDate = this.quickRangeParams.find((p) => p.getName() === ParameterName.QuickRangeTo) as SearchDatetime;
    const timeModel = new TimeModel(timeOptions);
    const startDate = timeModel.getDateBack();
    const endDate = timeModel.getDateForward();
    const quickOptions = this.quickRangeParams.find(
      (p) => p.getName() === ParameterName.QuickRangeOptions,
    ) as SearchQuick;

    this.setButtonHighlight(index);

    if (fromDate != null && toDate != null) {
      fromDate.setUrlQuickRange(uriLabel);

      fromDate.setFullDatetime(startDate);
      toDate.setFullDatetime(endDate);

      fromDate.populateFormValues();
      toDate.populateFormValues();
      this.useQuickRange = true;
    }
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
    const clearParams = (params: SearchParameter[]) => params.forEach((p) => this.removeDisplayParameter(p));
    const hoursRange = this.hoursRangeParams.find((p) => p.getName() === ParameterName.HoursRange) as SearchHoursRange;
    let negativeHoursRange = false;

    if (this.useDateAndHoursRange) {
      negativeHoursRange = hoursRange?.hoursBefore < 0 || hoursRange?.hoursAfter < 0;
    }

    if (this.selectedRangeType === TabOption.Quick) {
      clearParams(this.dateRangeParams);
      clearParams(this.hoursRangeParams);
    } else if (this.selectedRangeType === TabOption.Relative && this.useDateAndHoursRange) {
      clearParams(this.dateRangeParams);
      clearParams(this.quickRangeParams);
    } else {
      clearParams(this.hoursRangeParams);
      clearParams(this.quickRangeParams);
    }

    const emptyParams = this.findEmptyDisplayParameters().map((p) => p.getDisplayName());
    const missingParams = this.findMissingRequiredParameters().map((p) => p.getDisplayName());
    const checkboxes = this.availableParams.filter(
      (param) => param.getType() === ParameterType.Checkbox && !param.isUnfilled(),
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
    } else if (negativeHoursRange) {
      this.messageService.add({
        key: 'search-messages',
        summary: 'SEARCH_BAR.NEGATIVE_HOURS',
        sticky: true,
      });
      valid = false;
    }

    return valid;
  }

  private adjustDates(): boolean {
    const findFilledDate = (name: ParameterName.From | ParameterName.To): SearchDatetime =>
      this.availableParams.find((param) => param.getName() === name && !param.isUnfilled()) as SearchDatetime;

    const fromDate = findFilledDate(ParameterName.From);
    const toDate = findFilledDate(ParameterName.To);

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

    const organizations = getAllSelected(ParameterName.Organization);
    const networks = getAllSelected(ParameterName.Network);

    return this.taxonomies
      .filter((tax) => organizations.length === 0 || matchingChoice(organizations, tax['organizationCode']))
      .filter((tax) => networks.length === 0 || matchingChoice(networks, tax['networkCode']))
      .map((current) => current.taxonomy);
  }

  /** Parameters used to determine taxonomy */
  private isTaxonomyParam(param: SearchParameter): boolean {
    return param.getName() === ParameterName.Network || param.getName() === ParameterName.Organization;
  }

  /** Populate search box with information from specific URL parameters */
  private addRequestParams(qParams) {
    const hasMatchingName = (param: SearchParameter, name: string) => param.getName() === name;
    const allRequestParams = this.urlService.getAllRequestParams(
      qParams,
      this.availableParams,
      this.shortcuts,
      (this.quickRangeParams.find((p) => p.getName() === ParameterName.QuickRangeOptions) as SearchQuick)?.btnHighlight,
    );

    const useHoursRange = allRequestParams.some((obj) => hasMatchingName(obj.param, ParameterName.RelativeDatetime));
    const useQuickRange = allRequestParams.some((obj) => hasMatchingName(obj.param, ParameterName.QuickRangeFrom));

    const paramsFilter = (param) => useHoursRange || !hasMatchingName(param, ParameterName.HoursRange);

    allRequestParams
      .filter((obj) => paramsFilter(obj.param))
      .forEach((obj) => this.addSuggestedParameter(obj.param, obj.value));

    if (useHoursRange && this.displayParams.find((p) => p.getName() === ParameterName.HoursRange) == null) {
      this.addParameterByName(ParameterName.HoursRange);
    }

    if (useHoursRange) {
      this.setSelectedRangeType(TabOption.Relative);
    } else if (useQuickRange) {
      this.setSelectedRangeType(TabOption.Quick);
    } else {
      this.setSelectedRangeType(TabOption.Absolute);
    }
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
