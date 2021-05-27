import { HttpParams } from '@angular/common/http';
import { ESQueryChunk, ESSortType } from 'msc-dms-commons-angular/core/elastic-search';
import {
  ICAO_ID_ELEMENT,
  MSC_ID_ELEMENT,
  PROVINCE_ELEMENT,
  STATION_NAME_ELEMENT,
  TC_ID_ELEMENT,
  WMO_ID_ELEMENT,
} from 'msc-dms-commons-angular/core/obs-util';

export interface SearchModel {
  // information to send to ES
  taxonomy: string[];
  from?: Date;
  to?: Date;
  size?: number;
  sortFields?: ESSortType[];
  query?: ESQueryChunk[];
  checkboxes?: string[];
  trackTotalHits?: boolean;
  // HttpParams created from the search parameters
  httpParams?: HttpParams;
  // for metadata query performance, only specified elements should be returned
  elementsToReturn?: string[];
  isMetadata?: boolean;
}

// Searchable metadataElements
export const SearchableElement = {
  STATION_NAME: { id: STATION_NAME_ELEMENT },
  PROVINCE: { id: PROVINCE_ELEMENT },
  STATION_TYPE: {
    TC_ID: { id: TC_ID_ELEMENT, regex: /^[a-zA-Z]{3}$/ },
    WMO_ID: { id: WMO_ID_ELEMENT, regex: /^[0-9]{5}$/ },
    MSC_ID: { id: MSC_ID_ELEMENT, regex: /^[a-zA-Z0-9]{7}$/ },
    ICAO_ID: { id: ICAO_ID_ELEMENT, regex: /^[a-zA-Z]{4}$/ },
  },
};
