export class SearchModel {
  constructor (
    public taxonomy: string[],
    public stnName: string[],
    // TODO: will fix this later
    public startDate?: 'yyyyMMddHHmm',
    public endDate?: 'yyyyMMddHHmm'
  ) { }
}
