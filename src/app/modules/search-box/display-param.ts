import { Component } from '@angular/core';
import { SearchParameter } from './search-parameter';

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
        private value: string,
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