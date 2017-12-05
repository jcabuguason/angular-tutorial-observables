import { MDDefinitionParser } from './md-definition.parser';
import { DEFINITION_PARSER_INPUT, DEFINITION_PARSER_OUTPUT } from './parser-testing-constants';

describe('MDDefinitionParser', () => {

  it('should return the correct value', () => {
    expect(MDDefinitionParser.parse(DEFINITION_PARSER_INPUT)).toEqual(DEFINITION_PARSER_OUTPUT);
  });
});
