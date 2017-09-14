import { MetadataFormParser } from './metadata-form.parser';
import { MDDefinitionParser } from './md-definition.parser';
import { METADATA_FORM_PARSER_INPUT, METADATA_FORM_PARSER_INPUT_1,
  METADATA_FORM_PARSER_OUTPUT} from './parser-testing-constants';

describe('MetadataFormParser', () => {
  it('should return the correct value', () => {
    const definition = MDDefinitionParser.parse(METADATA_FORM_PARSER_INPUT_1);
    expect(MetadataFormParser.parseToOutgoing(METADATA_FORM_PARSER_INPUT, definition)).toEqual(
      METADATA_FORM_PARSER_OUTPUT);
  });
});
