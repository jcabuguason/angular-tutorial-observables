import { Injectable } from '@angular/core';
import { MDDescription } from '../object/metadata/MDDescription';

@Injectable()
export class MDDescriptionParser {

    static parse(raw): MDDescription {

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
    }
}
