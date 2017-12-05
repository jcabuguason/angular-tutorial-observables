import { MDElementParser } from './md-element.parser';
import { ELEMENT_PARSER_INPUT, ELEMENT_PARSER_OUTPUT } from './parser-testing-constants';

describe('MDElementParser', () => {

  it('should return the correct value', () => {
    expect(MDElementParser.parse(ELEMENT_PARSER_INPUT)).toEqual(ELEMENT_PARSER_OUTPUT);
  });
});
