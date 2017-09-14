import { metadataDefinitionReducer } from './metadata-definition.reducer';
import { metadataInstanceReducer } from './metadata-instance.reducer';

export const rootReducer = {
  metadataDefinition: metadataDefinitionReducer,
  metadataInstance: metadataInstanceReducer
};
