import { SearchDatetime } from './search-datetime';

describe('SearchDatetime', () => {
  let dateParam: SearchDatetime;

  beforeEach(() => {
    dateParam = new SearchDatetime('dateParam', false);
  });

  it('should add specified date if valid', () => {
    const validDate = '2018-01-02T13:14';
    const invalidDate = '201801021314';

    expect(dateParam.canAddSelected(invalidDate)).toBeFalsy();
    expect(dateParam.canAddSelected(null)).toBeFalsy();
    expect(dateParam.canAddSelected('')).toBeFalsy();
    expect(dateParam.canAddSelected(validDate)).toBeTruthy();

    dateParam.addSelected(validDate);
    expect(dateParam.datetime).toEqual(new Date(validDate));
  });

  it('should get formatted datetime', () => {
    const date = '2018-01-02T03:04';
    dateParam.addSelected(new Date(date));
    expect(dateParam.getDatetimeUrlFormat()).toEqual(date);
  });

  it('should return empty string for formatted datetime', () => {
    expect(dateParam.getDatetimeUrlFormat()).toEqual('');
  });
});
