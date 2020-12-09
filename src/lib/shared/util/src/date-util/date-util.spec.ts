import * as dateUtil from './date-util.class';
import { TimeOperator } from './operator.enum';
import { TimeUnit } from './time-unit.enum';

describe('DateUtil', () => {
  it('should check valid date', () => {
    expect(dateUtil.isValidDate('2018-04-22T00:00:00.000Z')).toBeTruthy();
    expect(dateUtil.isValidDate(new Date('2018-04-22T00:00:00.000Z'))).toBeTruthy();
    expect(dateUtil.isValidDate(null)).toBeFalsy();
    expect(dateUtil.isValidDate('')).toBeFalsy();
  });

  describe('should compare datetimes', () => {
    it('expecting number return value', () => {
      expect(dateUtil.compareTime('2018-04-22T00:00:00.000Z', '2018-04-30T22:00:00.000Z')).toBeLessThan(0);
      expect(dateUtil.compareTime('2018-04-30T22:00:00.000Z', '2018-04-22T00:00:00.000Z')).toBeGreaterThan(0);
      expect(dateUtil.compareTime('2018-04-22T00:00:00.000Z', '2018-04-22T00:00:00.000Z')).toBe(0);
      expect(dateUtil.compareTime(Date.parse('2018-04-22T00:00:00.000Z'), Date.parse('2018-04-22T00:00:00.000Z'))).toBe(
        0,
      );
      expect(dateUtil.compareTime('not-real', '2018-04-22T00:00:00.000Z')).toBe(-1);
      expect(dateUtil.compareTime('2018-04-22T00:00:00.000Z', 'not-real')).toBe(1);
      expect(dateUtil.compareTime('not-real', 'also-not-real')).toBe(0);
    });
    it('expecting boolean return value', () => {
      const date1 = '2020-01-01T00:00Z';
      const date2 = '2020-02-01T00:00Z';
      expect(dateUtil.isTimeBefore(date1, date2)).toBeTruthy();
      expect(dateUtil.isTimeBefore(date2, date1)).toBeFalsy();
      expect(dateUtil.isTimeBefore(date1, date1)).toBeFalsy();
    });
  });

  it('subtracting hours', () => {
    const date1 = new Date('2018-11-04T06:00Z');
    const expectedDate1 = new Date('2018-11-03T06:00Z');
    expect(dateUtil.calculateDate({ date: date1, mode: TimeOperator.Subtract, unit: TimeUnit.Hours, amount: 24 })).toEqual(expectedDate1);

    const date2 = new Date('2019-03-10T06:00Z');
    const expectedDate2 = new Date('2019-03-09T06:00Z');
    expect(dateUtil.calculateDate({ date: date2, mode: TimeOperator.Subtract, unit: TimeUnit.Hours, amount: 24 })).toEqual(expectedDate2);

    const date3 = new Date('2019-01-01T05:00Z');
    const expectedDate3 = new Date('2019-01-01T00:00Z');
    expect(dateUtil.calculateDate({ date: date3, mode: TimeOperator.Subtract, unit: TimeUnit.Hours, amount: 5 })).toEqual(expectedDate3);
  });

  it('adding hours', () => {
    const date1 = new Date('2018-11-04T06:00Z');
    const expectedDate1 = new Date('2018-11-05T06:00Z');
    expect(dateUtil.calculateDate({ date: date1, mode: TimeOperator.Add, unit: TimeUnit.Hours, amount: 24 })).toEqual(expectedDate1);

    const date2 = new Date('2019-03-10T06:00Z');
    const expectedDate2 = new Date('2019-03-11T06:00Z');
    expect(dateUtil.calculateDate({ date: date2, mode: TimeOperator.Add, unit: TimeUnit.Hours, amount: 24 })).toEqual(expectedDate2);

    const date3 = new Date('2019-01-01T05:00Z');
    const expectedDate3 = new Date('2019-01-01T10:00Z');
    expect(dateUtil.calculateDate({ date: date3, mode: TimeOperator.Add, unit: TimeUnit.Hours, amount: 5 })).toEqual(expectedDate3);
  });

  it('adding minutes', () => {
    const date1 = new Date('2018-11-04T06:00Z');
    const expectedDate1 = new Date('2018-11-04T06:30Z');
    expect(dateUtil.calculateDate({ date: date1, mode: TimeOperator.Add, unit: TimeUnit.Minutes, amount: 30 })).toEqual(expectedDate1);

    const date2 = new Date('2019-03-10T06:00Z');
    const expectedDate2 = new Date('2019-03-10T07:00Z');
    expect(dateUtil.calculateDate({ date: date2, mode: TimeOperator.Add, unit: TimeUnit.Minutes, amount: 60 })).toEqual(expectedDate2);

    const date3 = new Date('2019-01-01T05:00Z');
    const expectedDate3 = new Date('2019-01-01T08:00Z');
    expect(dateUtil.calculateDate({ date: date3, mode: TimeOperator.Add, unit: TimeUnit.Minutes, amount: 180 })).toEqual(expectedDate3);
  });

  it('subtracting minutes', () => {
    const date1 = new Date('2018-11-04T06:00Z');
    const expectedDate1 = new Date('2018-11-04T05:30Z');
    expect(dateUtil.calculateDate({ date: date1, mode: TimeOperator.Subtract, unit: TimeUnit.Minutes, amount: 30 })).toEqual(expectedDate1);

    const date2 = new Date('2019-03-10T06:00Z');
    const expectedDate2 = new Date('2019-03-10T05:00Z');
    expect(dateUtil.calculateDate({ date: date2, mode: TimeOperator.Subtract, unit: TimeUnit.Minutes, amount: 60 })).toEqual(expectedDate2);

    const date3 = new Date('2019-01-01T05:00Z');
    const expectedDate3 = new Date('2019-01-01T02:00Z');
    expect(dateUtil.calculateDate({ date: date3, mode: TimeOperator.Subtract, unit: TimeUnit.Minutes, amount: 180 })).toEqual(expectedDate3);
  });


  describe('should format date', () => {
    it('given string input', () => {
      const dateString = '2018-11-11T02:00:00.000Z';
      expect(dateUtil.formatDateToString(dateString)).toBe('2018-11-11T02:00');
      expect(dateUtil.formatDateToString(dateString, { dateAndTimeSeparator: ' ' })).toBe('2018-11-11 02:00');
    });

    it('given Date input', () => {
      const date = new Date('2020-01-02T23:59:59Z');
      expect(
        dateUtil.formatDateToString(date, {
          dateAndTimeSeparator: '',
          dateSeparator: '',
          timeSeparator: '',
        }),
      ).toBe('202001022359');
      expect(dateUtil.formatDateToString(date)).toBe('2020-01-02T23:59');
      expect(dateUtil.formatDateToString(date, { dateAndTimeSeparator: ' ' })).toBe('2020-01-02 23:59');
      expect(dateUtil.formatDateToString(date, { includeZulu: true })).toBe('2020-01-02T23:59Z');
      expect(dateUtil.formatDateToString(date, { includeSeconds: true })).toBe('2020-01-02T23:59:59');
      expect(dateUtil.formatDateToString(date, { includeSeconds: true, includeZulu: true })).toBe(
        '2020-01-02T23:59:59Z',
      );
      expect(
        dateUtil.formatDateToString(date, { includeMinutes: false, includeZulu: true, dateAndTimeSeparator: ' @ ' }),
      ).toBe('2020-01-02 @ 23Z');
    });
  });
});
