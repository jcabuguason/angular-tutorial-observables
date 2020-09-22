import { Action } from '@ngrx/store';

import { SearchBoxConfig } from './search-box.config';

export enum SearchConfigActionType {
  Update = '[Search Config] Update',
  Reset = '[Search Config] Reset',
}

export const initialConfigState: SearchBoxConfig = {
  searchList: [],
  taxonomies: [],
};

export class UpdateSearchConfigAction implements Action {
  readonly type = SearchConfigActionType.Update;

  constructor(public payload: SearchBoxConfig) {}
}

export class ResetSearchConfigAction implements Action {
  readonly type = SearchConfigActionType.Reset;

  constructor(public payload: SearchBoxConfig) {}
}

export function searchConfigReducer(
  state = initialConfigState,
  action: UpdateSearchConfigAction | ResetSearchConfigAction,
): SearchBoxConfig {
  switch (action.type) {
    case SearchConfigActionType.Update: {
      return action.payload;
    }
    case SearchConfigActionType.Reset: {
      return initialConfigState;
    }
    default: {
      return state;
    }
  }
}
