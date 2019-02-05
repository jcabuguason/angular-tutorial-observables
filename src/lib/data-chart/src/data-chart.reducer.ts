import { Action } from '@ngrx/store';
import { ChartObject } from './model/chart.model';

export const CHART_CLEAR = 'CHART_CLEAR';
export const CHART_FORM = 'CHART_FORM';
export const CHART_REMOVE = 'CHART_REMOVE';
export const CHART_EDIT = 'CHART_EDIT';

export class ChartAction implements Action {
  readonly type = CHART_FORM;

  constructor(public payload: ChartObject[]) {}
}

export const initialState = [];

export class ClearChartAction implements Action {
  readonly type = CHART_CLEAR;

  constructor() {}
}

export class EditChartAction implements Action {
  readonly type = CHART_EDIT;

  constructor(public payload, public index) {
    this.index = index;
  }
}

export class RemoveChartAction implements Action {
  readonly type = CHART_REMOVE;

  constructor(public payload) {}
}

export function chartReducer(
  state = initialState,
  action: ChartAction | ClearChartAction | RemoveChartAction | EditChartAction
) {
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
    case CHART_EDIT: {
      const copy = state.slice();
      copy[action.index] = action.payload;
      return copy;
    }
    default: {
      return state;
    }
  }
}
