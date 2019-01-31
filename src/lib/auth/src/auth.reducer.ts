import { Action, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { AuthResponse } from './auth-response.interface';

export interface AuthAction extends Action {
  type: AuthActionType;
  payload: any;
}

export enum AuthActionType {
  LOGIN = '[Commons] Login',
  LOGOUT = '[Commons] Logout',
}

const initialState: AuthResponse = {
  isUserAuthenticated: false,
  errorMesages: [],
  user_fullname: '',
  user_role: '',
  username: '',
};

export function authReducer(state: AuthResponse = initialState, action: AuthAction) {
  switch (action.type) {
    case AuthActionType.LOGIN:
      return action.payload;
    case AuthActionType.LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export interface AuthState {
  auth: AuthResponse;
}

export const selectFeatureAuthState = createFeatureSelector<AuthState>('auth');
export const selectAuthState = createSelector(
  selectFeatureAuthState,
  (state: AuthState) => (state ? state.auth : null)
);
