import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class StationInfoService {

  stationName: string;
  province: string;
  network: string;
  climateID: string;
  tcID: string;
  wmoID: string;
  latitude: string;
  longitude: string;
  elevation: string;

    constructor() {
    }

    setStation(station: object) {

      const parsed: Station = <Station> station;

      for (const item of parsed.member.Metadata.result.elements.element) {
        switch (item['@name']) {
          case 'station_name': {
            this.stationName = item['@value'];
            break;
          }
          case 'province': {
            this.province = item['@value'];
            break;
          }
          case 'network': {
            this.network = item['@value'];
            break;
          }
          case 'climate_identifier': {
            this.climateID = item['@value'];
            break;
          }
          case 'tc_identifier': {
            this.tcID = item['@value'];
            break;
          }
          case 'wmo_identifier': {
            this.wmoID = item['@value'];
            break;
          }
          case 'latitude': {
            this.latitude = item['@value'];
            break;
          }
          case 'longitude': {
            this.longitude = item['@value'];
            break;
          }
          case 'station_elevation': {
            this.elevation = item['@value'];
            break;
          }
        }
      }


    }

}

export interface Station {
  member: Member;
}

export interface Member {
  Metadata: Metadata;
}

export interface Metadata {
  metadata: ChildMetadata;
  result: Result;
}

export interface ChildMetadata {
  set: Set;
}

export interface Set {
  general: General;
  'identification-elements': string[];
}

export interface General {
  dataset: string;
  id: string;
  parent: string;
}

export interface Result {
  elements: Elements;
}

export interface Elements {
  element: Element[];
}

export interface Element {
  '@name': string;
  '@value': string;
  element: Element[];
}
