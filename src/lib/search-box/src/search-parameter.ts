export class SearchParameter {
    /**  Selected choices */
    private selected: string[];

    private type: string;

    private timesUsed: number;
    /* TODO: No functionality for this part yet */
    // /** Number of times this parameter can be used in a search, if undefined then there is no limit.. or change to default 10 */
    // timesUsable?: number;

    constructor(
      private name: string,
      private choices: string[],
      private restricted: boolean,
      private required: boolean,
      private timesUsable: number = 10,
      private placeholder: string = ''
    ) {
        this.selected = [];
        this.type = 'SearchParameter';
        this.timesUsed = 0;
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

    isRequired(): boolean {
      return this.required;
    }

    getPlaceholder(): string {
        return this.placeholder;
    }

    getTimesUsable(): number {
        return this.timesUsable;
    }

    getTimesUsed(): number {
        return this.timesUsed;
    }

    increaseTimesUsed() {
      this.timesUsed++;
    }

    decreaseTimesUsed() {
      if (this.timesUsed > 0) {
        this.timesUsed--;
      }
    }

    getType(): string {
        return this.type;
    }

    setType(type: string) {
        this.type = type;
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
