import { Injectable, EventEmitter } from '@angular/core';

import { DisplayParameter } from './display-param';

import { SearchParameter } from './search-parameter';
import { SearchDatetime } from './search-datetime';
import { SearchHoursRange } from './search-hours-range';

import { SearchTaxonomy } from './search-taxonomy';
import { EquivalentKeywords } from './equivalent-keywords';

import { SearchModel } from './search.model';

/** TODO: this would need to be an actual config */
import { SEARCH_LIST } from './mock-config';
import { TAXONOMIES } from './mock-config';
import { ALL_EQUIVS } from './mock-config';

@Injectable()
export class SearchService {

    // all taxonomies
    taxonomies = TAXONOMIES;

    // result taxonomies from the search
    resultTaxonomies: string[] = [];

    // available search parameters to choose from
    availableParams = SEARCH_LIST;

    // the main input box
    searchString: string;

    // suggestions that show up while typing
    suggestedParams: SearchParameter[] = [];

    // what is actually seen on the UI
    displayParams: DisplayParameter[] = [];

    // Any messages that should show up based on user input
    message: String[] = [];

    searchRequested = new EventEmitter();

    constructor() { }

    /** Searches for the parameter */
    searchParameters(searchKey: string, list: SearchParameter[]) {
        searchKey = searchKey.trim();
        if (!searchKey) { return; }
        return list.filter(item => item.getName().indexOf(searchKey) > -1)
                   .filter(item => item.getTimesUsed() < item.getTimesUsable());
    }

    /** Searches for the dropdown selection in the parameter*/
    searchChoices(searchValue: string, parameter: SearchParameter) {
        searchValue = searchValue.trim();
        if (!searchValue) { return; }
        return parameter.getChoices().filter(item => item.indexOf(searchValue) > -1);
    }

    /** Suggestions that show up for different categories/parameters */
    showSuggestedParameters(searchString: string, showAll: boolean) {
      this.suggestedParams = showAll && !searchString.length
          ? this.availableParams.filter(item => item.getTimesUsed() < item.getTimesUsable())
          : this.searchParameters(searchString, this.availableParams);
    }

    /** Choices that show up (index is for displayParams) */
    showSuggestedChoices(searchString: string, index: number) {
        const display = this.displayParams[index];
        const param = display.getSearchParam();
        const choices = this.searchChoices(searchString, param);
        let newChoices: string[];

        // display all choices if nothing was entered
        if (searchString === undefined || searchString === '') {
            newChoices = param.getChoices().filter(c => !this.valueAlreadyExists(c));
            display.setDisplayChoices(newChoices);
        } else if (choices.indexOf(searchString) > -1) {
            // no need to display choices again if entered value is an exact match
            display.removeAllDisplayChoices();
        } else {
            newChoices = choices.filter(c => !this.valueAlreadyExists(c));
            display.setDisplayChoices(newChoices);
        }
    }

    /** Entering any word and find the parameter/choice it matches with */
    addNewParameter(searchString: string) {
        this.message = [];

        for (const word of ALL_EQUIVS){
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
            if (param.getName() === searchString) {
                this.addSuggestedParameter(param);
                return;
            } else if (param.getChoices().indexOf(searchString) > -1) {
                this.addSuggestedParameter(param, searchString);
                return;
            }
        }
        this.message.push('Could not find keyword. Try selecting a category first.');
    }

    /** Parameter chosen from suggestedParams */
    addSuggestedParameter(parameter: SearchParameter, value: string = '') {
        if (parameter.getTimesUsed() < parameter.getTimesUsable()) {
            const param: DisplayParameter = new DisplayParameter(parameter.getName(), '', [], parameter);

            this.displayParams.push(param);

            this.addValueToDisplay(value, this.displayParams.length - 1);

            // don't show the drop list since something has already been selected
            this.suggestedParams = null;
            // clear the main input box until next input
            this.searchString = '';

            parameter.increaseTimesUsed();
        }
    }

    /** Can be used by clicking value, or typing in manually without clicking suggestion */
    addValueToDisplay(value: string, index: number) {
        this.searchString = '';
        this.message = [];

        if (!value) { return; }

        // check if has equivalent word
        for (const word of ALL_EQUIVS){
            if (word.getEquivalents().indexOf(value) > -1) {
                value = word.getKey();
                break;
            }
        }

        const param = this.displayParams[index].getSearchParam();
        if (param.isRestricted() && param.getChoices().indexOf(value) < 0) {
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
      let startDate;
      let endDate;

      this.getTaxonomy();

      for (const p of this.availableParams) {
        if (p.getName() === 'station name') {
            for (const s of p.getSelected()) {
                stnNames.push(s);
            }
        }
        if (p.getType() === 'SearchDatetime') {
            if (p.getName() === 'start datetime') {
                startDate = (p as SearchDatetime).getFullDatetime();
            } else if (p.getName() === 'end datetime') {
                endDate = (p as SearchDatetime).getFullDatetime();
            }
        }
      }

      const smodel: SearchModel = new SearchModel(this.resultTaxonomies, stnNames, startDate, endDate);
      return smodel;
    }

    submitSearch() {
        this.searchRequested.emit(this.getSearchModel());
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

    // combine parameters of the same value
    private combineParameters() {
        let param: SearchParameter;
        let displayedValue: string;

        // clear previous selected values
        for (const p of this.availableParams) {
            p.removeAllSelected();
        }

        for (const p of this.displayParams) {
            param = p.getSearchParam();

            if (param.getType() === 'SearchDatetime') {
                // datetime and hours range are handled differently
                // there can only be one occurence for each datetime and hours range
                // these are just temporary values to determine if all fields are filled in
                const temp = param as SearchDatetime;
                // TODO: need better way to determine if the fields are filled in
                displayedValue = temp.isUnfilled()
                    ? ''
                    : temp.date + ' ' + temp.hour + ':' + temp.minute;

            } else if (param.getType() === 'SearchHoursRange') {
                const temp = param as SearchHoursRange;
                displayedValue = temp.isUnfilled()
                    ? ''
                    : temp.hoursBefore + '/' + temp.hoursAfter;
            } else {
                // param.getType() === 'SearchParameter'
                displayedValue = p.getValue();
            }

            // skip and remove any null values from the UI too
            if (displayedValue === '') {
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
                    missing.push(p.getName());
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
    private getTaxonomy() {
        let taxResult: SearchTaxonomy[] = TAXONOMIES;
        let temp: SearchTaxonomy[] = [];
        let missing: string[] = [];
        this.message = [];

        if (this.displayParams !== null) {
            this.combineParameters();
            missing = this.missingParameters();

            if (missing.length > 0) {
                this.message.push('Missing some required search fields: ');
                for (const m of missing){
                    this.message.push(m);
                }
                return;
            }

            for (const p of this.availableParams) {
                if (p.getSelected() !== []) {
                    if (p.getSelected().length === 1) {
                        temp = taxResult.filter(t => t.includesKeyword(p.getSelectedAt(0)));
                        taxResult = temp;
                    } else if (p.getSelected().length > 1) {
                        // if searching two values that belong to the same category, it would return the combined result
                        for (const value of p.getSelected()) {
                            const filtered = taxResult.filter(t => t.includesKeyword(value));
                            temp = this.combineArrays(temp, filtered);
                        }
                        taxResult = temp;
                    }
                }
            }
        }

        for (const t of taxResult) {
            if (this.resultTaxonomies.indexOf(t.getTaxonomy()) === -1) {
                this.resultTaxonomies.push(t.getTaxonomy());
            }
        }
    }
}
