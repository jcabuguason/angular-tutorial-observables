import { ChoiceModel } from '../model/choice.model';

export class SearchParameter {
  selected: string[] = [];
  formSelected: string[] = [];
  filteredSuggestions: string[] = [];

  multiSelectChoices = [];
  choicesWithEmpty = [];

  private type: ParameterType;
  private displayName: string;

  constructor(
    private name: string,
    private choices: ChoiceModel[],
    private restricted: boolean,
    private required: boolean,
    private timesUsable: number = 500,
    private placeholder: string = ''
  ) {
      this.displayName = name;
      this.type = ParameterType.SEARCH_PARAMETER;
      this.multiSelectChoices = this.choices.map(choice => choice.label)
        .sort()
        .map(choiceLabel => ({ label: choiceLabel, value: choiceLabel}));
      this.choicesWithEmpty = [
        {label: '-', value: ''},
        ...this.multiSelectChoices
      ];
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

  getChoices(): ChoiceModel[] {
    return this.choices;
  }

  includesChoice(choice): boolean {
    return this.findChoice(this.choices, choice) != null;
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

  getSelectedModels() {
    return this.selected.map(val => this.findChoice(this.choices, val) || new ChoiceModel(val));
  }

  setSelectedAt(index: number, value: string) {
    if (this.selected[index] != null) {
      this.selected[index] = value;
    }
  }

  canAddSelected(value: string) {
    value = this.cleanEntries([value]).shift();
    if (this.isEmpty(value)) {
      return false;
    }
    return (this.isRestricted() && !this.includesChoice(value))
      ? false
      : !this.alreadySelected(value) && this.selected.length < this.timesUsable;
  }

  addSelected(value: string) {
    value = this.cleanEntries([value]).shift();
    if (this.canAddSelected(value)) {
      const fixed = this.choices.find(val => val.label.toLowerCase() === value.toLowerCase());
      if (fixed) {
        value = fixed.label;
      }
      this.selected.push(value);
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
    this.formSelected = this.cleanEntries(this.formSelected);
    return this.formSelected.length === 0;
  }

  isUnfilled(): boolean {
    this.selected = this.cleanEntries(this.selected);
    return this.selected.length === 0;
  }

  filterSuggestions(event) {
    const matchSubstring = (choice) => choice.toLowerCase().indexOf(event.query.toLowerCase()) !== -1;
    this.filteredSuggestions = this.choices
      .map(choice => choice.label)
      .filter(label => matchSubstring(label))
      .sort();
  }

  applyFormValues() {
    this.selected = this.formSelected;
  }

  removeInvalidValues() {
    this.selected = this.cleanEntries(this.selected);
    this.selected = this.removeDuplicates(this.selected);
    if (this.isRestricted()) {
      this.selected = this.selected.filter(val => this.includesChoice(val));
    }
  }

  isEmpty = (value): boolean => value == null || String(value) === '';

  getChoiceTooltip(value: string) {
    const choice = this.findChoice(this.choices, value);
    return choice ? choice.tooltip : '';
  }

  findChoiceByUri(uri: string) {
    return this.choices.find(val => val.uri.toLowerCase() === uri.toLowerCase());
  }

  /** For functions that accept both string value and ChoiceModel */
  private isChoiceModel(value) {
    return value != null
      ? value.hasOwnProperty('label') && value.hasOwnProperty('uri') && value.hasOwnProperty('tooltip')
      : false;
  }

  private findChoice(list: any[], value: string | ChoiceModel) {
    const updatedValue = this.determineChoiceLabel(value).toLowerCase();
    return list.find(val => {
      if (this.isChoiceModel(val)) {
        return val.label.toLowerCase() === updatedValue;
      } else {
        return val.toLowerCase() === updatedValue;
      }
    });
  }

  private determineChoiceLabel(value: string | ChoiceModel): string {
    return this.isChoiceModel(value)
      ? String(value['label'])
      : String(value);
  }

  cleanEntries = (arr: string[]): string[] => arr
    .map(entry => entry != null && entry.trim())
    .filter(trimmed => !!trimmed)

  // some values still gets through from manual user input in the form/bar (ngModel binding)
  // ex. '12345 ' and '12345   ' are technically unique
  private removeDuplicates = (arr: string[]): string[] => arr
    .filter((val, index) => arr.indexOf(val) === index)
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
