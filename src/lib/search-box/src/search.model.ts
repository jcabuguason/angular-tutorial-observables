export class SearchModel {
  constructor (
    public taxonomy: string[],
    public stnName: string[],
    public startDate?: Date,
    public endDate?: Date
  ) { }
}
