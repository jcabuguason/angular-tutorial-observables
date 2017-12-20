import { SearchParameter } from './search-parameter';
import { SearchDatetime } from './search-datetime';
import { SearchHoursRange } from './search-hours-range';

export class DisplayParameter {
    /**
     * Constructor for DisplayParameter
     * @param key Key to refer parameter to
     * @param value Input value
     * @param displayChoices Suggested values to show
     * @param searchParam The actual search parameter it relates to
     */
    constructor(
        private key: string,
        public value: string,
        private displayChoices: string[],
        private searchParam: SearchParameter
    ) { }

    getKey(): string {
        return this.key;
    }

    getValue(): string {
        return this.value;
    }

    getDisplayChoices(): string[] {
        return this.displayChoices;
    }

    getSearchParam(): SearchParameter {
        if (this.searchParam.getType() === 'SearchDatetime') {
          return this.searchParam as SearchDatetime;
        }
        if (this.searchParam.getType() === 'SearchHoursRange') {
          return this.searchParam as SearchHoursRange;
        }
        return this.searchParam;
    }

    setValue(value: string) {
        this.value = value;
    }

    setDisplayChoices(choices: string[]) {
        this.displayChoices = choices;
    }

    removeAllDisplayChoices() {
        this.displayChoices = [];
    }
}
