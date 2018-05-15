import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';

import { DisplayParameter } from './display-param';

import { SearchParameter } from './search-parameter';
import { SearchDatetime } from './search-datetime';
import { SearchHoursRange } from './search-hours-range';

import { SearchTaxonomy, SearchTaxonomyWord } from './search-taxonomy';
import { EquivalentKeywords } from './equivalent-keywords';

import { SearchModel, SearchElement } from './search.model';

import { SEARCH_BOX_CONFIG, SearchBoxConfig } from './search-box.config';

@Injectable()
export class SearchService {

    // all taxonomies
    taxonomies: SearchTaxonomy[] = [];

    // result taxonomies from the search
    resultTaxonomies: SearchTaxonomy[] = [];

    // available search parameters to choose from
    availableParams: SearchParameter[] = [];

    // equivalent words (ex. dnd, national defence)
    equivalentWords: EquivalentKeywords[] = [];

    // the main input box
    searchString = '';

    // suggestions that show up while typing
    suggestedParams: SearchParameter[] = [];

    // what is actually seen on the UI
    displayParams: DisplayParameter[] = [];

    // Any messages that should show up based on user input
    message: String[] = [];

    searchRequested = new EventEmitter();

    searchBtnText: string;

    MSC_ID = '1.7.86.0.0.0.0';
    CLIM_ID = '1.7.85.0.0.0.0';
    ICAO_ID = '1.7.102.0.0.0.0';
    TC_ID = '1.7.84.0.0.0.0';
    SYNOP_ID = '1.7.82.0.0.0.0';
    PROV_ID = '1.7.117.0.0.0.0';

    constructor(
        @Inject(SEARCH_BOX_CONFIG)
        public config: SearchBoxConfig,
        public location: Location) {
            this.taxonomies = this.config.taxonomies;
            this.availableParams = this.config.search_list;
            this.equivalentWords = this.config.equivalent_words;
            this.searchBtnText = this.config.search_btn_text;
            this.showAllSuggestedParameters();
        }

    /** Executes parameters for a search request */
    executeSearch(qParams) {
        this.addRequestParams(qParams);
        this.submitSearch();
    }

    /* Re-directs to url with search parameters */
    updateUrl() {
        const urlParams = new URLSearchParams();
        this.createUrlParams().forEach(p => urlParams.append(p.name, p.value));
        this.location.go('/?' + urlParams);
    }

    /* Returns the search parameters so it can be used in the url */
    createUrlParams(): {name: string, value: string}[] {
        const allParams = [];
        const addUrlParam = (name, value) => allParams.push({'name': name, 'value': value});

        this.displayParams.forEach(p => {
            const param = p.getSearchParam();
            const name = param.getName();

            if (param.getType() === 'SearchDatetime') {
                const date = param as SearchDatetime;
                addUrlParam(name, date.getDatetimeUrlFormat());
            } else if (param.getType() === 'SearchHoursRange') {
                const hrs = param as SearchHoursRange;
                addUrlParam('hh_before', hrs.hoursBefore);
                addUrlParam('hh_after', hrs.hoursAfter);
            } else {
                addUrlParam(name, p.getValue().replace(/ /g, '-'));
            }
        });

        return allParams;
    }

    /* Helper to determine which url params don't match search box field names. */
    isSpecialUrlParam(name: string) {
        return !this.availableParams
            .filter(p => p.getType() !== 'SearchDatetime' && p.getType() !== 'SearchHoursRange')
            .some(p => p.getName() === name);
    }

    /* Helper to populate url params that don't match search box field names or uses a special format */
    addSpecialRequestParams(qParams) {
        return this.addDateRequestParams(qParams).concat(this.addHourRangeRequestParams(qParams));
    }

