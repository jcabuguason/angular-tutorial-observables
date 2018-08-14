import { MDInstanceElementParser } from './md-instanceelement.parser';
import { INSTANCE_ELEMENT_PARSER_INPUT, INSTANCE_ELEMENT_PARSER_OUTPUT } from './parser-testing-constants';

describe('MDInstanceElementParser', () => {
  it('should return the correct value', () => {
    expect(MDInstanceElementParser.parse(INSTANCE_ELEMENT_PARSER_INPUT)).toEqual(INSTANCE_ELEMENT_PARSER_OUTPUT);
  });
});
