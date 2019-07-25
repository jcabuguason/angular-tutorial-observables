import { SearchParameter, ParameterType } from './search-parameter';

export class SearchQueryType extends SearchParameter {
  uriChecked = '';
  formChecked = false;
  checked = false;
  requiredParams: SearchParameter[];

  constructor(
    name: string,
    uriChecked: string, // uri value to indicate when this should be checked
    requiredParams: SearchParameter[] // SearchParameters that need to be filled to execute a search
  ) {
    super(name, [], true, false, 1);
    this.setType(ParameterType.SEARCH_QUERY_TYPE);
    this.uriChecked = uriChecked;
    this.requiredParams = requiredParams;
  }

  hasFilledRequirements(): boolean {
    return this.hasRequiredParams() && this.requiredParams.some(param => !param.isUnfilled());
  }

  hasRequiredParams(): boolean {
    return this.requiredParams.length > 0;
  }

  canAddSelected(value) {
    return value === this.uriChecked;
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
