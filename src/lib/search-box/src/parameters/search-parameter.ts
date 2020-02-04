import { ChoiceModel, LOADING_MODEL } from '../model/choice.model';

export enum ParameterType {
  SEARCH_PARAMETER,
  SEARCH_DATETIME,
  SEARCH_HOURS_RANGE,
  SEARCH_QUERY_TYPE,
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
  HOURS_RANGE_DATETIME: 'obs_datetime',
  FROM: 'from',
  TO: 'to',
  QUERY_TYPE: 'queryType',
};

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
    private restricted: boolean = false,
    private required: boolean = false,
    private timesUsable: number = 500,
    private placeholder: string = '',
  ) {
    this.displayName = name;
    this.type = ParameterType.SEARCH_PARAMETER;
    this.updateChoices(this.choices);
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

  updateChoices(choices, sortAlpha: boolean = true) {
    this.choices = choices;
    this.multiSelectChoices = this.choices
      .map(choice => choice.label)
      .map(choiceLabel => ({ label: choiceLabel, value: choiceLabel }));
    if (sortAlpha) {
      this.multiSelectChoices = this.multiSelectChoices.sort((a, b) => a.label.localeCompare(b.label));
    }
    this.choicesWithEmpty = [{ label: '-', value: '' }, ...this.multiSelectChoices];
  }

  isRestricted(): boolean {
    return this.restricted;
  }

  setRestricted(restricted: boolean) {
    this.restricted = restricted;
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

  setPlaceholder(placeholder: string) {
    this.placeholder = placeholder;
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
    return this.isRestricted() && !this.includesChoice(value)
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
    return this.selected.includes(value);
  }

  removeAllSelected() {
    this.selected = [];
  }

  removeAllFormValues() {
    this.formSelected = [];
  }

  populateFormValues() {
    this.formSelected = JSON.parse(JSON.stringify(this.selected));
  }

  isUnfilledForm(): boolean {
    this.formSelected = this.cleanEntries(this.formSelected);
    return this.formSelected.length === 0;
  }

  isUnfilled(): boolean {
    this.selected = this.cleanEntries(this.selected);
    return this.selected.length === 0;
  }

  applyFormValues() {
    this.selected = JSON.parse(JSON.stringify(this.formSelected));
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

  getChoiceFaIcon(value: string): string {
    const choice = this.findChoice(this.choices, value);
    return choice ? choice.icon.faIcon : '';
  }

  getChoiceIconTooltip(value: string): string {
    const choice = this.findChoice(this.choices, value);
    return choice ? choice.icon.iconTooltip : '';
  }

  hasChoiceIcon(value: string): boolean {
    const choice = this.findChoice(this.choices, value);
    return choice != null && choice.icon != null;
  }

  isLoadingChoices(): boolean {
    return this.choices.includes(LOADING_MODEL);
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
    return this.isChoiceModel(value) ? String(value['label']) : String(value);
  }

  cleanEntries = (arr: string[]): string[] =>
    arr.map(entry => entry != null && entry.trim()).filter(trimmed => !!trimmed);

  // some values still gets through from manual user input in the form/bar (ngModel binding)
  // ex. '12345 ' and '12345   ' are technically unique
  private removeDuplicates = (arr: string[]): string[] => arr.filter((val, index) => arr.indexOf(val) === index);
}
