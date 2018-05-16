import { MDDescription } from './MDDescription';
import { MDEnum } from './MDEnum';

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
    enums?: MDEnum[];
    elements?: MDElement[];
    requiredLanguages?: {
        english: boolean;
        french: boolean;
    };
}
