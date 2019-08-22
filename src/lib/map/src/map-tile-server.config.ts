import { InjectionToken } from '@angular/core';
export interface MapTileServerConfig {
  endpoint: string;
}
export const MAP_TILE_SERVER_CONFIG = new InjectionToken<MapTileServerConfig>('map-tile-server.config');
