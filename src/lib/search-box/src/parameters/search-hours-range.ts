import { SearchParameter, ParameterType } from './search-parameter';

export class SearchHoursRange extends SearchParameter {
  hoursBefore: number;
  hoursAfter: number;
  maxHour = 36;
  minHour = 0;

  formHoursBefore: number;
  formHoursAfter: number;

  private defaultBefore;
  private defaultAfter;

  constructor(
    name: string,
    required: boolean
  ) {
    super(name, [], false, required, 1);
    this.setType(ParameterType.SEARCH_HOURS_RANGE);
  }

  // Will use given default hours and send to ES even if not visible to search bar. Note maxHour range may need to be adjusted
  enableDefaultHours(hrsBefore?: number, hrsAfter?: number) {
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
    const hours = (value, defaultHour) => isNaN(value) ? defaultHour : Number(value);
    this.hoursBefore = hours(before, this.defaultBefore);
    this.hoursAfter = hours(after, this.defaultAfter);
    this.limitRange();
  }

  limitRange() {
    this.hoursBefore = this.fixValue(this.hoursBefore, 0, this.maxHour);
    this.hoursAfter = this.fixValue(this.hoursAfter, 0, this.maxHour);
  }

  applyFormValues() {
    this.setHours(this.formHoursBefore, this.formHoursAfter);
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

  private fixValue(input: any, min: number, max: number, defaultNum: number = 0): number {
    input = isNaN(input) ? defaultNum : input;
    if (max <= input) {
      return max;
    } else if (input <= min) {
      return min;
    }
    return input;
  }

}
