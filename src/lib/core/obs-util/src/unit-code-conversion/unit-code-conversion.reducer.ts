import { Action } from '@ngrx/store';

export enum PreferredUnitsActionType {
  UPDATE = '[Units] Update Preferred',
}

export const initialState = false;

export class UpdatePreferredUnitsAction implements Action {
  readonly type = PreferredUnitsActionType.UPDATE;

  constructor(public payload: boolean) {}
}

export function preferredUnitsReducer(state = initialState, action: UpdatePreferredUnitsAction) {
  switch (action.type) {
    case PreferredUnitsActionType.UPDATE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
