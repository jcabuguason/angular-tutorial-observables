import { MDInstanceDefinitionParser } from '../parser/metadata-instance-definition.parser';
import { ActionReducer, Action } from '@ngrx/store';
import { MDInstanceDefinition } from '../object/metadata/MDInstanceDefinition';

export function metadataInstanceReducer(state: MDInstanceDefinition = null, action: Action) {
  switch (action.type) {
    case 'LOAD_INSTANCE':
      return MDInstanceDefinitionParser.parse(action.payload);
    case 'RESET':
      return null;
    default:
      return state;
  }
};
