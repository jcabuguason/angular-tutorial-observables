/**
 * Created by Joey Chan on 06/15/2017
 */

import { MDDescription } from './MDDescription';

export interface MDElement {
    format: string;
    group: string;
    id: string;
    index: number;
    languageSensitive: boolean;
    max: string;
    min: string;
    name: string;
    uom: string;
    value: string;
    description: MDDescription;
    displayName: MDDescription;
    pattern?: string;
    enums?: string[];
    elements?: MDElement[];
    requiredLanguages?: { 
        english: boolean;
        french: boolean;
    };
}
