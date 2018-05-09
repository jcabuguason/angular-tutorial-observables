import { TestBed, getTestBed } from '@angular/core/testing';
import { Location } from '@angular/common';

import { SearchService } from './search.service';
import { SearchBoxConfig, SEARCH_BOX_CONFIG } from './search-box.config';
import { SearchTaxonomy } from './search-taxonomy';
import { SearchParameter } from './search-parameter';
import { SearchDatetime } from './search-datetime';
import { SearchHoursRange } from './search-hours-range';
import { SearchModel, SearchElement } from './search.model';
import { EquivalentKeywords } from './equivalent-keywords';

describe('SearchService', () => {
  let searchService: SearchService;

  const organizations: string[] = [ 'msc', 'nav_canada', 'dnd'];
  const networks: string[] = ['ca', 'nc awos', 'dnd hwos'];
  const provinces: string[] = [ 'AB', 'BC'];

  let orgParam: SearchParameter,
    networkParam: SearchParameter,
    stnParam: SearchParameter,
    provParam: SearchParameter,
    sizeParam: SearchParameter,
    startDateParam: SearchDatetime,
    endDateParam: SearchDatetime,
    hoursParam: SearchHoursRange;

  beforeEach(() => {
    orgParam = new SearchParameter('organization', organizations, true, false);
    networkParam = new SearchParameter('network', networks, true, false, 2);
    stnParam = new SearchParameter('stnName', [], false, false);
    provParam = new SearchParameter('province', provinces, true, false);
    sizeParam = new SearchParameter('size', [], false, false, 1);
    startDateParam = new SearchDatetime('from', false, 1);
    endDateParam = new SearchDatetime('to', false, 1);
    hoursParam = new SearchHoursRange('hoursRange', false);

    const searchList: SearchParameter[] = [
      orgParam,
      networkParam,
      stnParam,
      provParam,
      startDateParam,
      endDateParam,
      sizeParam,
      hoursParam
    ];

    const config: SearchBoxConfig = {
      search_list: searchList,
      taxonomies: [
        new SearchTaxonomy('dms_data:msc:observation:atmospheric:surface_weather:ca-1.1-ascii', searchList, ['ca']),
        new SearchTaxonomy('dms_data:nav_canada:observation:atmospheric:surface_weather:awos-2.1-binary', searchList, ['nc awos']),
        new SearchTaxonomy('dms_data:dnd:observation:atmospheric:surface_weather:hwos-1.0-binary', searchList, ['dnd hwos'])
      ],
      equivalent_words: [new EquivalentKeywords('nc awos', ['nav can awos'])]
    };

    TestBed.configureTestingModule({
      providers: [
        SearchService,
        { provide: Location, useValue: { go: () => {}}},
        { provide: SEARCH_BOX_CONFIG, useValue: config }]
    });

    searchService = getTestBed().get(SearchService);
  });


  it('should find choices containing "a" for network category', () => {
    expect(searchService.displayParams.length).toEqual(0);
    const expected = ['ca', 'nc awos'];
    searchService.addNewParameter('network');
    searchService.showSuggestedChoices('a', 0);
    expect(searchService.displayParams[0].getDisplayChoices()).toEqual(expected);
  });

  it('should determine/add parameter category given one of the choices', () => {
    searchService.addNewParameter('ca');

    const displayParam = searchService.displayParams.find(p => p.getSearchParam() === networkParam);
    expect(displayParam).toBeDefined();
    expect(displayParam.getValue()).toEqual('ca');
  });

  it ('should remove parameter', () => {
    expect(searchService.displayParams.length).toEqual(0);
    searchService.addNewParameter('network');
    expect(searchService.displayParams.length).toEqual(1);
    searchService.removeDisplay(0);
    expect(searchService.displayParams.length).toEqual(0);
  });

  it('should determine missing parameters', () => {
    orgParam.setRequired(true);
    expect(searchService.missingParameters().length).toEqual(1);
  });

  it('should associate equivalent keywords', () => {
    searchService.addNewParameter('nav can awos');
    expect(searchService.displayParams.length).toEqual(1);
    expect(searchService.displayParams[0].getKey()).toEqual('network');
    expect(searchService.displayParams[0].getValue()).toEqual('nc awos');
  });

  it('should create search model from url params', () => {
    const params = { stnName: '1234567', from: '2018-01-01T01:00', to: '2018-01-02T01:00',
      network: 'ca'};

    const expectedModel = new SearchModel(['dms_data:msc:observation:atmospheric:surface_weather:ca-1.1-ascii'],
      [new SearchElement(searchService.MSC_ID, 'metadataElements', 'value', params.stnName)],
      new Date(params.from), new Date(params.to), 300, 'AND');

    searchService.searchRequested.subscribe(model => {
      expect(model).toEqual(expectedModel);
    });

    searchService.executeSearch(params);
  });

  it('should limit size param to 1000', () => {
    searchService.addNewParameter('size');
    searchService.displayParams[0].setValue('9000');
    expect(searchService.getSearchModel().size).toEqual(1000);
  });

  it('change invalid size values to default', () => {
    searchService.addNewParameter('size');
    searchService.displayParams[0].setValue('abc');
    expect(searchService.getSearchModel().size).toEqual(300);
  });

  it('differentiate between station ids', () => {
    const ids = [
      { elementID: searchService.MSC_ID, testID: '123abcd'},
      { elementID: searchService.ICAO_ID, testID: 'abcd'},
      { elementID: searchService.TC_ID, testID: 'xyz'},
      { elementID: searchService.SYNOP_ID, testID: '12345'},
    ];

    searchService.addNewParameter('stnName');
    ids.forEach(id => {
      searchService.addValueToDisplay(id.testID, 0);
      expect(searchService.getSearchModel().elements)
        .toEqual([new SearchElement(id.elementID, 'metadataElements', 'value', id.testID.toUpperCase())]);
    });
  });

  it('add province to model', () => {
    searchService.addNewParameter('AB');
    expect(searchService.getSearchModel().elements).toEqual([new SearchElement(searchService.PROV_ID, 'metadataElements', 'value', 'AB')]);
  });

  it('should only allow network to be added 2 times max', () => {
    networks.forEach(network => searchService.addNewParameter(network));
    expect(networkParam.getTimesUsed()).toEqual(2);
    expect(searchService.displayParams.filter(p => p.getSearchParam() === networkParam).length).toEqual(2);
  });

  it('update url from search', () => {
    searchService.addSuggestedParameter(stnParam, '123456');
    searchService.addSuggestedParameter(stnParam, '987654');
    searchService.addSuggestedParameter(sizeParam, '5');
    searchService.addSuggestedParameter(startDateParam);
    startDateParam.setFullDatetime(new Date('2018-01-01T00:00'));

    spyOn(searchService.location, 'go');
    searchService.submitSearch();

    expect(searchService.location.go).toHaveBeenCalledWith('/?stnName=123456&stnName=987654&size=5&from=2018-01-01T00%3A00');
  });

  it('update hrs range from search', () => {
    searchService.addSuggestedParameter(hoursParam);
    hoursParam.setHours(5, 10);

    spyOn(searchService.location, 'go');
    searchService.submitSearch();
    expect(searchService.location.go).toHaveBeenCalledWith('/?hh_before=5&hh_after=10');
  });

  it('read hours range from url', () => {
    const params = { hh_before: '5', hh_after: '10'};
    searchService.executeSearch(params);
    expect(hoursParam.hoursBefore).toEqual(5);
    expect(hoursParam.hoursAfter).toEqual(10);
  });


});
