import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';
import { SearchParameter } from './search-parameter';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class SearchService{

    constructor() {}

    /** Searches for the parameter */
    searchSuggestions(searchKey: string, list: SearchParameter[]) {
        searchKey = searchKey.trim();
        if (!searchKey) { return; }
        return list.filter(item => item.getName().includes(searchKey));
    }

    /** Searches for the dropdown selection in the parameter*/
    searchDropdowns(searchValue: string, parameter: SearchParameter){
        searchValue = searchValue.trim();

        if (!searchValue) { return; }
        return parameter.getChoices().filter(item => item.includes(searchValue));
    }
}
