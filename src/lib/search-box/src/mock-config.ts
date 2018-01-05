import { SearchParameter } from './search-parameter';
import { SearchTaxonomy, SearchTaxonomyWord } from './search-taxonomy';
import { EquivalentKeywords } from './equivalent-keywords';
import { SearchDatetime } from './search-datetime';

/** TODO: all of the below would be defined in a config */

// list of choices
const organization: string[] = [ 'msc', 'wmo', 'nws', 'nav_canada', 'dnd' ]; // more vlaues
const category: string[] = [ 'atmospheric', 'hydrospheric', 'cryopheric' ];
const type: string[] = ['observation', 'forecast', 'warning' ];
const nw_dataset: string[] = [ 'surface_weather', 'aviation', 'marine' ]; // more values
const op_dataset: string[] = [ 'cs', 'awos', 'manned', 'metar']; // more vlaues

// this is a mock list, should actually be made from config file
export const SEARCH_LIST: SearchParameter[] = [
    // category name, choices, restricted to these choices, required, number of times usable (optional), and placeholder string (optional)
    new SearchParameter('organization', organization, true, false),
    new SearchParameter('type', type, true, false),
    new SearchParameter('category', category, true, false),
    new SearchParameter('network dataset', nw_dataset, true, false),
    new SearchParameter('operational dataset', op_dataset, true, false),
    new SearchParameter('station name', [], false, false),
    new SearchDatetime('start datetime', [], false, false, 1),
    new SearchDatetime('end datetime', [], false, false, 1)
];

export const TAXONOMIES: SearchTaxonomy[] = [
    new SearchTaxonomy('nav_canada:observation:atmospheric:surface_weather:hwos-1.1-binary',
        [
          new SearchTaxonomyWord('organization', ['nav_canada']),
          new SearchTaxonomyWord('type', ['observation']),
          new SearchTaxonomyWord('category', ['atmospheric']),
          new SearchTaxonomyWord('network dataset', ['surface_weather']),
        ]),
    new SearchTaxonomy('nav_canada:observation:atmospheric:surface_weather:awos-2.1-binary',
        [
          new SearchTaxonomyWord('organization', ['nav_canada']),
          new SearchTaxonomyWord('type', ['observation']),
          new SearchTaxonomyWord('category', ['atmospheric']),
          new SearchTaxonomyWord('network dataset', ['surface_weather']),
        ]),
    new SearchTaxonomy('dnd:observation:atmospheric:surface_weather:hwos-1.0-binary',
        [
          new SearchTaxonomyWord('organization', ['dnd']),
          new SearchTaxonomyWord('type', ['observation']),
          new SearchTaxonomyWord('category', ['atmospheric']),
          new SearchTaxonomyWord('network dataset', ['surface_weather']),
        ]),
    new SearchTaxonomy('msc:observation:atmospheric:surface_weather:ca-1.1-ascii',
        [
          new SearchTaxonomyWord('organization', ['msc']),
          new SearchTaxonomyWord('type', ['observation']),
          new SearchTaxonomyWord('category', ['atmospheric']),
          new SearchTaxonomyWord('network dataset', ['surface_weather']),
        ]),
];

export const ALL_EQUIVS: EquivalentKeywords[] = [
    new EquivalentKeywords('nav_canada', ['nc', 'nav canada', 'nav can']),
    new EquivalentKeywords('dnd', ['national defense', 'national defence'])
];
