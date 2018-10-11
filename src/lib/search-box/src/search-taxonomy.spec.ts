import { SearchTaxonomy } from './search-taxonomy';
import { SearchParameter } from './parameters/search-parameter';
import { ChoiceModel } from './model/choice.model';

describe('SearchTaxonomy', () => {
  const caTaxonomy = 'dms_data+msc+observation+atmospheric+surface_weather+ca-1.1-ascii';
  const networkParam = new SearchParameter('network', [new ChoiceModel('ca'), new ChoiceModel('nc awos')], false, false);
  const organizationParam = new SearchParameter('organization', [new ChoiceModel('msc'), new ChoiceModel('nav canada')], false, false);
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
