import { Action, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { AuthResponse } from './auth-response.interface';

export interface AuthAction extends Action {
  type: AuthActionType;
  payload: any;
}

export enum AuthActionType {
  LOGIN = '[Commons] Login',
  LOGOUT = '[Commons] Logout'
}

export function authReducer(state: AuthResponse = null, action: AuthAction) {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return action.payload;
    case AuthActionType.LOGOUT:
      return null;
    default:
      return state;
  }
}

export interface AuthState {
  auth: AuthResponse;
}

export const selectFeatureAuthState = createFeatureSelector<AuthState>('auth');
export const selectAuthState = createSelector(selectFeatureAuthState, (state: AuthState) => state.auth);

