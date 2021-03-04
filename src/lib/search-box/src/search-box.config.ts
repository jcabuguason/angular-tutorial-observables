import { InjectionToken } from '@angular/core';
import { SearchParameter } from './parameters/search-parameter';
import { SearchTaxonomy } from './search-taxonomy';
import { ShortcutModel } from './model/shortcut.model';

export interface SearchBoxConfig {
  searchList: SearchParameter[];
  taxonomies?: SearchTaxonomy[];
  readOnlyBar?: boolean;
  resetBarButton?: boolean;
  shortcuts?: ShortcutModel[];
  identifier?: string;
}

export const SEARCH_BOX_CONFIG = new InjectionToken<SearchBoxConfig>('search-box.config');
