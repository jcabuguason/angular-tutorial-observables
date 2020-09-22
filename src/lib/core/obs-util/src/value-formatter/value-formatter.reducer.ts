import { Action } from '@ngrx/store';

export enum PreferredFormatsActionType {
  Update = '[Value Formatter] Update Preferred',
}

export const initialFormatState = false;

export class UpdatePreferredFormatsAction implements Action {
  readonly type = PreferredFormatsActionType.Update;

  constructor(public payload: boolean) {}
}

export function preferredFormatsReducer(state = initialFormatState, action: UpdatePreferredFormatsAction) {
  switch (action.type) {
    case PreferredFormatsActionType.Update: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
