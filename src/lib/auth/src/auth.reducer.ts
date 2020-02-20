import { Action, createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { AuthResponse } from './auth-response.interface';

export const authReducerKey = 'auth';

export interface AuthAction extends Action {
  type: AuthActionType;
  payload: any;
}

export enum AuthActionType {
  LOGIN = '[Auth] Login',
  LOGOUT = '[Auth] Logout',
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

export const selectFeatureAuthState: MemoizedSelector<object, AuthResponse> = createFeatureSelector<AuthResponse>(
  authReducerKey,
);
export const selectAuthState: MemoizedSelector<object, AuthResponse> = createSelector(
  selectFeatureAuthState,
  (state: AuthResponse) => (!!state ? state : null),
);
