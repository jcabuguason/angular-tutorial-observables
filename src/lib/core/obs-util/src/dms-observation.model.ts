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

export interface DMSObs {
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
  metadataElements: MetadataElements[];
  dataElements: DataElements[];
}

export interface Author {
  build: string;
  name: string;
  version: number;
}

export interface DataElements {
  name: string;
  value: string;
  unit: string;
  elementID: string;
  overallQASummary?: number;
  indexValue?: number;
  index?: IndexDetails;
  preciseValue?: string;
  preciseUnit?: string;
  preferredValue?: string;
  preferredUnit?: string;
}

export interface Location {
  type: string;
  coordinates: string;
}

export interface MetadataElements {
  name: string;
  value: string;
  unit: string;
  elementID: string;
  preciseValue?: string;
  preciseUnit?: string;
  preferredValue?: string;
  preferredUnit?: string;
}

export interface RawMessage {
  header: string;
  message: string;
}

export interface IndexDetails {
  name: string;
  value: number;
}
