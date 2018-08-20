import { SearchParameter, ParameterType } from './search-parameter';

export class SearchDatetime extends SearchParameter {
  datetime: Date;
  formDatetime: Date;

  constructor(
    name: string,
    required: boolean,
  ) {
    super(name, [], true, required, 1);
    this.setType(ParameterType.SEARCH_DATETIME);
  }

  canAddSelected(value): boolean {
    return this.getDateFromParam(value) != null;
  }

  addSelected(value) {
    const date = this.getDateFromParam(value);
    if (date != null) {
      this.setFullDatetime(date);
    }
  }

  removeAllSelected() {
    this.datetime = null;
  }

  removeAllFormValues() {
    this.formDatetime = null;
  }

  populateFormValues() {
    this.formDatetime = this.datetime;
  }

  isUnfilled() {
    return this.datetime == null;
  }

  isUnfilledForm() {
    return this.formDatetime == null;
  }

  getFullDatetime() {
    return this.datetime;
  }

  getDatetimeUrlFormat() {
    return !this.isEmpty(this.datetime)
      ? this.formattedDate() + 'T' + this.formattedTime()
      : '';
  }

  setFullDatetime(date: Date) {
    this.datetime = date;
  }

  applyFormValues() {
    this.setFullDatetime(this.formDatetime);
  }

  // formats to yyyy-MM-dd
  private formattedDate(): string {
    return this.datetime.getFullYear() + '-'
      + this.padTimeValue(this.datetime.getMonth() + 1) + '-'
      + this.padTimeValue(this.datetime.getDate());
  }

  private formattedTime(): string {
    return this.padTimeValue(this.datetime.getHours()) + ':'
      + this.padTimeValue(this.datetime.getMinutes());
  }

  private padTimeValue(num: number) {
    return (num < 10)
      ? `0${num}`
      : num;
  }

  /* Creates a valid date parameter, or undefined if unable to create a valid date */
  private getDateFromParam(param) {
    if (param == null) { return param; }

    const date = new Date(param);
    return (date.toString() === 'Invalid Date') ? undefined : date;
  }
}
