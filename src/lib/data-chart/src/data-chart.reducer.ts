import { Action } from '@ngrx/store';

export const CHART_CLEAR = 'CHART_CLEAR';
export const CHART_FORM = 'CHART_FORM';



export class ChartAction implements Action {
  readonly type = CHART_FORM;

  constructor(public payload: ChartModel) { }
}

export const initialState = [];

export class ChartModel {
  elements: string[];
  stations: string[];
}

export class ClearChartAction implements Action {
  readonly type = CHART_CLEAR;

  constructor() { }
}

export function chartReducer(state = initialState, action: ChartAction | ClearChartAction) {
  switch (action.type) {
    case CHART_FORM: {
      return action.payload;
    }
    case CHART_CLEAR: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
