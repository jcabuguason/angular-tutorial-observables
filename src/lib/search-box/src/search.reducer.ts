import { Action } from '@ngrx/store';

import { SearchModel } from './model/search.model';

export const BUILD_SEARCH = 'BUILD_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';

export const initialState: SearchModel = {
  taxonomy: [],
  elements: [],
  from: new Date(),
  to: new Date(),
  size: 300,
  operator: '',
};

export class SearchAction implements Action {
  readonly type = BUILD_SEARCH;

  constructor(public payload: SearchModel) {}
}

export class ClearSearchAction implements Action {
  readonly type = CLEAR_SEARCH;

  constructor() {}
}

export function searchReducer(state = initialState, action: SearchAction | ClearSearchAction): SearchModel {
  switch (action.type) {
    case BUILD_SEARCH: {
      return action.payload;
    }
    case CLEAR_SEARCH: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
