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
    public value: string,
    public type: string
  ) { }
  // used by ES
  elementToString(): string {
    return 'elementID=' + this.elementID + '|value=' + this.value + '|type=' + this.type;
  }
}
