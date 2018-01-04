import { SearchParameter } from './search-parameter';
export class SearchDatetime extends SearchParameter {
    date: string;
    hour: number;
    minute: number;
    hourOptions: number[] = [];
    minuteOptions: number[] = [];
    constructor(
        name: string,
        choices: string[],
        restricted: boolean,
        required: boolean,
        timesUsable: number = 1,
        placeholder: string = ''
    ) {
        super(name, choices, restricted, required, timesUsable, placeholder);
        this.setType('SearchDatetime');
    }
    resetValues() {
        this.date = null;
        this.hour = null;
        this.minute = null;
    }
    isUnfilled() {
        if (this.isEmpty(this.date)) {
            return true;
        }
        return false;
    }
    getFullDatetime() {
        let datetime: Date;
        if (!this.isEmpty(this.date)) {
            this.hour = this.fixValue(this.hour, 0, 23);
            this.minute = this.fixValue(this.minute, 0, 59);
            const splitDate = this.date.split('-');
            const epoch = Date.UTC(
                +splitDate[0],
                +splitDate[1] - 1,
                +splitDate[2],
                this.hour,
                this.minute
            );
            datetime = new Date(epoch);
        }
        return datetime;
    }
    isEmpty(input) {
        return !input;
    }
    fixValue(input, min, max) {
        input = this.isEmpty(input)
          ? 0
          : input;
        if (Math.max(input, max) === input) {
          return max;
        } else if (Math.min(input, min) === input) {
          return min;
        }
        return input;
    }
}
