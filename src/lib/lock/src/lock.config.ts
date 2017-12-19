import { InjectionToken } from '@angular/core';

export interface LockConfig {
  endpoint: string;
  coreTTL: number;
  applicationTTL: number;
  warning: number;
}

export const LOCK_CONFIG = new InjectionToken('lock.config');
