export class ChoiceModel {
  constructor(
    public label: string,
    public value: string = label,
    public uri: string = label,
    public tooltip: string = '',
    public icon: ChoiceIcon = new ChoiceIcon()
  ) {
  }
}

export class ChoiceIcon {
  constructor(public faIcon: string = '', public iconTooltip: string = '') { }
}

export const LOADING_MODEL: ChoiceModel = new ChoiceModel('SEARCH_BAR.LOADING');