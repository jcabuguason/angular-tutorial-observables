import { Injectable } from '@angular/core';
import { MDInstanceDefinition } from '../object/metadata/MDInstanceDefinition';
import { IdentificationElement } from '../object/metadata/IdentificationElement';
import { MDInstanceElement } from '../object/metadata/MDInstanceElement';
import { MDInstanceElementParser } from './md-instanceelement.parser';
import { MDIdentificationElementParser } from '../parser/metadata-identification.parser';

@Injectable()
export class MDInstanceDefinitionParser {

  static parse(raw): MDInstanceDefinition {

    const identificationElements: IdentificationElement[] = [];
    const ieJSON = raw['member']['Metadata']['metadata']['set']['identification-elements']['identification-element'];
    for (const ie of ieJSON) {
      identificationElements.push(MDIdentificationElementParser.parse(ie));
    }

    const instelements: MDInstanceElement[] = [];
    const eJSON = raw['member']['Metadata']['result']['elements']['element'];
    for (const e of eJSON) {
      instelements.push(MDInstanceElementParser.parse(e));
    }

    const definition: MDInstanceDefinition = {
      dataset: raw['member']['Metadata']['metadata']['set']['general']['dataset']['@name'],
      parent: raw['member']['Metadata']['metadata']['set']['general']['parent']['@href'],
      identificationElements: identificationElements,
      elements: instelements
    };

    return definition;
  }
}
