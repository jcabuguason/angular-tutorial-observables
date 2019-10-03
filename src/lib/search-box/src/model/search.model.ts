import {
  ICAO_ID_ELEMENT,
  MSC_ID_ELEMENT,
  PROVINCE_ELEMENT,
  STATION_NAME_ELEMENT,
  TC_ID_ELEMENT,
  WMO_ID_ELEMENT
} from 'msc-dms-commons-angular/core/obs-util';

export class SearchModel {
  constructor(
    public taxonomy: string[],
    public elements: SearchElement[],
    public from?: Date,
    public to?: Date,
    public size?: number,
    public operator?: string,
    public sortFields?: string,
    public queryType?: string
  ) { }
}

export class SearchElement {
  constructor(
    public elementID: string,
    public elementType: 'dataElements' | 'metadataElements',
    // could be 'value', 'unit', 'overallQASummary', etc
    public valueType?: string,
    // the actual value
    public value?: string
  ) { }
  // used by ES
  elementToString(): string {
    const basicQuery = `elementID=${this.elementID}|type=${this.elementType}`;
    const valueQuery = (this.valueType != null && this.value != null) ? `|${this.valueType}=${this.value}` : '';
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
