import { Injectable } from '@angular/core';
import { MDInstanceElement } from '../model/MDInstanceElement';
import { ParseError } from '../error/ParseError';

@Injectable()
export class MDInstanceElementParser {

  static parse(raw): MDInstanceElement {
    const instelements: MDInstanceElement[] = [];
    if (raw['element'] !== undefined) {
      [].concat(raw['element']).forEach(e => instelements.push(MDInstanceElementParser.parse(e)));
    }

    let english;
    let french;
    const languageJSON = [].concat(raw['lanaguage']);
    try {
      english = raw['language'].find(l => l['@name'] === 'en')['@value'];
      french = raw['language'].find(l => l['@name'] === 'fr')['@value'];
    }
    catch (error) {
      throw new ParseError('Improper format of description: ' + raw + '\n\t' + error);
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
        french: french
      },
      instelements: instelements
    };

    return instelement;
  }
}
