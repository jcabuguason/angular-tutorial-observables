import { InjectionToken } from '@angular/core';

export interface MetadataConfig {
  endpoint: string
}

export const METADATA_CONFIG = new InjectionToken('metadata.config');