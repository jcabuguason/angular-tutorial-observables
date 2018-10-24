import { Action } from '@ngrx/store';

export const UPDATE_PREFERRED_UNITS = 'UPDATE_PREFERRED_UNITS';

export const initialState = false;

export class UpdatePreferredUnitsAction implements Action {
    readonly type = UPDATE_PREFERRED_UNITS;

    constructor(public payload: boolean) {}
}

export function preferredUnitsReducer(state = initialState, action: UpdatePreferredUnitsAction) {
    switch (action.type) {
        case UPDATE_PREFERRED_UNITS: {
            return action.payload;
        }
        default: {
            return state;
        }
    }
}
