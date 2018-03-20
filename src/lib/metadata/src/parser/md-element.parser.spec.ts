import { MDElementParser } from './md-element.parser';
import { ELEMENT_PARSER_INPUT, ELEMENT_PARSER_OUTPUT } from './parser-testing-constants';

describe('MDElementParser', () => {
  // Broken Test
  // element parse adds in optional `requiredLanguages: {english: undefined, french: undefined}` field
  it('should return the correct value', () => {
    expect(MDElementParser.parse(ELEMENT_PARSER_INPUT)).toEqual(ELEMENT_PARSER_OUTPUT);
  });
});
