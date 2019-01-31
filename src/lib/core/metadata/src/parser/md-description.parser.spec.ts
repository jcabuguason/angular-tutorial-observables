import { MDDescriptionParser } from './md-description.parser';
import { DESCRIPTION_PARSER_INPUT, DESCRIPTION_PARSER_OUTPUT } from './parser-testing-constants';

describe('MDDescriptionParser', () => {
  it('should return the correct value', () => {
    expect(MDDescriptionParser.parse(DESCRIPTION_PARSER_INPUT)).toEqual(DESCRIPTION_PARSER_OUTPUT);
  });
});
