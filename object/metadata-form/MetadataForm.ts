import { MDElement } from '../metadata/MDElement';

export interface MetadataForm {
  elements: MFElement[];
  reasonForChange: ValueGroup;
  effectiveStart: ValueGroup;
  effectiveEnd: ValueGroup;
}

export interface MFElement {
  multiple: MFMultiple[];
}

interface ValueGroup {
  value: string;
  timeTemp: string;
}

export interface MFMultiple {
  definitionID: string;
  uriParameter: number;
  elements: MFElement[];
  valueGroup: ValueGroup;
}
