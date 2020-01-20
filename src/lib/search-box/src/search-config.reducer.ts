import { Action } from '@ngrx/store';

import { SearchBoxConfig } from './search-box.config';

export enum SearchConfigActionType {
  UPDATE = '[Search Config] Update',
  RESET = '[Search Config] Reset',
}

export const initialConfigState: SearchBoxConfig = {
  searchList: [],
  taxonomies: [],
};

export class UpdateSearchConfigAction implements Action {
  readonly type = SearchConfigActionType.UPDATE;

  constructor(public payload: SearchBoxConfig) {}
}

export class ResetSearchConfigAction implements Action {
  readonly type = SearchConfigActionType.RESET;

  constructor(public payload: SearchBoxConfig) {}
}

export function searchConfigReducer(
  state = initialConfigState,
  action: UpdateSearchConfigAction | ResetSearchConfigAction,
): SearchBoxConfig {
  switch (action.type) {
    case SearchConfigActionType.UPDATE: {
      return action.payload;
    }
    case SearchConfigActionType.RESET: {
      return initialConfigState;
    }
    default: {
      return state;
    }
  }
}
