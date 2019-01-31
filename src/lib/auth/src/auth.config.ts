import { InjectionToken } from '@angular/core';

export interface AuthConfig {
  endpoint: string;
  getUserInfoEndpoint: string;
  logoutEndpoint: string;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>('auth.config');
