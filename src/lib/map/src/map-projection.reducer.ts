import { Action } from '@ngrx/store';

export enum MapProjectionActionType {
  SWITCH = '[Map] Switch Projection',
}

export type Projection = 'EPSG:3857' | 'EPSG:3995';
export const initialProjection: Projection = 'EPSG:3857';

export class SwitchProjectionAction implements Action {
  readonly type = MapProjectionActionType.SWITCH;

  constructor(public projection: Projection) {}
}

export function mapProjectionReducer(state = initialProjection, action: SwitchProjectionAction) {
  switch (action.type) {
    case MapProjectionActionType.SWITCH: {
      return action.projection;
    }
    default: {
      return state;
    }
  }
}
