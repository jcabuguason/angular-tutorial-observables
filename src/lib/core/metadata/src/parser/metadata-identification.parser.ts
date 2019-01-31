import { Injectable } from '@angular/core';
import { IdentificationElement } from '../model/IdentificationElement';

@Injectable()
export class MDIdentificationElementParser {
  static parse(raw): IdentificationElement {
    const identElement: IdentificationElement = {
      group: raw['@group'],
      name: raw['@name'],
      uom: raw['@uom'],
      value: raw['@value'],
    };
    return identElement;
  }
}
