/**
 * Created By Joey Chan on 06/14/2017
 */

import { IdentificationElement } from './IdentificationElement';
import { MDElement } from './MDElement';

export interface MDDefinition {
    dataset: string;
    id: string;
    identificationElements: IdentificationElement[];
    elements: MDElement[];
}
