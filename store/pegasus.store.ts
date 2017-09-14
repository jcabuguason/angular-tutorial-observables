import { MDDefinition } from '../object/metadata/MDDefinition';
import { MDInstanceDefinition } from '../object/metadata/MDInstanceDefinition';

export interface PegasusStore {
  metadataDefinition: MDDefinition;
  metadataInstance: MDInstanceDefinition;
}
