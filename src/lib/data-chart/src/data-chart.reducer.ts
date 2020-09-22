import { Action } from '@ngrx/store';
import { Chart } from './model/chart.model';

export enum ChartActionType {
  Clear = '[Chart] Clear All',
  Create = '[Chart] Create new chart',
  Remove = '[Chart] Remove chart',
  Edit = '[Chart] Edit',
}

export class ChartAction implements Action {
  readonly type = ChartActionType.Create;

  constructor(public payload: Chart[]) {}
}

export const initialState = [];

export class ClearChartAction implements Action {
  readonly type = ChartActionType.Clear;

  constructor() {}
}

export class EditChartAction implements Action {
  readonly type = ChartActionType.Edit;

  constructor(public payload, public index) {
    this.index = index;
  }
}

export class RemoveChartAction implements Action {
  readonly type = ChartActionType.Remove;

  constructor(public payload) {}
}

export function chartReducer(
  state = initialState,
  action: ChartAction | ClearChartAction | RemoveChartAction | EditChartAction,
) {
  switch (action.type) {
    case ChartActionType.Create: {
      return [...state, ...action.payload];
    }
    case ChartActionType.Clear: {
      return initialState;
    }
    case ChartActionType.Remove: {
      return [...state.slice(0, action.payload), ...state.slice(action.payload + 1)];
    }
    case ChartActionType.Edit: {
      const copy = state.slice();
      copy[action.index] = action.payload;
      return copy;
    }
    default: {
      return state;
    }
  }
}
