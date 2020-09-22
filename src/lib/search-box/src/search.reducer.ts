import { Action } from '@ngrx/store';

import { SearchModel } from './model/search.model';

export enum SearchActionType {
  Build = '[Search] Build',
  Clear = '[Search] Clear',
}

export const initialState: SearchModel = {
  taxonomy: [],
  from: new Date(),
  to: new Date(),
  size: 300,
};

export class SearchAction implements Action {
  readonly type = SearchActionType.Build;

  constructor(public payload: SearchModel) {}
}

export class ClearSearchAction implements Action {
  readonly type = SearchActionType.Clear;

  constructor() {}
}

export function searchReducer(state = initialState, action: SearchAction | ClearSearchAction): SearchModel {
  switch (action.type) {
    case SearchActionType.Build: {
      return action.payload;
    }
    case SearchActionType.Clear: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
