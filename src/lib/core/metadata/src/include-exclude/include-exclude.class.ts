export class IncludeExclude {
  private includeList: RegExp[] = [];
  private excludeList: RegExp[] = [];

  constructor(includeList: string[], excludeList: string[]) {
    this.includeList = includeList.map(item => this.asRegex(item));
    this.excludeList = excludeList.map(item => this.asRegex(item));
  }

  public checkIncludeExclude(value: string): boolean {
    const checkList = list => list.some((item: RegExp) => item.test(value));

    if (checkList(this.excludeList)) {
      return false;
    }

    return this.includeList.length === 0 || checkList(this.includeList);
  }

  asRegex = (element: string) => RegExp(element.replace(/\./g, '\\.').replace(/\*/g, '.*'));
  include = (item: string) => this.includeList.push(this.asRegex(item));
  exclude = (item: string) => this.excludeList.push(this.asRegex(item));
}
