import { SearchHoursRange } from './search-hours-range';

describe('SearchHoursRange', () => {
  let hoursParam: SearchHoursRange;

  beforeEach(() => {
    hoursParam = new SearchHoursRange({ name: 'hoursParam' });
  });

  it('should set default hours', () => {
    expect(hoursParam.hoursBefore).toBeUndefined();
    expect(hoursParam.hoursAfter).toBeUndefined();

    hoursParam.setDefaultHours(12, 24);
    expect(hoursParam.hoursBefore).toEqual(12);
    expect(hoursParam.hoursAfter).toEqual(24);
  });

  it('should add specified hours', () => {
    hoursParam.addSelected({ hh_before: 1, hh_after: 2 });
    expect(hoursParam.hoursBefore).toEqual(1);
    expect(hoursParam.hoursAfter).toEqual(2);
  });

  it('should not add hours if both hh_before and hh_after are undefined', () => {
    hoursParam.addSelected({});
    expect(hoursParam.hoursBefore).toBeUndefined();
    expect(hoursParam.hoursAfter).toBeUndefined();
  });

  it('should not add hours if both hh_before and hh_after are empty', () => {
    hoursParam.addSelected({ hh_before: '', hh_after: '' });
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
    hoursParam.setDefaultHours(12, 12);
    hoursParam.setHours(undefined, 4);
    expect(hoursParam.hoursBefore).toEqual(12);
    expect(hoursParam.hoursAfter).toEqual(4);
  });

  it('should set hour to default if field is is NaN', () => {
    hoursParam.setDefaultHours(12, 12);
    hoursParam.setHours('abc', 4);
    expect(hoursParam.hoursBefore).toEqual(12);
    expect(hoursParam.hoursAfter).toEqual(4);
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
    hoursParam.setDefaultHours(12, 12);
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
