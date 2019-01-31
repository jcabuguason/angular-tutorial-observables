export class SearchTaxonomy {
  /**
   * @param taxonomy The taxonomy (ex: 'dms_data:msc:observation:atmospheric:surface_weather:ca-1.1-ascii')
   * @param networkCode Code value for the network (used in URI parameters)
   * @param organizationCode Code value for the organization (used in URI parameters)
   */
  constructor(public taxonomy: string, public networkCode: string, public organizationCode: string = '') {}
}
