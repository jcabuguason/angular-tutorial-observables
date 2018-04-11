import { Action } from '@ngrx/store';

export const CHART_ELEMENT = 'CHART_ELEMENT';
export const CHART_CLEAR = 'CHART_CLEAR';

export const initialState = [];

export class ChartAction implements Action {
  readonly type = CHART_ELEMENT;

  constructor(public payload: string) {}
}

export class ClearChartAction implements Action {
  readonly type = CHART_CLEAR;

  constructor() {}
}

export function chartReducer(state = initialState, action: ChartAction | ClearChartAction) {
  switch (action.type) {
    case CHART_ELEMENT: {
      return [...state, action.payload];
    }
    case CHART_CLEAR: {
        return initialState;
    }
    default: {
      return state;
    }
  }
}
