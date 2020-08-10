import { ESSortType } from '../enum/es-sort-type.enum';
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
}
