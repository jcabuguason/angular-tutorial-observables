export class SearchModel {
  constructor (
    public taxonomy: string[],
    public stnName: string[],
    public from?: Date,
    public to?: Date,
    public size?: number
  ) { }
}
