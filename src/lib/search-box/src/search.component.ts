import { Component, OnInit } from '@angular/core';

import { SearchService } from './search.service';

import { SearchParameter } from './search-parameter';
import { DisplayParameter } from './display-param';
import { SearchTaxonomy } from './search-taxonomy';
import { EquivalentKeywords } from './equivalent-keywords';

/** TODO: this would need to be an actual config */
import { SEARCH_LIST } from './mock-config';
import { TAXONOMIES } from './mock-config';
import { ALL_EQUIVS } from './mock-config';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: [ './search.component.css' ]
})

export class SearchComponent implements OnInit {
    // all taxonomies
    taxonomies = TAXONOMIES;

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

    constructor(private searchService: SearchService) {
    }

    ngOnInit(): void {
    }

    /** Suggestions that show up for different categories/parameters */
    searchForParameter(searchString: string, showAll: boolean) {
        this.suggestedParams = showAll && !searchString.length
            ? this.availableParams
            : this.searchService.searchSuggestions(searchString, this.availableParams);
    }

    /** Choices that show up (index is for displayParams) */
    searchForChoices(searchString: string, index: number) {
        const display = this.displayParams[index];
        const param = display.getSearchParam();
        const choices = this.searchService.searchDropdowns(searchString, param);
        let newChoices: string[];

        // display all choices if nothing was entered
        if (searchString == undefined || searchString == ""){
            newChoices = param.getChoices().filter(c => !this.valueAlreadyExists(c));
            display.setDisplayChoices(newChoices);
        }

        // no need to display choices again if entered value is an exact match
        else if (choices.indexOf(searchString) !== -1) {
            display.removeAllDisplayChoices();
        }

        else {
            newChoices = choices.filter(c => !this.valueAlreadyExists(c));
            display.setDisplayChoices(newChoices);
        }
    }

    addNewParameter(searchString: string){
        this.message = [];

        for (let word of ALL_EQUIVS){
            if (word.getEquivalents().indexOf(searchString) !== -1) {
                searchString = word.getKey();
                break;
            }
        }

        if (this.valueAlreadyExists(searchString)) {
            this.message.push(searchString + " was already entered!");
            return;
        }
        
        //check if it was already in a predefined category
        for (let param of this.availableParams){
            // category
            if (param.getName() == searchString){
                this.addSuggestedParameter(param);
                return;
            }
            // in the choices
            else if (param.getChoices().indexOf(searchString) !== -1) {
                this.addSuggestedParameter(param, searchString);
                return;
            }
        }
        this.message.push("Could not find keyword. Try selecting a category first.");
    }


    /** Parameter chosen from suggestedParams */
    addSuggestedParameter(parameter: SearchParameter, value: string = ""){
        var param: DisplayParameter = new DisplayParameter(parameter.getName(),value, [], parameter);

        this.addDisplayParam(param);
    }
    
    /** Helper function for addSuggestedParameter */
    addDisplayParam(parameter: DisplayParameter){
        this.displayParams.push(parameter);
        // don't show the drop list since something has already been selected
        this.suggestedParams = null;        
        // clear the main input box until next input
        this.searchString = '';
    }

    /** Can be used by clicking value, or typing in manually without clicking suggestion */
    addValueToDisplay(value: string, index: number){
        this.message = [];
        
        // check if has equivalent word
         for (let word of ALL_EQUIVS){
            if (word.getEquivalents().indexOf(value) !== -1){
                value = word.getKey();
                break;
            }
        }

        var param = this.displayParams[index].getSearchParam();
        if (param.isRestricted() && param.getChoices().indexOf(value) === -1){
            this.message.push("Please select one of the available options");
            return;
        }

        if (!this.valueAlreadyExists(value, index)) {
            this.displayParams[index].setValue(value)
            this.displayParams[index].removeAllDisplayChoices();
        }
        else {
            this.message.push(value + " was already entered!");
        }
    }

    /** Searches if value has already been entered before */
    valueAlreadyExists(value: string, index: number = -1){
        let exists: boolean = false;

        this.displayParams.forEach((item, i) => {
            if (item.getValue() == value && i != index){
                exists = true;
            }
        })
        return exists;
    }
    
    /** Used when remove button clicked */
    removeDisplay(index: number){
        this.displayParams.splice(index, 1);
    }

    // combine parameters of the same value
    combineParameters() {
        let param: SearchParameter;
        let displayedValue: string;

        // clear previous selected values
        for (let p of this.availableParams){
            p.removeAllSelected();
        }

        for (let p of this.displayParams){
            param = p.getSearchParam();
            displayedValue = p.getValue();
            // skip and remove any null values from the UI too
            if (p.getValue() == ""){
                this.displayParams = this.displayParams.filter(item => item !== p);
                continue;
            }
            param.addSelected(displayedValue);
        }
    }

    /** arrayName.concat doesn't always work that well, so combine it like this */
    combineArrays(array1: any[], array2: any[]){
        for (let item of array2){
            array1.push(item);
        }
        return array1;
    }

    /** Gets the taxonomies based on words that are associated with it */
    getTaxonomy(){
        let taxResult: SearchTaxonomy[] = TAXONOMIES;
        let temp: SearchTaxonomy[] = [];
        
        if (this.displayParams !== null){
            
            this.combineParameters();

            for (let p of this.availableParams){
                if (p.getSelected() !== []){
                    if (p.getSelected().length == 1){                        
                        temp = taxResult.filter(t => t.includesKeyword(p.getSelectedAt(0)));                        
                        taxResult = temp;
                    }
                    // if searching two values that belong to the same category, it would return the combined result
                    else if (p.getSelected().length > 1){
                        for (let value of p.getSelected()){
                            const filtered = taxResult.filter(t => t.includesKeyword(value));
                            temp = this.combineArrays(temp, filtered);                       
                        }
                        taxResult = temp;
                    }
                }
            }
        }
        this.message = [];
        
        // just for showing results for now. can be removed later
        for (let t of taxResult){
            if (this.message.indexOf(t.getTaxonomy()) === -1) {
                this.message.push(t.getTaxonomy());
            }
        }

    }
}

