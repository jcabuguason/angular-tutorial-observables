import { SearchHoursRange } from './search-hours-range';

describe('SearchHoursRange', () => {
  describe('general functions', () => {
    let hoursParam: SearchHoursRange;

    beforeEach(() => {
      hoursParam = new SearchHoursRange({ name: 'hoursParam' });
    });

    it('should add specified hours', () => {
      hoursParam.addSelected({ hh_before: 1, hh_after: 2 });
      expect(hoursParam.hoursBefore).toEqual(1);
      expect(hoursParam.hoursAfter).toEqual(2);
    });

    it('should not add hours if both hh_before and hh_after are undefined', () => {
      hoursParam.addSelected({});
      expect(hoursParam.hoursBefore).toBeNull();
      expect(hoursParam.hoursAfter).toBeNull();
    });

    it('should not add hours if both hh_before and hh_after are empty', () => {
      hoursParam.addSelected({ hh_before: '', hh_after: '' });
      expect(hoursParam.hoursBefore).toBeNull();
      expect(hoursParam.hoursAfter).toBeNull();
    });

    it('should remove hours', () => {
      hoursParam.hoursBefore = 1;
      hoursParam.hoursAfter = 1;
      hoursParam.resetAllSelected();
      expect(hoursParam.hoursBefore).toBeNull();
      expect(hoursParam.hoursAfter).toBeNull();
      hoursParam.formHoursBefore = 1;
      hoursParam.formHoursAfter = 1;
      hoursParam.resetAllFormValues();
      expect(hoursParam.formHoursBefore).toBeNull();
      expect(hoursParam.formHoursAfter).toBeNull();
    });
  });

  describe('using default values', () => {
    let hoursParam: SearchHoursRange;

    beforeEach(() => {
      hoursParam = new SearchHoursRange({ name: 'hoursParam', defaultHoursBefore: 1, defaultHoursAfter: 2 });
    });

    it('should use default hours', () => {
      expect(hoursParam.hoursBefore).toBe(1);
      expect(hoursParam.hoursAfter).toBe(2);
    });

    it('should add specified hours', () => {
      hoursParam.addSelected({ hh_before: 5, hh_after: 6 });
      expect(hoursParam.hoursBefore).toEqual(5);
      expect(hoursParam.hoursAfter).toEqual(6);
    });

    it('should use default if both hh_before and hh_after are undefined', () => {
      hoursParam.addSelected({});
      expect(hoursParam.hoursBefore).toBe(1);
      expect(hoursParam.hoursAfter).toBe(2);
    });

    it('should use default if both hh_before and hh_after are empty', () => {
      hoursParam.addSelected({ hh_before: '', hh_after: '' });
      expect(hoursParam.hoursBefore).toBe(1);
      expect(hoursParam.hoursAfter).toBe(2);
    });

    it('should reset hours to default', () => {
      hoursParam.hoursBefore = 5;
      hoursParam.hoursAfter = 6;
      hoursParam.resetAllSelected(true);
      expect(hoursParam.hoursBefore).toEqual(1);
      expect(hoursParam.hoursAfter).toEqual(2);
    });

    it('should remove hours', () => {
      hoursParam.hoursBefore = 5;
      hoursParam.hoursAfter = 6;
      hoursParam.resetAllSelected();
      expect(hoursParam.hoursBefore).toBeNull();
      expect(hoursParam.hoursAfter).toBeNull();
    });
  });
});
