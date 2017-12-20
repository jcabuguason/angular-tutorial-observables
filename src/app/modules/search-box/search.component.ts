import { Component, OnInit } from '@angular/core';

import { SearchService } from './search.service';

import { SearchParameter } from './search-parameter';
import { DisplayParameter } from './display-param';
import { SearchTaxonomy } from './search-taxonomy';
import { EquivalentKeywords } from './equivalent-keywords';

@Component({
    selector: 'commons-search',
    templateUrl: './search.component.html',
    styleUrls: [ './search.component.css' ]
})

export class SearchComponent implements OnInit {

    constructor(public searchService: SearchService) { }

    ngOnInit(): void { }
}
