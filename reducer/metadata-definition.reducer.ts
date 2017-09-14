/**
 * Created by Joey Chan on 06/15/2017.
 */

import { MDDefinitionParser } from '../parser/md-definition.parser';
import { ActionReducer, Action } from '@ngrx/store';
import { MDDefinition } from '../object/metadata/MDDefinition';

export function metadataDefinitionReducer(state: MDDefinition = null, action: Action) {
    switch (action.type) {
        case 'LOAD_DEFINITION':
            return MDDefinitionParser.parse(action.payload);
        case 'RESET':
            return null;
        default:
            return state;
    }
};
