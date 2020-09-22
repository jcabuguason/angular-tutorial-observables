import { ChoiceModel, LOADING_MODEL } from '../model/choice.model';
import { ParameterOptions } from '../model/parameter-options.model';
import { ParameterType } from '../enums/parameter-type.enum';
import { valueOrDefault } from 'msc-dms-commons-angular/shared/util';

export class SearchParameter {
  selected: string[] = [];
  formSelected: string[] = [];
  filteredSuggestions: string[] = [];

  multiSelectChoices = [];

  private name: string;
  private choices: ChoiceModel[];
  private restricted: boolean;
  private required: boolean;
  private timesUsable: number;
  private placeholder: string;
  private displayName: string;
  private sortAlpha: boolean;
  private type: ParameterType = ParameterType.Default;
  private urlName: string;
  private defaultSelected: string[];

  constructor(private options: ParameterOptions) {
    this.name = options.name;
    this.choices = valueOrDefault(options.choices, []);
    this.restricted = valueOrDefault(options.restricted, false);
    this.required = valueOrDefault(options.required, false);
    this.timesUsable = valueOrDefault(options.timesUsable, 500);
    this.placeholder = valueOrDefault(options.placeholder, '');
    this.displayName = valueOrDefault(options.displayName, '');
    this.sortAlpha = valueOrDefault(options.sortAlpha, true);
    this.urlName = valueOrDefault(options.urlName, this.name);

    this.updateChoices(this.choices);

    this.setDefaultSelected(valueOrDefault(options.defaultSelectedLabels, []));
  }

  private setDefaultSelected(defaultValues: string[]) {
    this.defaultSelected = defaultValues
      .filter((value) => this.canAddSelected(value))
      .map((value) => {
        const fixed = this.choices.find((val) => val.label.toLowerCase() === value.toLowerCase());
        return fixed ? fixed.label : value;
      });
    this.selected = [...this.defaultSelected];
  }

  getName(): string {
    return this.name;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getUrlName(): string {
    return this.urlName;
  }

  getChoices(): ChoiceModel[] {
    return this.choices;
  }

  includesChoice(choice): boolean {
    return this.findChoice(this.choices, choice) != null;
  }

  updateChoices(choices) {
    this.choices = choices;
    this.multiSelectChoices = this.choices
      .map((choice) => choice.label)
      .map((choiceLabel) => ({ label: choiceLabel, value: choiceLabel }));
    if (this.sortAlpha) {
      this.multiSelectChoices = this.multiSelectChoices.sort((a, b) => a.label.localeCompare(b.label));
    }
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
    return this.selected.map((val) => this.findChoice(this.choices, val) || new ChoiceModel(val));
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
      const fixed = this.choices.find((val) => val.label.toLowerCase() === value.toLowerCase());
      if (fixed) {
        value = fixed.label;
      }
      this.selected.push(value);
    }
  }

  alreadySelected(value: string) {
    return this.selected.includes(value);
  }

  resetAllSelected(useDefault: boolean = false) {
    this.selected = useDefault ? [...this.defaultSelected] : [];
  }

  resetAllFormValues(useDefault: boolean = false) {
    this.formSelected = useDefault ? [...this.defaultSelected] : [];
  }

  populateFormValues() {
    this.formSelected = [...this.selected];
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
    this.selected = [...this.formSelected];
  }

  removeInvalidValues() {
    this.selected = this.cleanEntries(this.selected);
    this.selected = this.removeDuplicates(this.selected);
    if (this.isRestricted()) {
      this.selected = this.selected.filter((val) => this.includesChoice(val));
    }
  }

  isEmpty = (value): boolean => value == null || String(value) === '';

  getChoiceTooltip(value: string) {
    const choice = this.findChoice(this.choices, value);
    return choice ? choice.tooltip : '';
  }

  findChoiceByUri(uri: string) {
    return this.choices.find((val) => val.uri.toLowerCase() === uri.toLowerCase());
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
    return list.find((val) => {
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
    arr.map((entry) => entry != null && entry.trim()).filter((trimmed) => !!trimmed);

  // some values still gets through from manual user input in the form/bar (ngModel binding)
  // ex. '12345 ' and '12345   ' are technically unique
  private removeDuplicates = (arr: string[]): string[] => arr.filter((val, index) => arr.indexOf(val) === index);
}
