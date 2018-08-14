import { SearchTaxonomy } from './search-taxonomy';
import { SearchParameter } from './parameters/search-parameter';

describe('SearchTaxonomy', () => {
  const caTaxonomy = 'dms_data:msc:observation:atmospheric:surface_weather:ca-1.1-ascii';
  const networkParam = new SearchParameter('network', ['ca', 'nc awos'], false, false);
  const organizationParam = new SearchParameter('organization', ['msc', 'nav canada'], false, false);
  // need to specify 'ca' because it only sees 'ca-1.1-ascii' as the keyword
  const extraKeywords = ['ca'];

  const searchTaxonomy = new SearchTaxonomy(caTaxonomy, [networkParam, organizationParam], extraKeywords);

  it('should map keywords with search categories', () => {
    expect(searchTaxonomy.includesSearchWord('network', 'ca')).toBeTruthy();
    expect(searchTaxonomy.includesSearchWord('network', 'nc awos')).toBeFalsy();

    expect(searchTaxonomy.includesSearchWord('organization', 'msc')).toBeTruthy();
    expect(searchTaxonomy.includesSearchWord('organization', 'nav canada')).toBeFalsy();
  });
});
