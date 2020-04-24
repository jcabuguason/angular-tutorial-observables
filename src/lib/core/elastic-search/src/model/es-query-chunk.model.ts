import { ESOperator } from '../enum/es-operator.enum';
import { ESQueryElement } from './es-query-element.model';

export interface ESQueryChunk {
  operator: ESOperator;
  elements: ESQueryElement[];
}
