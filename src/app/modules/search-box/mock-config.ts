import { SearchParameter } from './search-parameter';
import { SearchTaxonomy } from './search-taxonomy';
import { EquivalentKeywords } from './equivalent-keywords';

/** TODO: all of the below would be defined in a config */

// list of choices
const organization: string[] = [ "msc", "wmo", "nws", "nav_canada", "dnd" ]; // more vlaues
const category: string[] = [ "atmospheric", "hydrospheric", "cryopheric" ];
const type: string[] = ["observation", "forecast", "warning" ];
const nw_dataset: string[] = [ "surface_weather", "aviation", "marine" ]; // more values
const op_dataset: string[] = [ "cs", "awos", "manned", "metar"]; // more vlaues

// this is a mock list, should actually be made from config file
export const SEARCH_LIST: SearchParameter[] = [
    // category name, the choices, and if search is restricted to these choices, and placeholder for input box
    new SearchParameter("organization", organization, true, "msc, dnd, ..."),
    new SearchParameter("category", category, true),
    new SearchParameter("type", type, true),
    new SearchParameter("network dataset", nw_dataset, true),
    new SearchParameter("operational dataset", op_dataset, true)
];

export const TAXONOMIES: SearchTaxonomy[] = [
    new SearchTaxonomy("/nav_canada/observation/atmospheric/surface_weather/hwos-1.1-binary", 
        ["nc", "nav canada", "nav can"]),
    new SearchTaxonomy("/nav_canada/observation/atmospheric/surface_weather/awos-2.1-binary", 
        ["nc", "nav canada", "nav can"]),
    new SearchTaxonomy("/dnd/observation/atmospheric/surface_weather/hwos-1.0-binary", 
        ["dnd", "national defence"]),
    new SearchTaxonomy("/msc/observation/atmospheric/surface_weather/ca-1.1-ascii",
        [])
]

export const ALL_EQUIVS: EquivalentKeywords[] = [
    new EquivalentKeywords("nav_canada", ["nc", "nav canada", "nav can"]),
    new EquivalentKeywords("dnd", ["national defense", "national defence"])
]