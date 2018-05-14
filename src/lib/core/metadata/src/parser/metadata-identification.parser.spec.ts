import { MDIdentificationElementParser } from './metadata-identification.parser';
import { IDENTIFICATION_ELEMENTS_PARSER_INPUT, IDENTIFICATION_ELEMENTS_PARSER_OUTPUT} from './parser-testing-constants';

describe('MDIdentificationElementParser', () => {

  it('should return the correct value', () => {
    expect(MDIdentificationElementParser.parse(IDENTIFICATION_ELEMENTS_PARSER_INPUT)).toEqual(
      IDENTIFICATION_ELEMENTS_PARSER_OUTPUT);
  });
});
