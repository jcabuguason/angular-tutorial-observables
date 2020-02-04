import { Action } from '@ngrx/store';

export enum PreferredFormatsActionType {
  UPDATE = '[Value Formatter] Update Preferred',
}

export const initialFormatState = false;

export class UpdatePreferredFormatsAction implements Action {
  readonly type = PreferredFormatsActionType.UPDATE;

  constructor(public payload: boolean) {}
}

export function preferredFormatsReducer(state = initialFormatState, action: UpdatePreferredFormatsAction) {
  switch (action.type) {
    case PreferredFormatsActionType.UPDATE: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
}
