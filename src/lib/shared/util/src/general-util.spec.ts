import * as generalUtil from './general-util.class';

describe('GeneralUtil', () => {
  describe('#modifiedOrBlank', () => {
    it('should return modified string', () => {
      expect(generalUtil.modifiedOrBlank('input', (str) => str.toUpperCase())).toBe('INPUT');
      expect(generalUtil.modifiedOrBlank(1, (str) => `, ${str}`)).toBe(', 1');
    });

    it('should return empty string', () => {
      expect(generalUtil.modifiedOrBlank(null, (str) => `, ${str}`)).toBe('');
      expect(generalUtil.modifiedOrBlank('', (str) => `, ${str}`)).toBe('');
    });
  });

  describe('#range', () => {
    it('should return elements in specified range', () => {
      const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
      const output = generalUtil.range(3, 5).map((index) => letters[index]);
      expect(output).toEqual(['d', 'e', 'f']);
    });
  });

  describe('#copyToClipboard', () => {
    it('should execute copy command', () => {
      spyOn(document, 'execCommand');
      generalUtil.copyToClipboard('message');
      expect(document.execCommand).toHaveBeenCalledWith('copy');
    });
  });

  describe('#valueOrDefault', () => {
    it('should return value', () => {
      expect(generalUtil.valueOrDefault('value', 'default')).toBe('value');
      expect(generalUtil.valueOrDefault(true, false)).toBeTruthy();
      expect(generalUtil.valueOrDefault(false, true)).toBeFalsy();
    });

    it('should return default value', () => {
      expect(generalUtil.valueOrDefault(null, 'default')).toBe('default');
      expect(generalUtil.valueOrDefault(undefined, 'default')).toBe('default');
      expect(generalUtil.valueOrDefault(null, false)).toBeFalsy();
      expect(generalUtil.valueOrDefault(null, true)).toBeTruthy();
    });
  });
});
