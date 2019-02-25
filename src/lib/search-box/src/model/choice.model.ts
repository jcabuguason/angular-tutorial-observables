export class ChoiceModel {
  constructor(
    public label: string,
    public uri: string = '',
    public tooltip: string = '',
    public icon: ChoiceIcon = new ChoiceIcon()
  ) {
    if (this.uri === '') {
      this.uri = this.label;
    }
  }
}

export class ChoiceIcon {
  constructor(public faIcon: string = '', public iconTooltip: string = '') {}
}
