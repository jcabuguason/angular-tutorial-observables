import { Action } from '@ngrx/store';
import { ChartObject } from './model/chart.model';

export enum ChartActionType {
  CLEAR = '[Chart] Clear All',
  CREATE = '[Chart] Create new chart',
  REMOVE = '[Chart] Remove chart',
  EDIT = '[Chart] Edit',
}

export class ChartAction implements Action {
  readonly type = ChartActionType.CREATE;

  constructor(public payload: ChartObject[]) {}
}

export const initialState = [];

export class ClearChartAction implements Action {
  readonly type = ChartActionType.CLEAR;

  constructor() {}
}

export class EditChartAction implements Action {
  readonly type = ChartActionType.EDIT;

  constructor(public payload, public index) {
    this.index = index;
  }
}

export class RemoveChartAction implements Action {
  readonly type = ChartActionType.REMOVE;

  constructor(public payload) {}
}

export function chartReducer(
  state = initialState,
  action: ChartAction | ClearChartAction | RemoveChartAction | EditChartAction,
) {
  switch (action.type) {
    case ChartActionType.CREATE: {
      return [...state, ...action.payload];
    }
    case ChartActionType.CLEAR: {
      return initialState;
    }
    case ChartActionType.REMOVE: {
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];
    }
    case ChartActionType.EDIT: {
      const copy = state.slice();
      copy[action.index] = action.payload;
      return copy;
    }
    default: {
      return state;
    }
  }
}
