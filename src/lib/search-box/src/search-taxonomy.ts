import { Component } from '@angular/core';

export class SearchTaxonomy {

    /**
     * TODO: should have config to set the defaults
     * @param taxonomy The taxonomy (ex: "/msc/observation/atmospheric/surface_weather/ca-1.1-ascii")
     * @param keywords Special words to associate taxonomy with (must also be a valid choice in the search categories).
     * @param phases Phases that can be returned from the search (decoded-xml-2.0, decoded_qa-xml-2.0, etc). Default is all.
     */
    constructor(
        private taxonomy: string,
        private keywords: string[],
        private phases: string[] = defaultPhases
    ) {
        this.keywords = keywords.concat(this.splitToKeywords(taxonomy));
    }

    /**
     * Splits up the taxonomy
     * @param taxonomy The taxonomy
     */
    splitToKeywords(taxonomy: string){
        const keywords = taxonomy.split('/').filter(k => k !== "");
        return keywords;
    }

    getTaxonomy(): string {
        return this.taxonomy;
    }

    getKeywords(): string[] {
        return this.keywords;
    }
    
    includesKeyword(word: string) {
        return this.keywords.indexOf(word) !== -1;
    }
}

/** not really used yet */
const defaultPhases: string[] = [
    "decoded-xml-2.0",
    "decoded_qa-xml-2.0",
    "decoded_qa_full-xml-2.0",
    "decoded_enhanced-xml-2.0",
    "decoded_qa_enhanced-xml-2.0"
]