import { SearchDatetime } from './search-datetime';

describe('SearchDatetime', () => {
  let dateParam: SearchDatetime;

  describe('general functions (with time)', () => {
    beforeEach(() => {
      dateParam = new SearchDatetime({ name: 'dateParam' });
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
  });

  describe('should get formatted datetime if time is not enabled', () => {
    beforeEach(() => {
      dateParam = new SearchDatetime({ name: 'dateParam', includeTime: false });
    });

    it('given full datetime', () => {
      const date = '2020-01-01T00:00Z';
      const formatted = '2020-01-01T00:00';
      dateParam.addSelected(new Date(date));
      expect(dateParam.getDatetimeUrlFormat()).toEqual(formatted);

      dateParam.resetAllSelected();
      dateParam.addSelected(date);
      expect(dateParam.getDatetimeUrlFormat()).toEqual(formatted);
    });
    it('given only date string', () => {
      const date = '2020-01-01';
      const formatted = '2020-01-01T00:00';
      dateParam.addSelected(date);
      expect(dateParam.getDatetimeUrlFormat()).toEqual(formatted);
    });
  });

  describe('should use default date', () => {
    const date = '2020-01-01T00:00Z';
    beforeEach(() => {
      dateParam = new SearchDatetime({ name: 'dateParam', defaultDatetime: date });
    });
    it('use default date', () => {
      expect(dateParam.datetime).toEqual('2020-01-01 00:00');
    });
    it('use default date on reset', () => {
      dateParam.addSelected(new Date('2020-02-02T00:00Z'));
      expect(dateParam.datetime).toEqual('2020-02-02 00:00');
      dateParam.resetAllSelected(true);
      expect(dateParam.datetime).toEqual('2020-01-01 00:00');
    });
    it('use default date on form reset', () => {
      dateParam.addSelected(new Date('2020-02-02T00:00Z'));
      dateParam.populateFormValues();
      expect(dateParam.formDatetime).toEqual('2020-02-02 00:00');
      dateParam.resetAllFormValues(true);
      expect(dateParam.formDatetime).toEqual('2020-01-01 00:00');
      expect(dateParam.datetime).toEqual('2020-02-02 00:00');
    });
    it('remove date', () => {
      dateParam.addSelected(new Date('2020-02-02T00:00Z'));
      expect(dateParam.datetime).toEqual('2020-02-02 00:00');
      dateParam.resetAllSelected();
      expect(dateParam.datetime).toBeNull();
    });
  });
});
