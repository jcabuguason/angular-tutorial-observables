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
    this.setType(ParameterType.HoursRange);
    this.urlNameBefore = valueOrDefault(options.urlNameBefore, 'hoursBefore');
    this.urlNameAfter = valueOrDefault(options.urlNameAfter, 'hoursAfter');
    this.setDefaultHours(options.defaultHoursBefore, options.defaultHoursAfter);
  }

  private setDefaultHours(hrsBefore: number, hrsAfter: number) {
    this.defaultBefore = isNaN(hrsBefore) ? null : hrsBefore;
    this.defaultAfter = isNaN(hrsAfter) ? null : hrsAfter;
    this.hoursBefore = this.defaultBefore;
    this.hoursAfter = this.defaultAfter;
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

  resetAllSelected(useDefault: boolean = false) {
    this.hoursBefore = useDefault ? this.defaultBefore : null;
    this.hoursAfter = useDefault ? this.defaultAfter : null;
  }

  resetAllFormValues(useDefault: boolean = false) {
    this.formHoursBefore = useDefault ? this.defaultBefore : null;
    this.formHoursAfter = useDefault ? this.defaultAfter : null;
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
    this.hoursBefore = before;
    this.hoursAfter = after;
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

  private checkUnfilled(checkForm = false): boolean {
    return checkForm
      ? this.isEmpty(this.formHoursBefore) && this.isEmpty(this.formHoursAfter)
      : this.isEmpty(this.hoursBefore) && this.isEmpty(this.hoursAfter);
  }
}
