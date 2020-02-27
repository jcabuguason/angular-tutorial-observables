import { SearchDatetime } from './search-datetime';

describe('SearchDatetime', () => {
  let dateParam: SearchDatetime;

  beforeEach(() => {
    dateParam = new SearchDatetime('dateParam', false);
  });

  it('should add date with string value', () => {
    const dateString = '2018-01-02T13:14Z';
    const formattedDatetime = '2018-01-02 13:14';
    const date = new Date(dateString);

    dateParam.addSelected(dateString);
    expect(dateParam.datetime).toEqual(formattedDatetime);
    expect(dateParam.getFullDatetime()).toEqual(date);

    dateParam.addSelected(dateString.replace('Z', ''));
    expect(dateParam.datetime).toEqual(formattedDatetime);
    expect(dateParam.getFullDatetime()).toEqual(date);

    dateParam.addSelected(dateString.replace('T', ' '));
    expect(dateParam.datetime).toEqual(formattedDatetime);
    expect(dateParam.getFullDatetime()).toEqual(date);
  });

  it('should add date with Date object', () => {
    const date = new Date('2018-01-02T13:14Z');
    dateParam.addSelected(date);
    expect(dateParam.datetime).toEqual('2018-01-02 13:14');
    expect(dateParam.getFullDatetime()).toEqual(date);
  });

  it('should add specified date if valid', () => {
    const validDate = '2018-01-02T13:14Z';
    const validDateFormatted = '2018-01-02 13:14';
    const invalidDate = '201801021314Z';

    expect(dateParam.canAddSelected(invalidDate)).toBeFalsy();
    expect(dateParam.canAddSelected(null)).toBeFalsy();
    expect(dateParam.canAddSelected('')).toBeFalsy();
    expect(dateParam.canAddSelected(validDate)).toBeTruthy();

    dateParam.addSelected(validDate);
    expect(dateParam.datetime).toEqual(validDateFormatted);
  });

  it('should get formatted datetime', () => {
    const date = '2018-01-02T03:04Z';
    const formatted = '2018-01-02T03:04';
    dateParam.addSelected(new Date(date));
    expect(dateParam.getDatetimeUrlFormat()).toEqual(formatted);
  });

  it('should return empty string for formatted datetime', () => {
    expect(dateParam.getDatetimeUrlFormat()).toEqual('');
  });

  describe('should get formatted datetime if time is not enabled', () => {
    it('given full datetime', () => {
      const date = '2020-01-01T00:00Z';
      const formatted = '2020-01-01T00:00';
      dateParam.enableTime(false);
      dateParam.addSelected(new Date(date));
      expect(dateParam.getDatetimeUrlFormat()).toEqual(formatted);

      dateParam.removeAllSelected();
      dateParam.addSelected(date);
      expect(dateParam.getDatetimeUrlFormat()).toEqual(formatted);
    });
    it('given only date string', () => {
      const date = '2020-01-01';
      const formatted = '2020-01-01T00:00';
      dateParam.enableTime(false);
      dateParam.addSelected(date);
      expect(dateParam.getDatetimeUrlFormat()).toEqual(formatted);
    });
  });
});
