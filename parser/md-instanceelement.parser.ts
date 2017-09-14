import { Injectable } from '@angular/core';
import { MDInstanceElement } from '../object/metadata/MDInstanceElement';

@Injectable()
export class MDInstanceElementParser {

  static parse(raw): MDInstanceElement {
    const instelements: MDInstanceElement[] = [];
    if (raw.element !== undefined) {
      [].concat(raw['element']).forEach(e => instelements.push(MDInstanceElementParser.parse(e)));
    }

    const instelement: MDInstanceElement = {
      def_id: raw['@def_id'],
      group: raw['@group'],
      id: raw['@id'],
      index: raw['@index'],
      name: raw['@name'],
      uom: raw['@uom'],
      value: raw['@value'],
      instelements: instelements
    };

    return instelement;
  }
}
