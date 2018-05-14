import { Injectable } from '@angular/core';
import { MDDescription } from '../model/MDDescription';
import { ParseError } from '../error/ParseError';

@Injectable()
export class MDDescriptionParser {

  static parse(raw): MDDescription {

    try {
      const language = [].concat(raw['language']);

      let english = null;
      if (language.find(obj => obj['@name'] === 'en')) {
        english = language.find(obj => obj['@name'] === 'en')['@value'];
      }

      let french = null;
      if (language.find(obj => obj['@name'] === 'fr')) {
        french = language.find(obj => obj['@name'] === 'fr')['@value'];
      }

      const element: MDDescription = { english, french };

      return element;

    } catch (error) {
      throw new ParseError('Improper format of description: ' + raw + '\n\t' + error);
    }
  }
}
