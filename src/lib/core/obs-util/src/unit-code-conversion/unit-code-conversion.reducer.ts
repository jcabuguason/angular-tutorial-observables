import { Action } from '@ngrx/store';

export enum PreferredUnitsActionType {
  Update = '[Units] Update Preferred',
}

export const initialState = false;

export class UpdatePreferredUnitsAction implements Action {
  readonly type = PreferredUnitsActionType.Update;

  constructor(public payload: boolean) {}
}

export function preferredUnitsReducer(state = initialState, action: UpdatePreferredUnitsAction) {
  switch (action.type) {
    case PreferredUnitsActionType.Update: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
