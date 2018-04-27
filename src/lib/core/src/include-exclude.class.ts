export class IncludeExclude {

    private includeList: RegExp[] = [];
    private excludeList: RegExp[] = [];

    constructor(includeList: string[], excludeList: string[]) {
        this.includeList = includeList
            .map(item => RegExp(item));

        this.excludeList = excludeList
            .map(item => RegExp(item));
    }

    public checkIncludeExclude(value: string): boolean {
        const checkList = (list) => list.some((item: RegExp) => item.test(value));

        if (checkList(this.excludeList)) { return false; }

        return (this.includeList.length > 0)
            ? checkList(this.includeList)
            : true;
    }

}