    /* Helper to populate dates from url params to search box.
    Returns a list of { 'value': date, 'param': SearchParameter } that will be added */
    addDateRequestParams(qParams) {
        const from = this.getDateFromParam(qParams.from);
        const to = this.getDateFromParam(qParams.to);

        return [
            { 'value' : from, 'param': this.availableParams.find(p => p.getType() === 'SearchDatetime' && p.getName() === 'from') },
            { 'value' : to, 'param': this.availableParams.find(p => p.getType() === 'SearchDatetime' && p.getName() === 'to') }
        ];
    }
    /* Helper to populate hour range from url params to search box.
    Returns a list of { 'value': { 'hh_before': hh, 'hh_after': hh }, 'param': SearchParameter } that will be added */
    addHourRangeRequestParams(qParams) {
        if (qParams.hh_before == null && qParams.hh_after == null) { return []; }
        const hours = (value) => isNaN(value) ? 0 : Number(value);
        return [
            {
                'value': {
                    'hh_before': hours(qParams.hh_before),
                    'hh_after': hours(qParams.hh_after)
                },
                'param': this.availableParams.find(p => p.getType() === 'SearchHoursRange' && p.getName() === 'hoursRange')
            }
        ];
    }

    /* Creates a valid date parameter, or undefined if unable to create a valid date */
    getDateFromParam(param) {
        if (param == null) { return param; }

        const date = new Date(param);
        return (date.toString() === 'Invalid Date') ? undefined : date;
    }

    /** Suggestions that show up for different categories/parameters */
    showAllSuggestedParameters() {
        if (this.availableParams) {
            this.suggestedParams = this.availableParams.filter(item => item.getTimesUsed() < item.getTimesUsable());
        }
    }

    /** Choices that show up (index is for displayParams) */
    showSuggestedChoices(searchString: string, index: number) {
        const display = this.displayParams[index];
        const param = display.getSearchParam();
        const choices = this.searchChoices(searchString, param);
        let newChoices: string[];

        if (choices && choices.indexOf(searchString) > -1) {
            display.removeAllDisplayChoices();
        } else {
            const possibleChoices = (searchString) ? choices : param.getChoices();
            newChoices = possibleChoices.filter(c => !this.valueAlreadyExists(c, index) && !this.isBadValue(c, index));
            display.setDisplayChoices(newChoices);
        }

    }

    /** Don't show the choices except given index */
    removeAllSuggestedChoices(exceptIndex: number = -1) {
        this.displayParams
            .filter((param, index) => index !== exceptIndex)
            .forEach(param => param.removeAllDisplayChoices());
    }

    /** Entering any word and find the parameter/choice it matches with */
    addNewParameter(searchString: string) {
        this.message = [];

        for (const word of this.equivalentWords){
            if (word.getEquivalents().indexOf(searchString) > -1) {
                searchString = word.getKey();
                break;
            }
        }

        if (this.valueAlreadyExists(searchString)) {
            this.message.push(searchString + ' was already entered!');
            return;
        }

        // check if it was already in a predefined category
        for (const param of this.availableParams){
            // category
            if (param.getDisplayName() === searchString) {
                this.addSuggestedParameter(param);
                return;
            } else if (param.getChoices().indexOf(searchString) > -1) {
                this.addSuggestedParameter(param, searchString);
                return;
            }
        }
        this.message.push('Could not find keyword. Try selecting a category first.');
    }

    /** Can be used by clicking value, or typing in manually without clicking suggestion */
    addValueToDisplay(value: string, index: number) {
        this.searchString = '';
        this.message = [];

        if (!value) { return; }

        // check if has equivalent word
        for (const word of this.equivalentWords){
            if (word.getEquivalents().indexOf(value) > -1) {
                value = word.getKey();
                break;
            }
        }

        const param = this.displayParams[index].getSearchParam();
        if (param.isRestricted() && param.getChoices().indexOf(value) < 0 && this.isBadValue(value, index)) {
            this.message.push('Please select one of the available options');
            return;
        }

        if (!this.valueAlreadyExists(value, index)) {
            this.displayParams[index].setValue(value);
            this.displayParams[index].removeAllDisplayChoices();
        } else {
            this.message.push(value + ' was already entered!');
        }
    }

