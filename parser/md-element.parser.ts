import { Injectable } from '@angular/core';
import { MDElement } from '../object/metadata/MDElement';
import { MDDescriptionParser } from '../parser/md-description.parser';

@Injectable()
export class MDElementParser {

    static parse(raw): MDElement {

        // TODO: description format changes for eaach metadata
        const description = [].concat(raw['description']);
        const descriptionJSON = description
            .find(obj => obj['@name'] === 'description');

        const displayNameJSON = description
            .find(obj => obj['@name'] === 'display-name');

        const enums: string[] = [];
        if (raw.enum !== undefined) {
            raw['enum'].forEach(e => enums.push(e['@value']));
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
                french: french
            }
        };

        return element;
    }
}
