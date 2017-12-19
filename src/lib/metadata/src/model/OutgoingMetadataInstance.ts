export interface OMIGeneral {
  dataset: string;
  parent: string;
}

export interface OMIIdentification {
  reason_for_change: string;
  created_by: string;
  effective_start: string;
  effective_end?: string;
  active_flag?: boolean;
}

export interface OMIElement {
  element_name: string;
  element_group: string;
  element_uom: string;
  element_value?: string;
  language_values?: LanguageValue[];
  elements?: OMIElement[];
}

export interface LanguageValue {
  language: string;
  value: string;
}

export interface Relationship {
  relationship_name: string;
  relationship_value: string;
  elements?: OMIElement[];
}

export interface OutgoingMetadataInstance {
  general: OMIGeneral;
  identification: OMIIdentification;
  elements: OMIElement[];
  relationships?: Relationship[];
}
