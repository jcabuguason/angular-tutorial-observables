import { Injectable } from '@angular/core';
import { MDDefinition } from '../object/metadata/MDDefinition';
import { IdentificationElement } from '../object/metadata/IdentificationElement';
import { MDElement } from '../object/metadata/MDElement';
import { MDElementParser } from '../parser/md-element.parser';
import { MDIdentificationElementParser } from '../parser/metadata-identification.parser';

@Injectable()
export class MDDefinitionParser {

  static parse(raw): MDDefinition {

    const identificationElements: IdentificationElement[] = [];
    const ieJSON = raw['member']['Metadata']['metadata']['set']['identification-elements']['identification-element'];
    for (const ie of ieJSON) {
      identificationElements.push(MDIdentificationElementParser.parse(ie));
    }

    const elements: MDElement[] = [];
    const eJSON = raw['member']['Metadata']['result']['elements']['element'];
    for (const e of eJSON) {
      elements.push(MDElementParser.parse(e));
    }

    const definition: MDDefinition = {
      dataset: raw['member']['Metadata']['metadata']['set']['general']['dataset']['@name'],
      id: raw['member']['Metadata']['metadata']['set']['general']['id']['@href'],
      identificationElements: identificationElements,
      elements: elements
    };

    return definition;
  }
}
