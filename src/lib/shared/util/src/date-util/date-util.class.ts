import { DateFormatOptions, DEFAULT_DATE_FORMAT } from './date-format-options.model';
import { TimeUnit } from './time-unit.enum';
import { TimeOperator } from './operator.enum';

export function isValidDate(date: Date | string): boolean {
  return !!date && !isNaN(new Date(date).valueOf());
}

export function compareTime(date1, date2): number {
  const getTime = (value) => (value instanceof Date ? value.valueOf() : new Date(value).valueOf());
  const date1Time = getTime(date1);
  const date2Time = getTime(date2);
  if (isNaN(date1Time) && isNaN(date2Time)) {
    return 0;
  }
  if (isNaN(date1Time)) {
    return -1;
  }
  if (isNaN(date2Time)) {
    return 1;
  }
  return date1Time - date2Time;
}

export function isTimeBefore(date1, date2): boolean {
  return compareTime(date1, date2) < 0;
}

function modifyHours(date: Date, hours: number): Date {
  const newDate = new Date(date);
  newDate.setUTCHours(date.getUTCHours() + hours);
  return newDate;
}

function modifyMinutes(date: Date, minutes: number): Date {
  const newDate = new Date(date);
  newDate.setUTCMinutes(date.getUTCMinutes() + minutes);
  return newDate;
}

/** Returns the number of hours between two dates */
export function hoursDifference(date1: Date, date2: Date): number {
  const millisecondsDiff = Math.abs(date1.valueOf() - date2.valueOf());
  return millisecondsDiff / 1000 / 3600;
}

/** Returns back calculated date, subtracting/adding relative to the given date*/
export function calculateDate({
  date = new Date(),
  mode,
  unit,
  amount,
}: {
  date?: Date;
  mode: TimeOperator;
  unit: TimeUnit;
  amount: number;
}): Date {
  if (mode === TimeOperator.Subtract) {
    amount *= -1;
  }

  const modifyFunc = unit === TimeUnit.Minutes ? modifyMinutes : modifyHours;
  return modifyFunc.apply(this, [date, amount]);
}

/** Given a data URI that contains a YYYYMMDDHHMM identifier, return a Date */
export function findISODate(uri: string): Date {
  const dateFinder = /\d{12}/;
  const regexResult = uri.match(dateFinder);
  if (regexResult == null) {
    return null;
  }
  const dateString = regexResult[0];
  return new Date(
    Number(dateString.slice(0, 4)),
    Number(dateString.slice(4, 6)) - 1,
    Number(dateString.slice(6, 8)),
    Number(dateString.slice(8, 10)),
    Number(dateString.slice(10, 12)),
  );
}

/** Formats as YYYY-MM-DDTHH:mm by default, returns null if date is not valid */
export function formatDateToString(date: Date | string, options: DateFormatOptions = {}): string {
  const dateInstance: Date = date instanceof Date ? date : new Date(date);
  // `new Date(undefined)` gives us an Invalid Date
  // `new Date(null)` gives us the Unix Epoch
  if (date == null || isNaN(dateInstance.valueOf())) {
    return null;
  }

  // use any default options in case it was not indicated in the passed in options
  for (const opt of Object.keys(DEFAULT_DATE_FORMAT)) {
    if (options[opt] == null) {
      options[opt] = DEFAULT_DATE_FORMAT[opt];
    }
  }

  // format date
  let formattedDate: string = dateInstance.toISOString().split('T')[0];
  if (options.dateSeparator !== DEFAULT_DATE_FORMAT.dateSeparator) {
    formattedDate = formattedDate.split('-').join(options.dateSeparator);
  }

  // format time
  let formattedTime = '';
  let dateAndTimeSeparator = '';
  if (options.includeTime) {
    const padZero = (timeVal: number) => timeVal.toString().padStart(2, '0');
    const hours = padZero(dateInstance.getUTCHours());
    const minutes = options.includeMinutes ? padZero(dateInstance.getUTCMinutes()) : '';
    const seconds = options.includeMinutes && options.includeSeconds ? padZero(dateInstance.getUTCSeconds()) : '';
    formattedTime = [hours, minutes, seconds].filter((val) => !!val).join(options.timeSeparator);
    if (options.includeMinutes && options.includeSeconds && options.includeMilliseconds) {
      const milliseconds = dateInstance.getUTCMilliseconds().toString().padStart(3, '0');
      formattedTime = `${formattedTime}${options.millisecondsSeparator}${milliseconds}`;
    }

    dateAndTimeSeparator = options.dateAndTimeSeparator;

    if (options.includeZulu) {
      formattedTime = `${formattedTime}Z`;
    }
  }

  return `${formattedDate}${dateAndTimeSeparator}${formattedTime}`;
}
