import { SearchParameter } from './search-parameter';
export class SearchDatetime extends SearchParameter {
    date: string;
    hour: number;
    minute: number;
    constructor(
        name: string,
        required: boolean,
        timesUsable: number = 1,
    ) {
        super(name, [], true, required, timesUsable);
        this.setType('SearchDatetime');
    }
    resetValues() {
        this.date = null;
        this.hour = null;
        this.minute = null;
    }

    isUnfilled() {
        return this.isEmpty(this.date);
    }

    getFullDatetime() {
        let datetime: Date;
        if (!this.isEmpty(this.date)) {
            this.hour = this.fixValue(this.hour, 0, 23);
            this.minute = this.fixValue(this.minute, 0, 59);
            const splitDate = this.date.split('-');
            datetime = new Date(
                +splitDate[0],
                +splitDate[1] - 1,
                +splitDate[2],
                this.hour,
                this.minute
            );
            // Handle Invalid Date
            if (isNaN(datetime.getTime())) { datetime = null; }
        }
        return datetime;
    }

    getDatetimeUrlFormat() {
        return this.date + 'T'
            + this.padZero(this.hour) + ':'
            + this.padZero(this.minute);
    }

    isEmpty(input) {
        return !input;
    }

    fixValue(input: number, min: number, max: number) {
        input = this.isEmpty(input) ? 0 : input;
        if (max <= input) {
            return max;
        } else if (input <= min) {
            return min;
        }
        return input;
    }

    setFullDatetime(date: Date) {
        this.date = this.formatDate(date);
        this.hour = date.getHours();
        this.minute = date.getMinutes();
    }

    // formats to yyyy-MM-dd
    private formatDate(date: Date): string {
        return date.getFullYear() + '-'
            + this.padZero(date.getMonth() + 1) + '-'
            + this.padZero(date.getDate());
    }

    private padZero(num: number) {
        return (num < 10)
            ? `0${num}`
            : num;
    }
}
