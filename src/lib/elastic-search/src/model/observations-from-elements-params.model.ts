import { CommonElasticSearchParams } from './common-elastic-search-params.model';

export interface ObservationsFromElementsParams extends CommonElasticSearchParams {
  operator?: 'AND' | 'OR';
}
