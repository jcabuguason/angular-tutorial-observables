export interface DMSElementSummary {
  aggregations: Aggregations;
}

export interface Aggregations {
  dataElements: ESDataElements;
}

export interface ESDataElements {
  index: ElementIndex;
}

export interface ElementIndex {
  buckets: Buckets[];
}

export interface Buckets {
  key: string;
  maxIndex: Index;
  minIndex: Index;
}

export interface Index {
  value: number;
}

// Odd format requrired to support *both* dynamic and static keys in a defined type
// See https://stackoverflow.com/a/48422383
export type DMSObs = {
  identity: string; // URI
  identifier: string; // Primary station identifier
  taxonomy: string;
  obsDateTime: string; // TODO: Switch to moment.js datetime?
  location: Location;
  receivedDateTime: string;
  parentIdentity: string;
  author: Author;
  jsonVersion: string;
  rawMessage: RawMessage;
} & {
  [obsElements: string]: ObsElement[];
};

export interface Author {
  build: string;
  name: string;
  version: number;
}

export interface ObsElement {
  name: string;
  value: string;
  unit: string;
  elementID: string;
  type?: 'metadata' | 'element';
  dataType?: 'official' | 'derived';
  overallQASummary?: number;
  overallInstrumentSummary?: number;
  suppInfoDataFlags?: string[];
  statusIndicators?: StatusIndicators;
  indexName?: string;
  indexValue?: number;
  // These unit/value fields are getting a little out-of-hand IMO
  // Should these be put into a sub-type? i.e. `valueModifications?: ElemenModifications`?
  preciseValue?: string;
  preciseUnit?: string;
  preferredValue?: string;
  preferredUnit?: string;
  displayFormat?: string;
  formattedValue?: string;
}

export interface StatusIndicators {
  qcRemarkEffectiveDate: string;
  qcRemark: string;
  qcRemarkAccount: string;
  qaFlagOverride?: number;
  valueOverride?: number;
}

export interface Location {
  type: string;
  coordinates: string;
}

export interface RawMessage {
  header: string;
  message: string;
}
