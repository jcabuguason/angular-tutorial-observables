export interface OMIGeneral {
  dataset: string;
  parent: string;
}

export interface OMIIdentification {
  reason_for_change: string;
  created_by: string;
  effective_start: string; // format: 'yyyy-MM-ddTHH:mm:ss.SSSZ', required
  effective_end?: string;
  active_flag?: boolean;
}

export interface OMIElement {
  element_name: string;
  element_group: string;
  element_uom: string;
  element_value?: string; // required - unless language sensitive and not an enum
  language_values?: LanguageValue[]; // required if language sensitive
  elements?: OMIElement[];
}

interface LanguageValue {
  language: string; // only en|fr required
  value: string;
}

interface Relationship {
  relationship_name: string;
  relationship_value: string; // required, maybe url
  elements?: OMIElement[];
}

export interface OutgoingMetadataInstance {
  general: OMIGeneral;
  identification: OMIIdentification;
  elements: OMIElement[]; // depends on definition
  relationships?: Relationship[];
}
