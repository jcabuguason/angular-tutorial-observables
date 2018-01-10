import { SearchParameter } from './search-parameter';

export class SearchTaxonomy {
    private allSearchWords: SearchTaxonomyWord[] = [];
    /**
     * @param taxonomy The taxonomy (ex: 'dms_data:msc:observation:atmospheric:surface_weather:ca-1.1-ascii')
     * @param allSearchParams All searchable parameters and choices
     * @param searchWords words to associate taxonomy with
     * @param phases Phases that can be returned from the search (decoded-xml-2.0, decoded_qa-xml-2.0, etc). Default is all.
     */
    constructor(
        private taxonomy: string,
        private allSearchParams: SearchParameter[],
        private extraSearchWords: string[] = [],
        private phases: string[] = defaultPhases
    ) {
        const taxonomyKeys = this.splitToKeywords(taxonomy);
        this.categorize(allSearchParams, taxonomyKeys);
        this.categorize(allSearchParams, extraSearchWords);

        // no need to keep these values anymore
        delete this.allSearchParams;
        delete this.extraSearchWords;
    }

    getTaxonomy(): string {
        return this.taxonomy;
    }

    includesSearchWord(name: string, value: string): boolean {
        const s = this.allSearchWords.filter(item => item.getName() === name && item.includesValue(value));
        return s.length > 0;
    }

    getSearchWords(): SearchTaxonomyWord[] {
      return this.allSearchWords;
    }

    private splitToKeywords(taxonomy: string): string[] {
      return taxonomy.split(':').filter(k => k !== '');
    }

    private categorize(searchParams: SearchParameter[], words: string[]) {
      if (!searchParams) { return; }

      words.forEach(word => {
          const category = searchParams.filter(param => param.getChoices().indexOf(word) > -1 );

          category.forEach(cat => {
              const included = this.allSearchWords.filter(item => item.getName() === cat.getName());
              if (included.length > 0) {
                  included[0].addValue(word);
              } else {
                  this.allSearchWords.push(new SearchTaxonomyWord(cat.getName(), [word]));
              }
          });
      });
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
