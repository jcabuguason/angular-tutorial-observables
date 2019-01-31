import { Injectable } from '@angular/core';

import { MDElement } from '../model/MDElement';
import { MDDescriptionParser } from '../parser/md-description.parser';
import { ParseError } from '../error/ParseError';
import { MDEnum } from '../model/MDEnum';

@Injectable()
export class MDElementParser {
  static parse(raw): MDElement {
    try {
      const description = [].concat(raw['description']);
      const descriptionJSON = description.filter(obj => obj != null).find(obj => obj['@name'] === 'description');

      const displayNameJSON = description.filter(obj => obj != null).find(obj => obj['@name'] === 'display-name');

      let enums: MDEnum[] = [];
      if (raw.enum !== undefined) {
        enums = [].concat(raw['enum']).map(e => {
          const enumLang = [].concat(e['language']).filter(lang => lang != null);
          const enumEnglish = enumLang.find(lang => lang['@name'] === 'en');
          const enumFrench = enumLang.find(lang => lang['@name'] === 'fr');
          return {
            value: e['@value'],
            english: enumEnglish == null ? null : enumEnglish['@value'],
            french: enumFrench == null ? null : enumFrench['@value'],
          };
        });
      }

      const elements: MDElement[] = [];
      if (raw.element !== undefined) {
        [].concat(raw['element']).forEach(e => elements.push(MDElementParser.parse(e)));
      }

      let english: boolean;
      let french: boolean;
      if (raw['required-language'] !== undefined) {
        const requiredLanguages = [].concat(raw['required-language']).map(lang => lang['@name']);
        english = requiredLanguages.indexOf('en') !== -1;
        french = requiredLanguages.indexOf('fr') !== -1;
      }

      const element: MDElement = {
        format: raw['@format'],
        group: raw['@group'],
        id: raw['@id'],
        index: raw['@index'],
        languageSensitive: raw['@language-sensitive'] === 'true' ? true : false,
        max: String(raw['@max']),
        min: String(raw['@min']),
        name: raw['@name'],
        uom: raw['@uom'],
        value: raw['@value'],
        description: descriptionJSON ? MDDescriptionParser.parse(descriptionJSON) : null,
        displayName: displayNameJSON ? MDDescriptionParser.parse(displayNameJSON) : null,
        pattern: raw['@pattern'],
        enums: enums,
        elements: elements,
        requiredLanguages: {
          english: english,
          french: french,
        },
      };

      return element;
    } catch (error) {
      throw new ParseError('Improper format of element: ' + JSON.stringify(raw) + '\n\t' + error);
    }
  }
}