    /** Used when remove button clicked */
    removeDisplay(index: number) {
        const param = this.displayParams[index].getSearchParam();
        // there can only be one of datetime and hours range filled in, so values are modified directly
        if (param.getType() === 'SearchDatetime') {
            const dateParam = param as SearchDatetime;
            dateParam.resetValues();
        } else if (param.getType() === 'SearchHoursRange') {
          const dateParam = param as SearchHoursRange;
          dateParam.resetValues();
        }

        param.decreaseTimesUsed();
        this.displayParams.splice(index, 1);

        this.showAllSuggestedParameters();
    }

    getSearchModel(): SearchModel {
      const stnNames: string[] = [];
      const elements: SearchElement[] = [];
      let startDate;
      let endDate;
      let numObs = 300;
      let operator: string;

      this.determineTaxonomies(true);
      const taxonomies = this.resultTaxonomies.map(value => value.getTaxonomy());

      for (const p of this.availableParams) {
        if (p.getName() === 'stnName' && p.getSelected().length > 0) {
            p.getSelected().forEach(s => {
                elements.push(
                    new SearchElement(this.determineStdPkgId(s),
                        'metadataElements',
                        'value',
                        s.toUpperCase())
                    );
                }
            );
            operator = 'AND';
        } else if (p.getName() === 'province' && p.getSelected().length > 0) {
            p.getSelected().forEach(s => {
                elements.push(
                    new SearchElement (this.PROV_ID,
                        'metadataElements',
                        'value',
                        s.toUpperCase())
                    );
                }
            );
            operator = 'AND';
        } else if (p.getName() === 'size' && p.getSelected().length) {
            numObs = Number(p.getSelected());
        } else if (p.getType() === 'SearchDatetime') {
            if (p.getName() === 'from') {
                startDate = (p as SearchDatetime).getFullDatetime();
            } else if (p.getName() === 'to') {
                endDate = (p as SearchDatetime).getFullDatetime();
            }
        }
      }
      return new SearchModel(taxonomies, elements, startDate, endDate, numObs, operator);
    }

    submitSearch() {
        const model = this.getSearchModel();
        // always need taxonomy for ES
        if (model.taxonomy.length > 0 ) {
            if (this.displayParams.length > 0) {
                this.updateUrl();
            }
            this.searchRequested.emit(model);
        }
    }

    // check any missing required parameters
    missingParameters(): string[] {
        const missing = this.availableParams
            .filter(p => p.isRequired())
            .filter(p => {
                const found = this.displayParams.filter(item => item.getSearchParam() === p);
                return found === undefined || found.length < 1;
            })
            .map(p => p.getDisplayName());
        return missing;
    }

    taxonomyExists(taxonomy: string): boolean {
        return this.taxonomies.some(t => t.getTaxonomy() === taxonomy);
    }

    /** Searches for the dropdown selection in the parameter*/
    private searchChoices(searchValue: string, parameter: SearchParameter) {
        searchValue = searchValue.trim();
        if (!searchValue) { return []; }
        return parameter.getChoices().filter(item => item.indexOf(searchValue) > -1);
    }

    /** Parameter chosen from suggestedParams */
    addSuggestedParameter(parameter: SearchParameter, value: string = '') {
        if (parameter.getTimesUsed() < parameter.getTimesUsable()) {
            const param: DisplayParameter = new DisplayParameter(parameter.getDisplayName(), '', [], parameter);

            this.displayParams.push(param);

            this.addValueToDisplay(value, this.displayParams.length - 1);

            // clear the main input box until next input
            this.searchString = '';

            parameter.increaseTimesUsed();

            this.showAllSuggestedParameters();
        }
    }

