import { InjectionToken } from '@angular/core';

export interface UnitCodeConversionConfig {
  endpoint: string;
}

export const UNIT_CODE_CONVERSION_CONFIG = new InjectionToken<UnitCodeConversionConfig>('unit-code-conversion.config');
