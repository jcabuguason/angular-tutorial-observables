import { MDInstanceDefinitionParser } from './metadata-instance-definition.parser';
import { INSTANCE_DEFINITION_PARSER_INPUT, INSTANCE_DEFINITION_PARSER_OUTPUT } from './parser-testing-constants';

describe('MDInstanceDefinitionParser', () => {

  it('should return the correct value', () => {
    expect(MDInstanceDefinitionParser.parse(INSTANCE_DEFINITION_PARSER_INPUT)).toEqual(INSTANCE_DEFINITION_PARSER_OUTPUT);
  });
});
