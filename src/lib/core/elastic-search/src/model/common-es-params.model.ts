import { ESDateTimeType } from '../enum/es-date-time-type.enum';
import { ESSortType } from '../enum/es-sort-type.enum';
import { ESQueryType } from '../enum/es-query-type.enum';

export interface CommonESParams {
  type?: string;
  size?: number;
  from?: Date;
  to?: Date;
  datetimeType?: ESDateTimeType;
  sortFields?: ESSortType;
  startIndex?: string;
  queryType?: ESQueryType;
}
