import { ElasticSearchDateTimeType } from './elastic-search-date-time-type.model';

export interface CommonElasticSearchParams {
  type?: string;
  size?: number;
  from?: Date;
  to?: Date;
  datetimeType?: ElasticSearchDateTimeType;
  sortFields?: string;
  startIndex?: string;
}
