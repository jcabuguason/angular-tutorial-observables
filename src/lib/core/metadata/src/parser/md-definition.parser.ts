import { Injectable } from '@angular/core';
import { MDDefinition } from '../model/MDDefinition';
import { IdentificationElement } from '../model/IdentificationElement';
import { MDElement } from '../model/MDElement';
import { MDElementParser } from '../parser/md-element.parser';
import { MDIdentificationElementParser } from '../parser/metadata-identification.parser';
import { ParseError } from '../error/ParseError';

@Injectable()
export class MDDefinitionParser {

  static parse(raw): MDDefinition {

    let ieJSON;
    let eJSON;
    let dataset;
    let id;
    try {
      ieJSON = raw['member']['Metadata']['metadata']['set']['identification-elements']['identification-element'];
      eJSON = raw['member']['Metadata']['result']['elements']['element'];
      dataset = raw['member']['Metadata']['metadata']['set']['general']['dataset']['@name'];
      id = raw['member']['Metadata']['metadata']['set']['general']['id']['@href'];
    } catch (error) {
      if (error instanceof TypeError) {
        throw new ParseError('Metadata definition is incomplete: ' + raw + '\n\t' + error);
      } else {
        throw error;
      }
    }

    const identificationElements: IdentificationElement[] = [];
    const elements: MDElement[] = [];
    try {
      for (const ie of ieJSON) {
        identificationElements.push(MDIdentificationElementParser.parse(ie));
      }
      for (const e of eJSON) {
        elements.push(MDElementParser.parse(e));
      }
    } catch (error) {
      throw error;
    }

    const definition: MDDefinition = {
      dataset: dataset,
      id: id,
      identificationElements: identificationElements,
      elements: elements
    };

    return definition;
  }
}
