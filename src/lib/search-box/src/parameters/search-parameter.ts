export class SearchParameter {
  selected: any[];
  formSelected: any[];
  filteredSuggestions: string[] = [];
  multiSelectChoices = [];

  private type: ParameterType;
  private displayName: string;

  constructor(
    private name: string,
    private choices: string[],
    private restricted: boolean,
    private required: boolean,
    private timesUsable: number = 50,
    private placeholder: string = ''
  ) {
      this.displayName = name;
      this.selected = [];
      this.formSelected = [];
      this.type = ParameterType.SEARCH_PARAMETER;
      this.multiSelectChoices = this.choices.map(val => ({ label: val, value: val}));
  }

  getName(): string {
    return this.name;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  setDisplayName(displayName: string) {
    this.displayName = displayName;
  }

  getChoices(): string[] {
    return this.choices;
  }

  includesChoice(choice): boolean {
    const found = this.choices.filter(val => val.toLowerCase() === choice.toLowerCase());
    return found.length > 0;
  }

  isRestricted(): boolean {
    return this.restricted;
  }

  isRequired(): boolean {
    return this.required;
  }

  setRequired(required: boolean) {
    this.required = required;
  }

  getPlaceholder(): string {
    return this.placeholder;
  }

  getTimesUsable(): number {
    return this.timesUsable;
  }

  getType(): ParameterType {
    return this.type;
  }

  setType(type: ParameterType) {
    this.type = type;
  }

  getSelected() {
    return Array.isArray(this.selected) ? this.selected : [this.selected];
  }

  getSelectedAt(index: number): string {
    return this.selected[index];
  }

  setSelectedAt(index: number, value: string) {
    if (this.selected[index] != null) {
      this.selected[index] = value;
    }
  }

  canAddSelected(value: string) {
    if (this.isEmpty(value)) {
      return false;
    }
    return (this.isRestricted() && !this.includesChoice(value))
      ? false
      : !this.alreadySelected(value) && this.selected.length < this.timesUsable;
  }

  addSelected(value: string) {
    if (this.canAddSelected(value)) {
      const fixed = this.choices.find(val => val.toLowerCase() === value.toLowerCase())
        || value;
      this.selected.push(fixed);
    }
  }

  alreadySelected(value: string) {
    return this.selected.indexOf(value) !== -1;
  }

  removeAllSelected() {
    this.selected = [];
  }

  removeAllFormValues() {
    this.formSelected = [];
  }

  populateFormValues() {
    this.formSelected = this.selected;
  }

  isUnfilledForm(): boolean {
    this.formSelected = this.filterEmptyValues(this.formSelected);
    return this.formSelected.length === 0;
  }

  isUnfilled(): boolean {
    this.selected = this.filterEmptyValues(this.selected);
    return this.selected.length === 0;
  }

  filterSuggestions(event) {
    const matchSubstring = (choice) => choice.toLowerCase().indexOf(event.query.toLowerCase()) !== -1;
    this.filteredSuggestions = this.choices.filter(choice => matchSubstring(choice)).sort();
  }

  applyFormValues() {
    this.selected = this.formSelected;
  }

  removeInvalidValues() {
    this.selected = this.filterEmptyValues(this.selected);
    if (this.isRestricted()) {
      this.selected = this.selected.filter(val => this.includesChoice(val));
    }
  }

  isEmpty = (value): boolean => value == null || value === '';

  private filterEmptyValues = (array) => array.filter(val => !this.isEmpty(val));

}

export enum ParameterType {
  SEARCH_PARAMETER,
  SEARCH_DATETIME,
  SEARCH_HOURS_RANGE
}

export const ParameterName = {
  // used to determine taxonomy
  forTaxonomy: {
    NETWORK: 'network',
    ORGANIZATION: 'organization',
  },
  // used by search model sent to ES
  STATION_NAME: 'stationName',
  STATION_ID: 'stationID',
  PROVINCE: 'province',
  SIZE: 'size',
  HOURS_RANGE: 'hoursRange',
  FROM: 'from',
  TO: 'to',
};
