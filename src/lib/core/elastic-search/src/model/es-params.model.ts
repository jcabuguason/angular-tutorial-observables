import { ESAggregateKey } from '../enum/es-aggregate-key.enum';
import { ESSortType } from '../enum/es-sort-type.enum';
import { ESTemplate } from '../enum/es-template.enum';
import { ESQueryChunk } from './es-query-chunk.model';

export interface ESParams {
  size?: number;
  from?: Date;
  to?: Date;
  sortFields?: ESSortType[];
  trackTotalHits?: boolean;
  query?: ESQueryChunk[];
  longitude?: number;
  latitude?: number;
  distance?: string;
  fields?: string[];
  aggregateKey?: ESAggregateKey;
  aggregateSize?: number;
  template?: ESTemplate;
}
