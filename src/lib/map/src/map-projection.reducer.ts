import { Action } from '@ngrx/store';

export type Projection = 'EPSG:3857' | 'EPSG:3995';
export const SWITCH_PROJECTION = 'SWITCH_PROJECTION';
export const initialProjection: Projection = 'EPSG:3857';

export class SwitchProjectionAction implements Action {
  readonly type = SWITCH_PROJECTION;

  constructor(public projection: Projection) {}
}

export function mapProjectionReducer(state = initialProjection, action: SwitchProjectionAction) {
  switch (action.type) {
    case SWITCH_PROJECTION: {
      return action.projection;
    }
    default: {
      return state;
    }
  }
}
