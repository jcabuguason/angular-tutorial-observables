import { Injectable, Inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { MAP_TILE_SERVER_CONFIG, MapTileServerConfig } from './map-tile-server.config';
import { LayerTypes } from './model/layer-types.model';

import XYZ from 'ol/source/XYZ';

@Injectable()
export class MapService {
  public layer$ = new BehaviorSubject<LayerTypes>(LayerTypes.OSM);
  public recenter$ = new Subject<any>();

  private osmSource: XYZ;
  private topographicSource: XYZ;

  constructor(
    @Inject(MAP_TILE_SERVER_CONFIG)
    private config: MapTileServerConfig
  ) {
    this.osmSource = new XYZ({
      url: `${this.config.endpoint}/osm/{z}/{x}/{y}.png`,
      crossOrigin: 'anonymous',
    });
    this.topographicSource = new XYZ({
      url: `${this.config.endpoint}/topo/{z}/{x}/{y}.png`,
      crossOrigin: 'anonymous',
    });
  }

  updateLayer = layer => this.layer$.next(layer);
  recenter = extent => this.recenter$.next(extent);

  getOsmSource = () => this.osmSource;
  getTopographicSource = () => this.topographicSource;
}
