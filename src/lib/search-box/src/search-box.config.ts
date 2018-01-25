import { InjectionToken } from '@angular/core';
import { SearchParameter } from './search-parameter';
import { SearchTaxonomy, SearchTaxonomyWord } from './search-taxonomy';
import { EquivalentKeywords } from './equivalent-keywords';
import { SearchDatetime } from './search-datetime';

export interface SearchBoxConfig {
  search_list: SearchParameter[];
  taxonomies: SearchTaxonomy[];
  equivalent_words: EquivalentKeywords[];
  search_btn_text?: string;  // text to display for search button
}

export const SEARCH_BOX_CONFIG = new InjectionToken<SearchBoxConfig>('search-box.config');
