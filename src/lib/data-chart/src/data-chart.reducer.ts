import { Action } from '@ngrx/store';

export const CHART_CLEAR = 'CHART_CLEAR';
export const CHART_FORM = 'CHART_FORM';
export const CHART_REMOVE = 'CHART_REMOVE';

export class ChartAction implements Action {
  readonly type = CHART_FORM;

  constructor(public payload: ChartModel[]) {}
}

export const initialState = [];

export class ChartModel {
  elements: string[];
  stations: string[];
}

export class ClearChartAction implements Action {
  readonly type = CHART_CLEAR;

  constructor() {}
}

export class RemoveChartAction implements Action {
  readonly type = CHART_REMOVE;

  constructor(public payload) {}
}

export function chartReducer(state = initialState, action: ChartAction | ClearChartAction | RemoveChartAction) {
  switch (action.type) {
    case CHART_FORM: {
      return [...state, ...action.payload];
    }
    case CHART_CLEAR: {
      return initialState;
    }
    case CHART_REMOVE: {
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];
    }
    default: {
      return state;
    }
  }
}
