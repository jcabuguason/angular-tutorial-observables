export interface RawData {
  uri: string;
  stationName: string;
  stationID: string;
  tcID: string;
  date: string;
  tax: string;
  rawMessage: string;
}

export interface RawElement {
  position: number;
  value: string;
  suppressed?: boolean;
  active?: boolean;
  description?: string;
  name?: string;
}

export type RawMessage = RawElement[];
