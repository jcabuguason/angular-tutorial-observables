import { SearchParameter } from './search-parameter';

describe('SearchParameter', () => {
  let param: SearchParameter;
  let paramRestricted: SearchParameter;

  const choices = ['msc', 'dnd', 'nc'];

  beforeEach(() => {
    param = new SearchParameter('param', choices, false, false);
    paramRestricted = new SearchParameter('param', choices, true, false);
  });

  it('should check if can add value', () => {
    expect(param.canAddSelected('msc')).toBeTruthy();
    expect(param.canAddSelected('MSC')).toBeTruthy();
    expect(param.canAddSelected('123')).toBeTruthy();
  });

  it('should prevent adding same value again', () => {
    param.addSelected('msc');
    expect(param.canAddSelected('msc')).toBeFalsy();

    paramRestricted.addSelected('dnd');
    expect(paramRestricted.canAddSelected('dnd')).toBeFalsy();
  });

  it('should check if can add value (limited choice)', () => {
    expect(paramRestricted.canAddSelected('dnd')).toBeTruthy();
    expect(paramRestricted.canAddSelected('123')).toBeFalsy();
  });

  it('should return filtered suggestions', () => {
    param.filterSuggestions({'query': 'C'});
    expect(param.filteredSuggestions).toEqual(['msc', 'nc']);

    param.filterSuggestions({'query': 'msc'});
    expect(param.filteredSuggestions).toEqual(['msc']);
  });

});
