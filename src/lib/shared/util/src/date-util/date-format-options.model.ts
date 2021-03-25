export interface DateFormatOptions {
  dateSeparator?: string;
  timeSeparator?: string;
  millisecondsSeparator?: string;
  dateAndTimeSeparator?: string;
  includeTime?: boolean;
  includeMinutes?: boolean;
  includeSeconds?: boolean;
  includeMilliseconds?: boolean;
  includeZulu?: boolean;
}

/** Default options for YYYY-MM-DDTHH:mm */
export const DEFAULT_DATE_FORMAT: DateFormatOptions = {
  dateSeparator: '-',
  timeSeparator: ':',
  millisecondsSeparator: '.',
  dateAndTimeSeparator: 'T',
  includeTime: true,
  includeMinutes: true,
};
