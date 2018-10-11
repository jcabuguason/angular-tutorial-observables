import { SearchParameter } from './parameters/search-parameter';

export class SearchTaxonomy {
    private allSearchWords: SearchTaxonomyWord[] = [];
    /**
     * @param taxonomy The taxonomy (ex: 'dms_data:msc:observation:atmospheric:surface_weather:ca-1.1-ascii')
     * @param allSearchParams All searchable parameters and choices
     * @param searchWords words to associate taxonomy with
     */
    constructor(
        private taxonomy: string,
        private allSearchParams: SearchParameter[],
        private extraSearchWords: string[] = []
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
        const s = this.allSearchWords.filter(item => item.getName().toLowerCase() === name.toLowerCase() && item.includesValue(value));
        return s.length > 0;
    }

    getSearchWords(): SearchTaxonomyWord[] {
      return this.allSearchWords;
    }

    private splitToKeywords(taxonomy: string): string[] {
      return taxonomy.split('+').filter(k => k !== '');
    }

    private categorize(searchParams: SearchParameter[], words: string[]) {
      if (!searchParams) { return; }

      words.forEach(word => {
          const category = searchParams.filter(param =>
            param.getChoices()
              .map(c => c.label.toLowerCase())
              .indexOf(word.toLowerCase()) > -1);

          category.forEach(cat => {
              const included = this.allSearchWords.filter(item => item.getName().toLowerCase() === cat.getName().toLowerCase());
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
    return this.values
      .map(val => val.toLowerCase())
      .indexOf(value.toLowerCase()) > -1;
  }

}