    // determines the std-pkg-id depending on the station entered
    private determineStdPkgId(stationID: string) {
        const defaultID = this.MSC_ID;
        const stationTypes = [
            { id: this.MSC_ID, regex: /^[a-zA-Z0-9]{7}/ },
            { id: this.ICAO_ID, regex: /^[a-zA-Z]{4}/ },
            { id: this.TC_ID, regex: /^[a-zA-Z]{3}/ },
            { id: this.SYNOP_ID, regex: /^[0-9]{5}/ },
        ];

        const result = stationTypes.filter(stnType => stationID.match(stnType.regex));
        return result.length > 0 ? result[0].id : defaultID;
    }

    /** Searches if value has already been entered before */
    private valueAlreadyExists(value: string, index: number = -1) {
      if (!value) { return false; }

      let exists = false;

      this.displayParams.forEach((item, i) => {
          if (item.getValue() === value && i !== index) {
              exists = true;
          }
      });

      return exists;
    }

    /** Searches if value cannot be used
     * ex. if 'msc' was chosen before, you should only be able to use other words related to msc taxonomies
    */
    private isBadValue(value: string, index: number) {
        const param = this.displayParams[index].getSearchParam();
        if (!value || this.canIgnoreParam(param)) { return false; }

        this.resultTaxonomies = [];
        this.determineTaxonomies();

        if (this.resultTaxonomies.length === 0) { return false; }

        const allWords = [];

        this.resultTaxonomies.forEach((item, i) => {
            const searchWords: SearchTaxonomyWord[] = item.getSearchWords();
            searchWords.forEach((word) => {
              allWords.push(... word.getValues());
            });
        });

        return allWords.indexOf(value) === -1;
    }

    /** check for any added parameters that are not used */
    private emptyParameters(): string[] {
        return this.displayParams.filter(p => {
            const param = p.getSearchParam();
            return param.getType() === 'SearchParameter'
                ? !p.getValue().trim()
                : param.isUnfilled();
        }).map(p => p.getKey());
    }

    /** helper function for getTaxonomy, combine parameters of the same value */
    private combineParameters(submitSearch: boolean = false) {
        let param: SearchParameter;
        let displayedValue: string;
        let combined = true;
        // clear previous selected values
        this.availableParams.forEach(p => p.removeAllSelected());

        this.displayParams.forEach((p, index) => {
            param = p.getSearchParam();

            // datetime and hours range are handled differently
            if (param.getType() === 'SearchDatetime' || param.getType() === 'SearchHoursRange' ) {
                this.handleSpecialParams(param, index);
            } else {
                if (param.getName() === 'size') {
                    p.setValue(this.limitValue(p.getValue()));
                }
                displayedValue = p.getValue();

                if (submitSearch) {
                    // skip and remove any null values from the UI too
                    if (displayedValue === '') {
                        this.removeDisplay(index);
                    } else {
                        const valid = this.validValuesOnSubmit(displayedValue, index);
                        if (!valid) {
                            combined = false;
                        }
                    }
                } else {
                    param.addSelected(displayedValue);
                }
            }
        });
        return combined;
    }

    private validValuesOnSubmit(value, index) {
        const displayParam = this.displayParams[index];
        const param = displayParam.getSearchParam();
        // check if has equivalent word
        const equivs = this.equivalentWords.filter(word => word.getEquivalents().indexOf(value) > -1);
        value = equivs.length > 0 ? equivs[0].getKey() : value;

        if (param.isRestricted() && param.getChoices().indexOf(value) < 0) {
            this.message.push('Please select one of the available options for ' + param.getDisplayName());
            return false;
        }

        if (this.valueAlreadyExists(value, index)) {
            this.message.push(value + ' was already entered!');
            return false;
        }

        displayParam.setValue(value);
        param.addSelected(value);
        return true;
    }

