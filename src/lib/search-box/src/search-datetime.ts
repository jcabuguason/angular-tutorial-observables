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
        if (this.isEmpty(this.date) || this.isEmpty(this.hour) || this.isEmpty(this.minute)) {
            return true;
        }
        return false;
    }

    getFullDatetime() {
        return this.date + this.hour + this.minute;
    }

    isEmpty(input) {
        return !input;
    }
}
