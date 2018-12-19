import { InjectionToken } from '@angular/core';

export interface MRMappingConfig {
  endpoint: string;
}

export const MR_MAPPING_CONFIG = new InjectionToken<MRMappingConfig>('mr-mapping.config');
