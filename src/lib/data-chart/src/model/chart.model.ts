const givenOrDefault = (given, defaultValue = null) => (given == null ? defaultValue : given);

export enum SeriesType {
  Line = 'spline',
  Bar = 'column',
  Area = 'area',
}

export enum QualifierType {
  None,
  Hourly,
}

export class Station {
  label: string;
  value: string;
  identifierID?: string;
  group?: any;
  stationInfo?: any;

  constructor(given: { label: string; value: string; identifierID?: string; group?: any; stationInfo?: any }) {
    this.label = given.label;
    this.value = given.value;
    this.identifierID = givenOrDefault(given.identifierID);
    this.group = givenOrDefault(given.group);
    this.stationInfo = givenOrDefault(given.stationInfo);
  }
}

export interface ElementOption {
  label: string;
  value: string;
  qualifierType: QualifierType;
}

export class Element {
  id: string;
  seriesType: SeriesType;
  useQaColor: boolean;

  constructor(given: { id: string; seriesType?: SeriesType; useQaColor?: boolean }) {
    this.id = given.id;
    this.seriesType = givenOrDefault(given.seriesType, SeriesType.Line);
    this.useQaColor = given.useQaColor;
  }
}

export class Chart {
  stations: Station[];
  elements: Element[];
  qualifierType: QualifierType;
  useQaColor: boolean;

  constructor(given: {
    stations: Station[];
    elements: Element[];
    qualifierType?: QualifierType;
    useQaColor?: boolean;
  }) {
    this.stations = given.stations;
    this.elements = given.elements;
    this.qualifierType = givenOrDefault(given.qualifierType, QualifierType.None);
    this.useQaColor = given.useQaColor;
  }
}
