import { Action } from '@ngrx/store';

import { SearchBoxConfig } from './search-box.config';

export const UPDATE_SEARCH_CONFIG = 'UPDATE_SEARCH_CONFIG';
export const RESET_SEARCH_CONFIG = 'RESET_SEARCH_CONFIG';

export const initialConfigState: SearchBoxConfig = {
  searchList: [],
  taxonomies: [],
};

export class UpdateSearchConfigAction implements Action {
  readonly type = UPDATE_SEARCH_CONFIG;

  constructor(public payload: SearchBoxConfig) { }
}

export class ResetSearchConfigAction implements Action {
  readonly type = RESET_SEARCH_CONFIG;

  constructor(public payload: SearchBoxConfig) { }
}

export function searchConfigReducer(state = initialConfigState, action: UpdateSearchConfigAction | ResetSearchConfigAction): SearchBoxConfig {
  switch (action.type) {
    case UPDATE_SEARCH_CONFIG: {
      return action.payload;
    }
    case RESET_SEARCH_CONFIG: {
      return initialConfigState;
    }
    default: {
      return state;
    }
  }
}