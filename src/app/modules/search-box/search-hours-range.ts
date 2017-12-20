import { SearchParameter } from './search-parameter';

export class SearchHoursRange extends SearchParameter {

    hoursBefore: number;
    hoursAfter: number;

    constructor(
      name: string,
      choices: string[],
      restricted: boolean,
      required: boolean,
      timesUsable: number = 1,
      placeholder: string = ''
    ) {
      super(name, choices, restricted, required, timesUsable, placeholder);
      this.setType('SearchHoursRange');
      this.resetValues();
    }

    resetValues() {
      this.hoursBefore = null;
      this.hoursAfter = null;
    }

    isUnfilled() {
      if (this.hoursBefore === undefined || this.hoursAfter === undefined ||
              this.hoursBefore === null || this.hoursAfter === null) {
          return true;
      }
      return false;
  }
}
