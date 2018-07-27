export class SearchModel {
  constructor (
    public taxonomy: string[],
    public elements: SearchElement[],
    public from?: Date,
    public to?: Date,
    public size?: number,
    public operator?: string,
    public sortFields?: string,
  ) { }
}

export class SearchElement {
  constructor (
    public elementID: string,
    public elementType: 'dataElements' | 'metadataElements',
    // could be 'value', 'unit', 'overallQASummary', etc
    public valueType?: string,
    // the actual value
    public value?: string,
  ) { }
  // used by ES
  elementToString(): string {
    let result = 'elementID=' + this.elementID + '|type=' + this.elementType;
    if (this.valueType != null && this.value != null) {
      result += '|' + this.valueType + '=' + this.value;
    }
    return result;
  }
}

// Searchable metadataElements
export const SearchableElement = {
  STATION_NAME: { id: '1.7.83.0.0.0.0' },
  PROVINCE:     { id: '1.7.117.0.0.0.0' },
  STATION_TYPE: {
    TC_ID:   { id: '1.7.84.0.0.0.0', regex: /^[a-zA-Z]{3}$/ },
    WMO_ID:  { id: '1.7.82.0.0.0.0', regex: /^[0-9]{5}$/ },
    MSC_ID:  { id: '1.7.86.0.0.0.0', regex: /^[a-zA-Z0-9]{7}$/ },
    ICAO_ID: { id: '1.7.102.0.0.0.0', regex: /^[a-zA-Z]{4}$/ },
  }
};
