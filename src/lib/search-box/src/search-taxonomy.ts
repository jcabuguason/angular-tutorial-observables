export class SearchTaxonomy {
keywords: string[];
    /**
     * TODO: should have config to set the defaults
     * @param taxonomy The taxonomy (ex: '/msc/observation/atmospheric/surface_weather/ca-1.1-ascii')
     * @param searchWords words to associate taxonomy with
     * @param phases Phases that can be returned from the search (decoded-xml-2.0, decoded_qa-xml-2.0, etc). Default is all.
     */
    constructor(
        private taxonomy: string,
        private searchWords: SearchTaxonomyWord[],
        private phases: string[] = defaultPhases
    ) {
    }

    getTaxonomy(): string {
        return this.taxonomy;
    }

    includesSearchWord(name: string, value: string) {
        const s = this.searchWords.filter(item => item.getName() === name && item.includesValue(value));
        return s.length > 0;
    }

    getSearchWords() {
      return this.searchWords;
    }

}

export class SearchTaxonomyWord {
  /**
   * @param name name of the search parameter
   * @param values subset of the search parameter choices that can be associated with this taxonomy
   */
  constructor(
    private name: string,
    private values: string[]
  ) {}

  getName() {
    return this.name;
  }
  getValues() {
    return this.values;
  }
  addValue(value: string) {
    this.values.push(value);
  }
  includesValue(value: string) {
    return this.values.indexOf(value) > -1;
  }

}

/** not really used yet */
const defaultPhases: string[] = [
    'decoded-xml-2.0',
    'decoded_qa-xml-2.0',
    'decoded_qa_full-xml-2.0',
    'decoded_enhanced-xml-2.0',
    'decoded_qa_enhanced-xml-2.0'
];
