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

  constructor(options: DatetimeParameterOptions) {
    super({ ...options, choices: [], timesUsable: 1 });
    this.includeTime = valueOrDefault(options.includeTime, true);
    this.setType(ParameterType.SEARCH_DATETIME);
  }

  canAddSelected(value): boolean {
    return isValidDate(value);
  }

  addSelected(value) {
    if (this.canAddSelected(value)) {
      this.setFullDatetime(value);
    }
  }

  removeAllSelected() {
    this.datetime = null;
  }

  removeAllFormValues() {
    this.formDatetime = null;
  }

  populateFormValues() {
    this.formDatetime = this.datetime;
  }

  isUnfilled() {
    return this.datetime == null;
  }

  isUnfilledForm() {
    return this.formDatetime == null;
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
