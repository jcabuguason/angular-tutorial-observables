export class SearchModel {
  constructor (
    public taxonomy: string[],
    public elements: SearchElement[],
    public from?: Date,
    public to?: Date,
    public size?: number,
    public operator?: string
  ) { }
}

export class SearchElement {
  constructor (
    public elementID: string,
    // 'dataElements' or 'metadataElements'
    public elementType: string,
    // could be 'value', 'unit', 'overallQASummary', etc
    public valueType?: string,
    // the actual value
    public value?: string,
  ) { }
  // used by ES
  elementToString(): string {
    let result = 'elementID=' + this.elementID + '|type=' + this.elementType;
    if (this.valueType && this.value) {
      result += '|' + this.valueType + '=' + this.value;
    }
    return result;
  }
}
