import { ESSortType } from '../enum/es-sort-type.enum';
import { ESQueryChunk } from './es-query-chunk.model';

export interface ESParams {
  size?: number;
  from?: Date;
  to?: Date;
  sortFields?: ESSortType;
  query?: ESQueryChunk[];
}
