import {
  ICAO_ID_ELEMENT,
  MSC_ID_ELEMENT,
  PROVINCE_ELEMENT,
  STATION_NAME_ELEMENT,
  TC_ID_ELEMENT,
  WMO_ID_ELEMENT,
} from 'msc-dms-commons-angular/core/obs-util';
import { HttpParams } from '@angular/common/http';
import { ESSortType, ESQueryChunk } from 'msc-dms-commons-angular/core/elastic-search';

export interface SearchModel {
  // information to send to ES
  taxonomy: string[];
  from?: Date;
  to?: Date;
  size?: number;
  sortFields?: ESSortType;
  query?: ESQueryChunk[];
  checkboxes?: string[];
  // HttpParams created from the search parameters
  httpParams?: HttpParams;
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
