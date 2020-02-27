const givenOrDefault = (given, defaultValue = null) => (given == null ? defaultValue : given);

export enum SeriesType {
  LINE = 'spline',
  BAR = 'column',
  AREA = 'area',
}

export enum QualifierType {
  NONE,
  HOURLY,
}

export class Station {
  label: string;
  value: string;
  identifierID?: string;
  group?: any;

  constructor(given: { label: string; value: string; identifierID?: string; group?: any }) {
    this.label = given.label;
    this.value = given.value;
    this.identifierID = givenOrDefault(given.identifierID);
    this.group = givenOrDefault(given.group);
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

  constructor(given: { id: string; seriesType?: SeriesType }) {
    this.id = given.id;
    this.seriesType = givenOrDefault(given.seriesType, SeriesType.LINE);
  }
}

export class Chart {
  stations: Station[];
  elements: Element[];
  qualifierType: QualifierType;

  constructor(given: { stations: Station[]; elements: Element[]; qualifierType?: QualifierType }) {
    this.stations = given.stations;
    this.elements = given.elements;
    this.qualifierType = givenOrDefault(given.qualifierType, QualifierType.NONE);
  }
}
