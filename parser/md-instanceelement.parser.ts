import { Injectable } from '@angular/core';
import { MDInstanceElement } from '../object/metadata/MDInstanceElement';

@Injectable()
export class MDInstanceElementParser {

  static parse(raw): MDInstanceElement {
    const instelements: MDInstanceElement[] = [];
    if (raw['element'] !== undefined) {
      [].concat(raw['element']).forEach(e => instelements.push(MDInstanceElementParser.parse(e)));
    }

    let english;
    let french;
    if (raw['language'] !== undefined) {
      english = raw['language'].find(l => l['@name'] === 'en')['@value']
      french = raw['language'].find(l => l['@name'] === 'fr')['@value']
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
