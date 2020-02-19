import { CommonESParams } from './common-es-params.model';
import { ESOperator } from '../enum/es-operator.enum';

export interface ObservationsFromElementsParams extends CommonESParams {
  operator?: ESOperator;
}
