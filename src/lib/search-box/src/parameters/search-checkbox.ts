import { SearchParameter } from './search-parameter';
import { ParameterType } from '../enums/parameter-type.enum';
import { CheckboxParameterOptions } from '../model/parameter-options.model';

export class SearchCheckbox extends SearchParameter {
  typeValue = '';
  formChecked = false;
  checked = false;
  requiredParams: SearchParameter[];

  constructor(options: CheckboxParameterOptions) {
    super({ ...options, choices: [], timesUsable: 1 });
    this.setType(ParameterType.SEARCH_CHECKBOX);
    this.typeValue = options.typeValue;
    this.requiredParams = options.requiredParams;
  }

  hasFilledRequirements(): boolean {
    return this.hasRequiredParams() && this.requiredParams.some((param) => !param.isUnfilled());
  }

  hasRequiredParams(): boolean {
    return this.requiredParams.length > 0;
  }

  canAddSelected(value) {
    return value === this.typeValue;
  }

  addSelected(value) {
    if (this.canAddSelected(value)) {
      this.checked = true;
    }
  }

  removeAllSelected() {
    this.checked = false;
  }

  removeAllFormValues() {
    this.formChecked = false;
  }

  populateFormValues() {
    this.formChecked = this.checked;
  }

  isUnfilled() {
    return !this.checked;
  }

  isUnfilledForm(): boolean {
    return !this.formChecked;
  }

  applyFormValues() {
    this.checked = this.formChecked;
  }
}
