import { SearchParameter } from './search-parameter';

export class SearchDatetime extends SearchParameter {

    date: string;
    hour: string;
    minute: string;
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
        let datetime: string;
        if (!this.isEmpty(this.date)) {
        this.hour = this.isEmpty(this.hour)
            ? '00'
            : this.hour;

        this.minute = this.isEmpty(this.minute)
            ? '00'
            : this.minute;

          datetime = this.date.replace(/-/g, '') +  this.hour + this.minute;
        }

        return datetime;
    }

    isEmpty(input) {
        return !input;
    }
}
