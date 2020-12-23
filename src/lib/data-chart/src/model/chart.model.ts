const givenOrDefault = (given, defaultValue = null) => (given == null ? defaultValue : given);

export enum SeriesType {
  Line = 'line',
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
  seriesOption?: SeriesOption;
  identifierID?: string;
  groups?: any[];
  stationInfo?: any;

  constructor(given: {
    label: string;
    value: string;
    identifierID?: string;
    groups?: any[];
    stationInfo?: any;
    seriesOption?: SeriesOption;
  }) {
    this.label = given.label;
    this.value = given.value;
    this.identifierID = givenOrDefault(given.identifierID);
    this.groups = givenOrDefault(given.groups, []);
    this.stationInfo = givenOrDefault(given.stationInfo);
    this.seriesOption = givenOrDefault(given.seriesOption, new SeriesOption({}));
  }
}
export class SeriesOption {
  seriesType: SeriesType;
  useQaColor: boolean;

  constructor(given: { seriesType?: SeriesType; useQaColor?: boolean }) {
    this.seriesType = givenOrDefault(given.seriesType, SeriesType.Line);
    this.useQaColor = givenOrDefault(given.useQaColor, false);
  }
}
export class Element {
  id?: string;
  seriesOption?: SeriesOption;
  label?: string;
  qualifierType?: QualifierType;
  showWarning?: boolean;

  constructor(given: {
    id: string;
    seriesOption?: SeriesOption;
    label?: string;
    qualifierType?: QualifierType;
    showWarning?: boolean;
  }) {
    this.id = given.id;
    this.seriesOption = givenOrDefault(given.seriesOption, new SeriesOption({}));
    this.label = given.label;
    this.qualifierType = givenOrDefault(given.qualifierType, 0);
    this.showWarning = givenOrDefault(given.showWarning, false);
  }
}

export class Chart {
  stations: Station[];
  elements: Element[];
  qualifierType: QualifierType;

  constructor(given: { stations: Station[]; elements: Element[]; qualifierType?: QualifierType }) {
    this.stations = given.stations;
    this.elements = given.elements;
    this.qualifierType = givenOrDefault(given.qualifierType, QualifierType.None);
  }
}
