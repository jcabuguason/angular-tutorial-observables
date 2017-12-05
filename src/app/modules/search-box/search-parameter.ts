import { Component } from '@angular/core';

export class SearchParameter {  
    /**  Selected choices */
    private selected: string[];
    
    /* TODO: No functionality for this part yet */
    // /** Number of times this parameter can be used in a search, if undefined then there is no limit.. or change to default 100 */
    // timesUsable?: number;
    // /** Required parameter in the search */
    // required?: boolean;

    constructor(
        private name: string, 
        private choices: string[], 
        private restricted: boolean, 
        private placeholder: string = ''
    ) {
        this.selected = [];
    }

    getName(): string {
        return this.name;
    }

    getChoices(): string[] {
        return this.choices;
    }

    isRestricted(): boolean {
        return this.restricted;
    }

    getPlaceholder(): string {
        return this.placeholder;
    }

    getSelected(): string[] {
        return this.selected;
    }

    getSelectedAt(index: number): string {
        return this.selected[index];
    }

    addSelected(newSelected: string) {
        this.selected.push(newSelected);
    }

    removeAllSelected() {
        this.selected = [];
    }

}