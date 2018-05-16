import { MDInstanceDefinitionParser } from './metadata-instance-definition.parser';
import { INSTANCE_DEFINITION_PARSER_INPUT, INSTANCE_DEFINITION_PARSER_OUTPUT } from './parser-testing-constants';

describe('MDInstanceDefinitionParser', () => {
  // Broken Test
  // missing expected fields for `elements: MDInstanceElement[];` like `languages`
  // Commenting out, this prevents test window from opening
  it('should return the correct value', () => {
    fail('Issues with index between int value from MR and string value in angular');
    // expect(MDInstanceDefinitionParser.parse(INSTANCE_DEFINITION_PARSER_INPUT)).toEqual(INSTANCE_DEFINITION_PARSER_OUTPUT);
  });

});
