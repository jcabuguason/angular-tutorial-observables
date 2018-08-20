import { SearchHoursRange } from './search-hours-range';

describe('SearchDatetime', () => {
  let hoursParam: SearchHoursRange;

  beforeEach(() => {
    hoursParam = new SearchHoursRange('hoursParam', false);
  });

  it('should enable default hours', () => {
    expect(hoursParam.hoursBefore).toBeUndefined();
    expect(hoursParam.hoursAfter).toBeUndefined();

    hoursParam.enableDefaultHours(12, 24);
    expect(hoursParam.hoursBefore).toEqual(12);
    expect(hoursParam.hoursAfter).toEqual(24);
  });

  it('should add specified hours', () => {
    hoursParam.addSelected({'hh_before': 1, 'hh_after': 2});
    expect(hoursParam.hoursBefore).toEqual(1);
    expect(hoursParam.hoursAfter).toEqual(2);
  });

  it('should not add hours if both hh_before and hh_after are undefined', () => {
    hoursParam.addSelected({});
    expect(hoursParam.hoursBefore).toBeUndefined();
    expect(hoursParam.hoursAfter).toBeUndefined();
  });

  it('should not add hours if both hh_before and hh_after are empty', () => {
    hoursParam.addSelected({'hh_before': '', 'hh_after': ''});
    expect(hoursParam.hoursBefore).toBeUndefined();
    expect(hoursParam.hoursAfter).toBeUndefined();
  });

  it('should set hour to 0 if field is undefined', () => {
    hoursParam.setHours(3, undefined);
    expect(hoursParam.hoursBefore).toEqual(3);
    expect(hoursParam.hoursAfter).toEqual(0);
  });

  it('should set hour to 0 if field is is NaN', () => {
    hoursParam.setHours(3, 'abc');
    expect(hoursParam.hoursBefore).toEqual(3);
    expect(hoursParam.hoursAfter).toEqual(0);
  });

  it('should set hour to default if field is undefined', () => {
    hoursParam.enableDefaultHours(12, 12);
    hoursParam.setHours(undefined, 4);
    expect(hoursParam.hoursBefore).toEqual(12);
    expect(hoursParam.hoursAfter).toEqual(4);
  });

  it('should set hour to default if field is is NaN', () => {
    hoursParam.enableDefaultHours(12, 12);
    hoursParam.setHours('abc', 4);
    expect(hoursParam.hoursBefore).toEqual(12);
    expect(hoursParam.hoursAfter).toEqual(4);
  });

  it('should limit hours', () => {
    hoursParam.addSelected({'hh_before': -100, 'hh_after': 100});
    expect(hoursParam.hoursBefore).toEqual(hoursParam.minHour);
    expect(hoursParam.hoursAfter).toEqual(hoursParam.maxHour);
  });

  it('should remove hours', () => {
    hoursParam.hoursBefore = 1;
    hoursParam.hoursAfter = 1;
    hoursParam.removeAllSelected();
    expect(hoursParam.hoursBefore).toBeUndefined();
    expect(hoursParam.hoursAfter).toBeUndefined();

    hoursParam.formHoursBefore = 1;
    hoursParam.formHoursAfter = 1;
    hoursParam.removeAllFormValues();
    expect(hoursParam.formHoursBefore).toBeUndefined();
    expect(hoursParam.formHoursAfter).toBeUndefined();
  });

  it('should reset hours to specified default', () => {
    hoursParam.enableDefaultHours(12, 12);
    hoursParam.hoursBefore = 1;
    hoursParam.hoursAfter = 1;
    hoursParam.removeAllSelected();
    expect(hoursParam.hoursBefore).toEqual(12);
    expect(hoursParam.hoursAfter).toEqual(12);

    hoursParam.formHoursBefore = 1;
    hoursParam.formHoursAfter = 1;
    hoursParam.removeAllFormValues();
    expect(hoursParam.formHoursBefore).toEqual(12);
    expect(hoursParam.formHoursAfter).toEqual(12);
  });
});
