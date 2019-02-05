export class ChartObject {
  constructor(public elements: Element[], public stations: Station[]) {}
}

export class Element {
  constructor(public id: string, public chartType?: string) {}
}

export class Station {
  constructor(public label: string, public value: string, public id: string) {}
}
