import { SearchParameter } from './search-parameter';
import { ParameterType } from '../enums/parameter-type.enum';
import { HoursRangeParameterOptions } from '../model/parameter-options.model';
import { valueOrDefault } from 'msc-dms-commons-angular/shared/util';

export class SearchHoursRange extends SearchParameter {
  hoursBefore: number;
  hoursAfter: number;

  formHoursBefore: number;
  formHoursAfter: number;

  private defaultBefore: number;
  private defaultAfter: number;

  private urlNameBefore: string;
  private urlNameAfter: string;

  constructor(options: HoursRangeParameterOptions) {
    super({ ...options, choices: [], timesUsable: 1 });
    this.setType(ParameterType.SEARCH_HOURS_RANGE);
    this.urlNameBefore = valueOrDefault(options.urlNameBefore, 'hoursBefore');
    this.urlNameAfter = valueOrDefault(options.urlNameAfter, 'hoursAfter');
  }

  setDefaultHours(hrsBefore?: number, hrsAfter?: number) {
    this.defaultBefore = hrsBefore;
    this.defaultAfter = hrsAfter;
    this.resetValues();
  }

  // at least 1 field needs to be filled, the other will be set to a default or 0 if undefined/null
  canAddSelected(value) {
    return !this.isEmpty(value.hh_before) || !this.isEmpty(value.hh_after);
  }

  addSelected(value) {
    if (this.canAddSelected(value)) {
      this.setHours(value.hh_before, value.hh_after);
    }
  }

  removeAllSelected() {
    this.resetValues();
  }

  removeAllFormValues() {
    this.resetValues(true);
  }

  populateFormValues() {
    this.formHoursBefore = this.hoursBefore;
    this.formHoursAfter = this.hoursAfter;
  }

  isUnfilled() {
    return this.checkUnfilled();
  }

  isUnfilledForm() {
    return this.checkUnfilled(true);
  }

  setHours(before, after) {
    const hours = (value, defaultHour) => (isNaN(value) ? (!!defaultHour ? defaultHour : 0) : Number(value));
    this.hoursBefore = hours(before, this.defaultBefore);
    this.hoursAfter = hours(after, this.defaultAfter);
  }

  applyFormValues() {
    this.setHours(this.formHoursBefore, this.formHoursAfter);
  }

  getUrlNameBefore(): string {
    return this.urlNameBefore;
  }

  getUrlNameAfter(): string {
    return this.urlNameAfter;
  }

  private resetValues(resetForm = false) {
    if (resetForm) {
      this.formHoursBefore = this.defaultBefore;
      this.formHoursAfter = this.defaultAfter;
    } else {
      this.hoursBefore = this.defaultBefore;
      this.hoursAfter = this.defaultAfter;
    }
  }

  private checkUnfilled(checkForm = false): boolean {
    return checkForm
      ? this.isEmpty(this.formHoursBefore) && this.isEmpty(this.formHoursAfter)
      : this.isEmpty(this.hoursBefore) && this.isEmpty(this.hoursAfter);
  }
}
