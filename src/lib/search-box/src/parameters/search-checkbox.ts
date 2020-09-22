import { SearchParameter } from './search-parameter';
import { ParameterType } from '../enums/parameter-type.enum';
import { CheckboxParameterOptions } from '../model/parameter-options.model';
import { valueOrDefault } from 'msc-dms-commons-angular/shared/util';

export class SearchCheckbox extends SearchParameter {
  typeValue = '';
  formChecked = false;
  checked = false;
  requiredParams: SearchParameter[];
  private defaultChecked: boolean;

  constructor(options: CheckboxParameterOptions) {
    super({ ...options, choices: [], timesUsable: 1 });
    this.setType(ParameterType.Checkbox);
    this.typeValue = options.typeValue;
    this.requiredParams = options.requiredParams;
    this.setDefaultChecked(valueOrDefault(options.defaultChecked, false));
  }

  private setDefaultChecked(checked: boolean) {
    this.defaultChecked = checked;
    this.checked = this.defaultChecked;
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

  resetAllSelected(useDefault: boolean = false) {
    this.checked = useDefault ? this.defaultChecked : false;
  }

  resetAllFormValues(useDefault: boolean = false) {
    this.formChecked = useDefault ? this.defaultChecked : false;
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
