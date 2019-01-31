import { Injectable } from '@angular/core';
import { MDInstanceElement } from '../model/MDInstanceElement';
import { ParseError } from '../error/ParseError';

@Injectable()
export class MDInstanceElementParser {
  static parse(raw): MDInstanceElement {
    const instelements: MDInstanceElement[] = [];
    if (raw['element'] != null) {
      [].concat(raw['element']).forEach(e => instelements.push(MDInstanceElementParser.parse(e)));
    }

    let english;
    let french;
    if (raw['language'] != null) {
      const languageJSON = [].concat(raw['language']);
      try {
        english = languageJSON.find(l => l['@name'] === 'en');
        french = languageJSON.find(l => l['@name'] === 'fr');
        english = english != null ? english['@value'] : null;
        french = french != null ? french['@value'] : null;
      } catch (error) {
        throw new ParseError('Improper format of language values: ' + raw + '\n\t' + error);
      }
    }

    const instelement: MDInstanceElement = {
      def_id: raw['@def_id'],
      group: raw['@group'],
      id: raw['@id'],
      index: raw['@index'],
      name: raw['@name'],
      uom: raw['@uom'],
      value: raw['@value'],
      language: {
        english: english,
        french: french,
      },
      instelements: instelements,
    };

    return instelement;
  }
}
