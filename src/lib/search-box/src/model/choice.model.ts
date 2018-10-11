export class ChoiceModel {
  constructor(
    public label: string,
    public uri: string = '',
    public tooltip: string = '',
  ) {
    if (this.uri === '') {
      this.uri = this.label;
    }
  }
}
