import { Injectable } from '@angular/core';
import { MDInstanceDefinition } from '../model/MDInstanceDefinition';
import { IdentificationElement } from '../model/IdentificationElement';
import { MDInstanceElement } from '../model/MDInstanceElement';
import { MDInstanceElementParser } from './md-instanceelement.parser';
import { MDIdentificationElementParser } from '../parser/metadata-identification.parser';
import { ParseError } from '../error/ParseError';

@Injectable()
export class MDInstanceDefinitionParser {

  static parse(raw): MDInstanceDefinition {

    let ieJSON;
    let eJSON;
    let datasetJSON;
    let parentJSON;
    try {
      ieJSON = raw['member']['Metadata']['metadata']['set']['identification-elements']['identification-element'];
      eJSON = raw['member']['Metadata']['result']['elements']['element'];
      datasetJSON = raw['member']['Metadata']['metadata']['set']['general']['dataset']['@name'];
      parentJSON = raw['member']['Metadata']['metadata']['set']['general']['parent']['@href'];
    }
    catch (error) {
      if (error instanceof TypeError) {
        throw new ParseError('Metadata definition is incomplete: ' + raw + '\n\t' + error);
      }
      else {
        throw error;
      }
    }

    const identificationElements: IdentificationElement[] = [];
    const instelements: MDInstanceElement[] = [];
    try {
      for (const ie of ieJSON) {
        identificationElements.push(MDIdentificationElementParser.parse(ie));
      }
      for (const e of eJSON) {
        instelements.push(MDInstanceElementParser.parse(e));
      }
    }
    catch (error) {
      throw error;
    }

    const definition: MDInstanceDefinition = {
      dataset: datasetJSON,
      parent: parentJSON,
      identificationElements: identificationElements,
      elements: instelements
    };

    return definition;
  }
}
