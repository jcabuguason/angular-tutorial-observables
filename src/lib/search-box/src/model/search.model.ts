import {
  ICAO_ID_ELEMENT,
  MSC_ID_ELEMENT,
  PROVINCE_ELEMENT,
  STATION_NAME_ELEMENT,
  TC_ID_ELEMENT,
  WMO_ID_ELEMENT,
} from 'msc-dms-commons-angular/core/obs-util';
import { HttpParams } from '@angular/common/http';
import { ESOperator, ESSortType, ESQueryType } from 'msc-dms-commons-angular/core/elastic-search';

export interface SearchModel {
  // information to send to ES
  taxonomy: string[];
  elements: SearchElement[];
  from?: Date;
  to?: Date;
  size?: number;
  operator?: ESOperator;
  sortFields?: ESSortType;
  queryType?: ESQueryType;
  // HttpParams created from the search parameters
  httpParams?: HttpParams;
}

export class SearchElement {
  constructor(
    public elementID: string,
    public elementType: 'dataElements' | 'metadataElements',
    // could be 'value', 'unit', 'overallQASummary', etc
    public valueType?: string,
    // the actual value
    public value?: string,
  ) {}
  // used by ES
  elementToString(): string {
    const basicQuery = `elementID=${this.elementID}|type=${this.elementType}`;
    const valueQuery = this.valueType != null && this.value != null ? `|${this.valueType}=${this.value}` : '';
    return `${basicQuery}${valueQuery}`;
  }
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
