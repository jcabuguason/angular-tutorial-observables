import { SearchParameter } from './search-parameter';

export class SearchHoursRange extends SearchParameter {
  hoursBefore: number;
  hoursAfter: number;
  maxHour = 36;

  constructor(
    name: string,
    required: boolean
  ) {
    super(name, [], false, required, 1);
    this.setType('SearchHoursRange');
    this.resetValues();
  }

  resetValues() {
    this.hoursBefore = null;
    this.hoursAfter = null;
  }

  isUnfilled() {
    return this.isEmpty(this.hoursBefore) || this.isEmpty(this.hoursAfter);
  }

  setHours(before, after) {
    const hours = (value) => isNaN(value) ? 0 : Number(value);
    this.hoursBefore = hours(before);
    this.hoursAfter = hours(after);
    this.limitRange();
  }

  limitRange() {
    this.hoursBefore = this.fixValue(this.hoursBefore, 0, this.maxHour);
    this.hoursAfter = this.fixValue(this.hoursAfter, 0, this.maxHour);
  }

  private isEmpty(input) {
    return input == null;
  }

  private fixValue(input: number, min: number, max: number) {
    input = this.isEmpty(input) ? 0 : input;
    if (max <= input) {
      return max;
    } else if (input <= min) {
      return min;
    }
    return input;
  }

}
