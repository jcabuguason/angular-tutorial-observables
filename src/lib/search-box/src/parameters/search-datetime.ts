import { SearchParameter } from './search-parameter';
import {
  formatDateToString,
  DateFormatOptions,
  isValidDate,
  valueOrDefault,
} from 'msc-dms-commons-angular/shared/util';
import { DatetimeParameterOptions } from '../model/parameter-options.model';
import { ParameterType } from '../enums/parameter-type.enum';

export class SearchDatetime extends SearchParameter {
  datetime: string; // using formatted string to ignore the time zone (see: https://stackoverflow.com/a/54755073)
  formDatetime: string;
  includeTime: boolean;
  startYear: number;
  endYear: number;
  minDate: Date;
  maxDate: Date;
  currentYear: number = new Date().getFullYear();
  calReadOnly: boolean;
  hoursBack: number;
  urlQuickName: string;
  urlQuickRange: string;
  private defaultDatetime: string;

  constructor(options: DatetimeParameterOptions) {
    super({ ...options, choices: [], timesUsable: 1 });
    this.setType(ParameterType.Datetime);
    this.includeTime = valueOrDefault(options.includeTime, true);
    this.setDefaultDatetime(options.defaultDatetime);
    this.startYear = valueOrDefault(options.startYear, 2000);
    this.endYear = valueOrDefault(options.endYear, this.currentYear);
    this.minDate = valueOrDefault(options.minDate, null);
    this.maxDate = valueOrDefault(options.maxDate, null);
    this.calReadOnly = valueOrDefault(options.readOnly, false);
    this.urlQuickName = valueOrDefault(options.urlQuickName, 'timeRange');
  }

  private setDefaultDatetime(date) {
    this.defaultDatetime = this.canAddSelected(date) ? this.formatSearchDate(date, { dateAndTimeSeparator: ' ' }) : '';
    this.datetime = this.defaultDatetime;
  }

  canAddSelected(value): boolean {
    return isValidDate(value);
  }

  addSelected(value) {
    if (this.canAddSelected(value)) {
      this.setFullDatetime(value);
    }
  }

  resetAllSelected(useDefault: boolean = false) {
    this.datetime = useDefault ? this.defaultDatetime : null;
  }

  resetAllFormValues(useDefault: boolean = false) {
    this.formDatetime = useDefault ? this.defaultDatetime : null;
  }

  populateFormValues() {
    this.formDatetime = this.datetime;
  }

  isUnfilled() {
    return this.isEmpty(this.datetime);
  }

  isUnfilledForm() {
    return this.isEmpty(this.formDatetime);
  }

  getFullDatetime(): Date {
    return new Date(this.formatSearchDate(this.datetime, { dateAndTimeSeparator: ' ', includeZulu: true }));
  }

  getDatetimeUrlFormat(): string {
    return this.formatSearchDate(this.datetime, { dateAndTimeSeparator: 'T' }) || '';
  }

  setFullDatetime(date: string | Date) {
    this.datetime = this.formatSearchDate(date, { dateAndTimeSeparator: ' ' });
  }

  setHoursRange(hours: number) {
    this.hoursBack = hours;
  }

  getUrlQuickName(): string {
    return this.urlQuickName;
  }

  setUrlQuickRange(urlName: string) {
    this.urlQuickRange = urlName;
  }

  getUrlQuickRange(): string {
    return this.urlQuickRange;
  }

  applyFormValues() {
    this.setFullDatetime(this.formDatetime);
  }

  getPlaceholder() {
    return super.getPlaceholder() || this.includeTime ? 'YYYY-MM-DD HH:MM' : 'YYYY-MM-DD';
  }

  /** The date could be YYYY-MM-DD hh:mm without the timezone, this adds it back before formatting */
  private formatSearchDate(date: string | Date, options?: DateFormatOptions): string {
    let utcDate = date;

    if (typeof date === 'string') {
      utcDate = utcDate.toString();

      if (!date.match(/( |T)\d{2}:\d{2}/g)) {
        utcDate = `${utcDate}T00:00`;
      }

      if (!this.includeTime) {
        utcDate = utcDate.replace(/( |T)\d{2}:\d{2}/g, 'T00:00');
      }

      if (!date.includes('Z')) {
        utcDate = `${utcDate}Z`;
      }
    }

    return formatDateToString(utcDate, options);
  }
}
