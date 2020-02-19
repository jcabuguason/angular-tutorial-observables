import { InjectionToken } from '@angular/core';

export interface ElasticSearchConfig {
  endpoint: string;
}

export const ELASTIC_SEARCH_CONFIG = new InjectionToken<ElasticSearchConfig>('elastic-search.config');
