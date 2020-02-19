import { IncludeExclude } from './include-exclude.class';

describe('IncludeExclude', () => {
  it('Test no include/exclude lists', () => {
    const blankInclExcl = new IncludeExclude([], []);
    expect(blankInclExcl.checkIncludeExclude('1.2.3.4.5.6.1')).toBeTruthy();
  });

  describe('Test with include list only', () => {
    const onlyIncl = new IncludeExclude(['^1.2.3.*', '9.9.3.4.5.6.7'], []);

    it('Test elements that should be included', () => {
      expect(onlyIncl.checkIncludeExclude('1.2.3.4.5.6.2')).toBeTruthy();
      expect(onlyIncl.checkIncludeExclude('9.9.3.4.5.6.7')).toBeTruthy();
    });

    it('Test elements that should be excluded', () => {
      expect(onlyIncl.checkIncludeExclude('1.2.8.4.5.6.3')).toBeFalsy();
      expect(onlyIncl.checkIncludeExclude('1.2.30.4.5.6.7')).toBeFalsy();
      expect(onlyIncl.checkIncludeExclude('0.0.1.2.3.0.0')).toBeFalsy();
      expect(onlyIncl.checkIncludeExclude('0.0.11.2.30.0.0')).toBeFalsy();
      expect(onlyIncl.checkIncludeExclude('7.6.5.4.3.2.1')).toBeFalsy();
    });
  });

  describe('Test with exclude list only', () => {
    const onlyExcl = new IncludeExclude([], ['^1.2.3.*', '5.5.3.4.5.6.7']);

    it('Test elements that should be included', () => {
      expect(onlyExcl.checkIncludeExclude('1.2.8.4.5.6.4')).toBeTruthy();
      expect(onlyExcl.checkIncludeExclude('1.2.30.4.5.6.7')).toBeTruthy();
      expect(onlyExcl.checkIncludeExclude('0.0.1.2.3.0.0')).toBeTruthy();
      expect(onlyExcl.checkIncludeExclude('0.0.11.2.30.0.0')).toBeTruthy();
      expect(onlyExcl.checkIncludeExclude('7.6.5.4.3.2.1')).toBeTruthy();
    });

    it('Test elements that should be excluded', () => {
      expect(onlyExcl.checkIncludeExclude('1.2.3.4.5.6.5')).toBeFalsy();
      expect(onlyExcl.checkIncludeExclude('5.5.3.4.5.6.7')).toBeFalsy();
    });
  });

  describe('Test with both include/exclude lists', () => {
    const inclExcl = new IncludeExclude(['^1.2.*', '9.9.3.4.5.6.7'], ['^1.2.3.*', '5.5.3.4.5.6.7']);

    it('Test elements that should be included', () => {
      expect(inclExcl.checkIncludeExclude('1.2.8.4.5.6.6')).toBeTruthy();
      expect(inclExcl.checkIncludeExclude('1.2.30.4.5.6.6')).toBeTruthy();
      expect(inclExcl.checkIncludeExclude('9.9.3.4.5.6.7')).toBeTruthy();
    });

    it('Test elements that should be excluded', () => {
      expect(inclExcl.checkIncludeExclude('1.2.3.4.5.6.7')).toBeFalsy();
      expect(inclExcl.checkIncludeExclude('5.5.3.4.5.6.7')).toBeFalsy();

      // other elements not stated explicitly in both lists should also be excluded
      expect(inclExcl.checkIncludeExclude('0.0.1.2.3.0.0')).toBeFalsy();
      expect(inclExcl.checkIncludeExclude('0.0.11.2.30.0.0')).toBeFalsy();
      expect(inclExcl.checkIncludeExclude('0.0.1.2.9.0.0')).toBeFalsy();
      expect(inclExcl.checkIncludeExclude('0.0.11.2.90.0.0')).toBeFalsy();
      expect(inclExcl.checkIncludeExclude('7.6.5.4.3.2.1')).toBeFalsy();
    });
  });
});
