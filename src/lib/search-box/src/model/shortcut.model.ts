export class ShortcutModel {
  constructor(public label: string, public addParameters: { name: string; values: string[] }[]) {}
}
