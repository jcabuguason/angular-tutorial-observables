import { SearchParameter } from './search-parameter';
import { ChoiceModel } from '../model/choice.model';

describe('SearchParameter', () => {
  const choices = [
    new ChoiceModel('mscLabel', 'mscValue', 'mscUri', 'mscTooltip'),
    new ChoiceModel('dndLabel', 'dndValue', 'dndUri'),
    new ChoiceModel('ncLabel', 'ncValue', 'ncUri'),
  ];

  describe('general functions', () => {
    let param: SearchParameter;
    let paramRestricted: SearchParameter;

    beforeEach(() => {
      param = new SearchParameter({ name: 'param', choices: choices });
      paramRestricted = new SearchParameter({ name: 'param', choices: choices, restricted: true });
    });

    it('should check if can add value', () => {
      expect(param.canAddSelected('mscLabel')).toBeTruthy();
      expect(param.canAddSelected('MSC')).toBeTruthy();
      expect(param.canAddSelected('123')).toBeTruthy();
    });

    it('should check for empty values', () => {
      expect(param.canAddSelected('')).toBeFalsy();
      expect(paramRestricted.canAddSelected('')).toBeFalsy();
    });

    it('should trim space if it exists before/after value', () => {
      expect(param.canAddSelected(' ')).toBeFalsy();
      expect(param.canAddSelected(' msc ')).toBeTruthy();

      expect(param.addSelected(' msc '));
      expect(param.selected).toEqual(['msc']);
    });

    it('should prevent adding same value again', () => {
      param.addSelected('mscLabel');
      expect(param.canAddSelected('mscLabel')).toBeFalsy();

      paramRestricted.addSelected('dndLabel');
      expect(paramRestricted.canAddSelected('dndLabel')).toBeFalsy();
    });

    it('should check if can add value (limited choice)', () => {
      expect(paramRestricted.canAddSelected('dndLabel')).toBeTruthy();
      expect(paramRestricted.canAddSelected('123')).toBeFalsy();
    });

    it('should remove all values', () => {
      param.addSelected('mscLabel');
      expect(param.getSelected()).toEqual(['mscLabel']);
      param.resetAllSelected();
      expect(param.getSelected()).toEqual([]);
    });
  });

  describe('using default values option', () => {
    let param: SearchParameter;

    beforeEach(() => {
      param = new SearchParameter({ name: 'param', choices: choices, defaultSelectedLabels: ['dndLabel'] });
    });

    it('should use default values', () => {
      expect(param.getSelected()).toEqual(['dndLabel']);
      expect(param.getSelectedModels()).toEqual([choices[1]]);
    });

    it('should remove all values', () => {
      param.resetAllSelected();
      expect(param.getSelected()).toEqual([]);
    });

    it('should reset values to default', () => {
      param.addSelected('ncLabel');
      expect(param.getSelected()).toEqual(['dndLabel', 'ncLabel']);
      param.resetAllSelected(true);
      expect(param.getSelected()).toEqual(['dndLabel']);
    });
  });
});
