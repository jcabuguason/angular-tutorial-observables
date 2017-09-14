
import { IdentificationElement } from '../../object/metadata/IdentificationElement';
import { MDInstanceElement } from './MDInstanceElement';

export interface MDInstanceDefinition {
    dataset: string;
    parent: string;
    identificationElements: IdentificationElement[];
    elements: MDInstanceElement[];
}
