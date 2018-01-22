import { Injectable, Inject, EventEmitter } from '@angular/core';

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

    MSC_ID = '1.7.86.0.0.0.0';
    ICAO_ID = '1.7.102.0.0.0.0';
    TC_ID = '1.7.84.0.0.0.0';
    SYNOP_ID = '1.7.82.0.0.0.0';
    PROV_ID = '1.7.117.0.0.0.0';

    constructor(
        @Inject(SEARCH_BOX_CONFIG)
        public config: SearchBoxConfig) {
            this.taxonomies = this.config.taxonomies;
            this.availableParams = this.config.search_list;
            this.equivalentWords = this.config.equivalent_words;
        }

    /** Suggestions that show up for different categories/parameters */
    showSuggestedParameters(searchString: string, showAll: boolean) {
      this.suggestedParams = showAll && !searchString
          ? this.availableParams.filter(item => item.getTimesUsed() < item.getTimesUsable())
          : this.searchParameters(searchString, this.availableParams);
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
        this.searchRequested.emit(this.getSearchModel());
    }

    /** Searches for the parameter */
    private searchParameters(searchKey: string, list: SearchParameter[]) {
        searchKey = searchKey.trim();
        if (!searchKey) { return []; }
        return list.filter(item => item.getDisplayName().indexOf(searchKey) > -1)
                   .filter(item => item.getTimesUsed() < item.getTimesUsable());
    }

    /** Searches for the dropdown selection in the parameter*/
    private searchChoices(searchValue: string, parameter: SearchParameter) {
        searchValue = searchValue.trim();
        if (!searchValue) { return []; }
        return parameter.getChoices().filter(item => item.indexOf(searchValue) > -1);
    }

    /** Parameter chosen from suggestedParams */
    private addSuggestedParameter(parameter: SearchParameter, value: string = '') {
        if (parameter.getTimesUsed() < parameter.getTimesUsable()) {
            const param: DisplayParameter = new DisplayParameter(parameter.getDisplayName(), '', [], parameter);

            this.displayParams.push(param);

            this.addValueToDisplay(value, this.displayParams.length - 1);

            // don't show the drop list since something has already been selected
            this.suggestedParams = null;
            // clear the main input box until next input
            this.searchString = '';

            parameter.increaseTimesUsed();
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

    // helper function for getTaxonomy
    // combine parameters of the same value
    private combineParameters(submitSearch: boolean = false) {
        let param: SearchParameter;
        let displayedValue: string;

        // clear previous selected values
        for (const p of this.availableParams) {
            p.removeAllSelected();
        }

        for (const p of this.displayParams) {
            param = p.getSearchParam();

            if (param.getType() === 'SearchDatetime' || param.getType() === 'SearchHoursRange' ) {
                // datetime and hours range are handled differently
                const temp = param as SearchDatetime;
                if (temp.isUnfilled()) {
                  this.removeDisplay(this.displayParams.indexOf(p));
                }
                continue;
            } else {
                if (param.getName() === 'size') {
                    p.setValue(this.limitValue(Number(p.getValue()), 0, 1000));
                }
                displayedValue = p.getValue();
            }

            // skip and remove any null values from the UI too
            if (displayedValue === '' && submitSearch) {
                this.removeDisplay(this.displayParams.indexOf(p));
                continue;
            }

            param.addSelected(displayedValue);
        }
    }

    // check any missing required parameters
    private missingParameters(): string[] {
        const missing: string[] = [];
        for (const p of this.availableParams){
            if (p.isRequired()) {
                const found = this.displayParams.filter(item => item.getSearchParam() === p);
                if (found.length === 0) {
                    missing.push(p.getDisplayName());
                }
            }
        }
        return missing;
    }

    /** arrayName.concat doesn't always work that well, so combine it like this */
    private combineArrays(array1: any[], array2: any[]) {
        for (const item of array2){
            array1.push(item);
        }
        return array1;
    }

    /** Gets the taxonomies based on words that are associated with it */
    private determineTaxonomies(submitSearch: boolean = false) {
        let taxResult: SearchTaxonomy[] = this.taxonomies;
        let temp: SearchTaxonomy[] = [];
        let missing: string[] = [];
        this.message = [];
        this.resultTaxonomies = [];

        if (this.displayParams !== null) {
            if (submitSearch) {
                this.combineParameters(true);
                missing = this.missingParameters();

                if (missing.length > 0) {
                    this.message.push('Missing some required search fields: ');
                    for (const m of missing){
                        this.message.push(m);
                    }
                    return;
                }
            } else {
                for (const p of this.availableParams) {
                    p.removeAllSelected();
                }
                // this.combineParameters();
            }

            for (const p of this.availableParams) {
                if (this.canIgnoreParam(p)) { continue; }

                if (p.getSelected().length) {
                    // if searching two values that belong to the same category, it would return the combined result
                    if (submitSearch) { temp = []; }
                    for (const value of p.getSelected()) {
                        const filtered = taxResult.filter(t => t.includesSearchWord(p.getName(), value));
                        temp = this.combineArrays(temp, filtered);
                    }
                    taxResult = temp;
                }
            }
        }

        for (const t of taxResult) {
            if (this.resultTaxonomies.indexOf(t) === -1) {
                this.resultTaxonomies.push(t);
            }
        }
    }

    private limitValue(input, min, max) {
        input = isNaN(input)
            ? 300
            : input;

        if (Math.max(input, max) === input) {
            return max;
        } else if (Math.min(input, min) === input) {
            return min;
        }
        return input;
    }

    // these parameters does not affect the taxonomy determined by the search component
    // they will be sent into ES instead
    private canIgnoreParam(param: SearchParameter): boolean {
        return (param.getType() === 'SearchDatetime' || param.getType() === 'SearchHoursRange' ||
                param.getName() === 'stnName' || param.getName() === 'size' || param.getName() === 'province');
    }
}
