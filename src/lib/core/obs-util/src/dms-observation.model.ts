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
  rawHeader: string;
  rawMessage: string;
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
  elementID: string;
  value: string;
  valueNum?: number;
  unit: string;
  codeSrc?: string;
  codeType?: string;
  type?: 'metadata' | 'element';
  dataType?: 'official' | 'derived';
  overallQASummary?: number;
  overallInstrumentSummary?: number;
  suppInfoDataFlags?: string[];
  elementIndex?: string;
  group?: string;
  indexName?: string;
  indexValue?: number;
  origName?: string;
  origValue?: string;
  statusIndicatorQcRemarkEffectiveDate?: string;
  statusIndicatorQcRemark?: string;
  statusIndicatorQcRemarkAccount?: string;
  statusIndicatorValueOverride?: number;
  statusIndicatorQaFlagOverride?: number;
  // These unit/value fields are getting a little out-of-hand IMO
  // Should these be put into a sub-type? i.e. `valueModifications?: ElemenModifications`?
  preciseValue?: string;
  preciseUnit?: string;
  preferredValue?: string;
  preferredUnit?: string;
  displayFormat?: string;
  formattedValue?: string;
}

export interface Location {
  type: string;
  coordinates: string;
}
