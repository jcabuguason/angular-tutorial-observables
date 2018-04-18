import { MDInstanceElementParser } from './md-instanceelement.parser';
import { INSTANCE_ELEMENT_PARSER_INPUT, INSTANCE_ELEMENT_PARSER_OUTPUT } from './parser-testing-constants';

describe('MDInstanceElementParser', () => {
  // Broken Test
  // wrong expected field types (index), missing languages section
  // Commenting out, this prevents test window from opening
  /*
  it('should return the correct value', () => {
    expect(MDInstanceElementParser.parse(INSTANCE_ELEMENT_PARSER_INPUT)).toEqual(INSTANCE_ELEMENT_PARSER_OUTPUT);
  });
  */

  it('will fail', () => {
    // Also fix filename 'md-instanceelement'
    fail('Fix and re-enable the parser test before removing this auto-fail');
  });
});