    /** Gets the taxonomies based on words that are associated with it */
    private determineTaxonomies(submitSearch: boolean = false) {
        let taxResult: SearchTaxonomy[] = this.taxonomies;
        let temp: SearchTaxonomy[] = [];
        let missing: string[] = [];
        let empty: string[] = [];
        this.message = [];
        this.resultTaxonomies = [];

        if (this.displayParams !== null) {
            if (submitSearch) {
                empty = this.emptyParameters();
                if (empty.length > 0) {
                    this.message.push('Categories added but does not have a value: ');
                    empty.forEach(e => this.message.push(e));
                    taxResult = [];
                    return;
                }

                const combined = this.combineParameters(true);
                if (!combined) {
                    taxResult = [];
                    return;
                }

                missing = this.missingParameters();

                if (missing.length > 0) {
                    this.message.push('Missing some required search fields: ');
                    missing.forEach(m => this.message.push(m));
                    taxResult = [];
                    return;
                }
            } else {
                for (const p of this.availableParams) {
                    p.removeAllSelected();
                }
                // this.combineParameters();
            }

            this.availableParams.forEach(p => {
                if (!this.canIgnoreParam(p) && p.getSelected().length) {
                    // if searching two values that belong to the same category, it would return the combined result
                    if (submitSearch) { temp = []; }
                    for (const value of p.getSelected()) {
                        const filtered = taxResult.filter(t => t.includesSearchWord(p.getName(), value));
                        temp = temp.concat(filtered);
                    }
                    taxResult = temp;
                }
            });
        }

        taxResult.forEach(t => {
            if (this.resultTaxonomies.indexOf(t) === -1) {
                this.resultTaxonomies.push(t);
            }
        });
    }

    private limitValue(input: string, min = 0, max = 1000): string {
        const inputNum = Number(input);
        if (isNaN(inputNum)) {
            return '300';
        }
        let newInput = inputNum;
        if (Math.max(inputNum, max) === inputNum) {
            newInput = max;
        } else if (Math.min(inputNum, min) === inputNum) {
            newInput = min;
        }
        return String(newInput);
    }

    // these parameters does not affect the taxonomy determined by the search component
    // they will be sent into ES instead
    private canIgnoreParam(param: SearchParameter): boolean {
        return (param.getType() === 'SearchDatetime' || param.getType() === 'SearchHoursRange' ||
                param.getName() === 'stnName' || param.getName() === 'size' || param.getName() === 'province');
    }

    /** Populate search box with information from specific URL parameters */
    private addRequestParams(qParams) {
        const findParam = (name) => this.availableParams.find(p => p.getName() === name);
        const valueParamObj = (value, paramName) => ({ 'value': value, 'param': findParam(paramName) });

        let newParams = [];

        for (const key in qParams) {
            if (qParams[key] != null && !this.isSpecialUrlParam(key)) {
                newParams.push(valueParamObj(qParams[key], key));
            }
        }

        newParams = newParams.concat(this.addSpecialRequestParams(qParams));

        // filter out any parameters that don't exist from the search config
        newParams.filter(obj => obj.param != null && obj.value != null)
            .forEach(obj => this.applyParameter(obj.param, obj.value));
    }

    private applyParameter(searchParam: SearchParameter, value) {
        if (searchParam.getType() === 'SearchDatetime') {
            this.addSuggestedParameter(searchParam);
            (searchParam as SearchDatetime).setFullDatetime(value);
        } else if (searchParam.getType() === 'SearchHoursRange') {
            this.addSuggestedParameter(searchParam);
            (searchParam as SearchHoursRange).setHours(value.hh_before, value.hh_after);
        } else {
            ((Array.isArray(value)) ? value : [value])
                .filter(val => val != null)
                .map(val => val.replace(/-/g, ' '))
                .forEach(val => this.addSuggestedParameter(searchParam, val));
        }
    }

    /* Helper for combineParameters*/
    private handleSpecialParams(param, index) {
        if (param.isUnfilled()) {
            this.removeDisplay(index);
        } else if (param.getType() === 'SearchHoursRange') {
            (param as SearchHoursRange).limitRange();
        }
    }
}
