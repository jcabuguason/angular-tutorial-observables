import { Action } from '@ngrx/store';

import { SearchModel } from './model/search.model';

export enum SearchActionType {
  BUILD = '[Search] Build',
  CLEAR = '[Search] Clear',
}

export const initialState: SearchModel = {
  taxonomy: [],
  elements: [],
  from: new Date(),
  to: new Date(),
  size: 300,
};

export class SearchAction implements Action {
  readonly type = SearchActionType.BUILD;

  constructor(public payload: SearchModel) {}
}

export class ClearSearchAction implements Action {
  readonly type = SearchActionType.CLEAR;

  constructor() {}
}

export function searchReducer(state = initialState, action: SearchAction | ClearSearchAction): SearchModel {
  switch (action.type) {
    case SearchActionType.BUILD: {
      return action.payload;
    }
    case SearchActionType.CLEAR: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
