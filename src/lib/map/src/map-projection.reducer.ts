import { Action } from '@ngrx/store';

export enum MapProjectionActionType {
  Switch = '[Map] Switch Projection',
}

export type Projection = 'EPSG:3857' | 'EPSG:5937';
export const initialProjection: Projection = 'EPSG:3857';

export class SwitchProjectionAction implements Action {
  readonly type = MapProjectionActionType.Switch;

  constructor(public projection: Projection) {}
}

export function mapProjectionReducer(state = initialProjection, action: SwitchProjectionAction) {
  switch (action.type) {
    case MapProjectionActionType.Switch: {
      return action.projection;
    }
    default: {
      return state;
    }
  }
}
