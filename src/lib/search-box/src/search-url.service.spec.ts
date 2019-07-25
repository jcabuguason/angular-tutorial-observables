import { TestBed } from '@angular/core/testing';
import { SearchURLService } from './search-url.service';

import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { SearchParameter, ParameterName } from './parameters/search-parameter';
import { ShortcutModel } from './model/shortcut.model';
import { ChoiceModel } from './model/choice.model';
import { SearchQueryType } from './parameters/search-query-type';

describe('SearchURLService', () => {
  let urlService: SearchURLService;

  const dateParam = new SearchDatetime(ParameterName.FROM, false);
  const hoursParam = new SearchHoursRange(ParameterName.HOURS_RANGE, false);
  const networkParam = new SearchParameter(ParameterName.forTaxonomy.NETWORK, [], false, false);
  const independentQueryParam = new SearchQueryType(ParameterName.QUERY_TYPE, 'exact', []);
  const displayParams = [dateParam, hoursParam, networkParam, independentQueryParam];

  const shortcuts = [
    new ShortcutModel('Shortcut1', [{ name: ParameterName.forTaxonomy.NETWORK, values: ['value1'] }]),
    new ShortcutModel('Shortcut2', [{ name: 'name2', values: ['value2'] }]),
  ];

  const query = {
    from: '2018-01-31T01:20',
    hh_before: '1',
    hh_after: '2',
    network: 'nc awos',
    shortcut: 'Shortcut1',
    queryType: 'exact',
  };

  const dateToSearch = { param: dateParam, value: [query.from] };
  const hourRangeToSearch = {
    param: hoursParam,
    value: [{ hh_before: '1', hh_after: '2' }],
  };
  const networkToSearch = { param: networkParam, value: [query.network] };
  const shortcutToSearch = { param: networkParam, value: ['value1'] };
  const queryTypeToSearch = { param: independentQueryParam, value: ['exact'] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchURLService],
    });

    urlService = TestBed.get(SearchURLService);
  });

  it('create url parameters (no shortcut)', () => {
    const dateValue = '2018-02-27T01:00';
    const hoursValue = { hh_before: 10, hh_after: 20 };
    const networkValues = ['ca', 'nc awos'];

    dateParam.datetime = new Date(dateValue);
    hoursParam.hoursBefore = Number(hoursValue.hh_before);
    hoursParam.hoursAfter = Number(hoursValue.hh_after);
    networkParam.selected = networkValues;
    independentQueryParam.checked = true;

    const urlParams = [
      { name: ParameterName.FROM, value: dateValue },
      { name: 'hh_before', value: hoursValue.hh_before },
      { name: 'hh_after', value: hoursValue.hh_after },
      { name: ParameterName.forTaxonomy.NETWORK, value: networkValues[0] },
      { name: ParameterName.forTaxonomy.NETWORK, value: networkValues[1] },
      { name: ParameterName.QUERY_TYPE, value: 'exact' },
    ];

    expect(urlService.createUrlParams(displayParams)).toEqual(urlParams);
  });

  it('create url parameters with specified uri values (may be different than displayed search label)', () => {
    const networkChoices = [new ChoiceModel('caLabel', 'caUri'), new ChoiceModel('nc awos label')];

    const newNetworkParam = new SearchParameter('networkWithChoices', networkChoices, false, false);
    newNetworkParam.selected = ['caLabel', 'nc awos label'];

    const urlParams = [
      { name: 'networkWithChoices', value: networkChoices[0].uri },
      { name: 'networkWithChoices', value: networkChoices[1].label },
    ];

    expect(urlService.createUrlParams([newNetworkParam])).toEqual(urlParams);
  });

  it('should update the URI with a dependent query parameter', () => {
    const newNetworkValues = ['ca', 'nc awos'];
    networkParam.selected = newNetworkValues;

    const dependentQueryParam = new SearchQueryType(ParameterName.QUERY_TYPE, 'exact', [networkParam]);
    dependentQueryParam.checked = true;

    const urlParams = [
      { name: ParameterName.forTaxonomy.NETWORK, value: newNetworkValues[0] },
      { name: ParameterName.forTaxonomy.NETWORK, value: newNetworkValues[1] },
    ];

    expect(urlService.createUrlParams([networkParam])).toEqual(urlParams);
  });

  it('should not update the URI with a dependent query parameter if its missing requirements', () => {
    // Equivalent to the networkParam being unfilled
    networkParam.selected.length = 0;

    const dependentQueryParam = new SearchQueryType(ParameterName.QUERY_TYPE, 'exact', [networkParam]);
    dependentQueryParam.checked = true;

    const urlParams = [];

    expect(urlService.createUrlParams([networkParam])).toEqual(urlParams);
  });

  it('create url parameter for shortcut', () => {
    const urlParams = [{ name: 'shortcut', value: shortcuts[0].label }];
    expect(urlService.createUrlParams(displayParams, shortcuts[0])).toEqual(urlParams);
  });

  it('check special parameters (parameters that dont match the given list)', () => {
    expect(urlService.isSpecialUrlParam(ParameterName.FROM, displayParams)).toBeTruthy();
    expect(urlService.isSpecialUrlParam(ParameterName.HOURS_RANGE, displayParams)).toBeTruthy();
    expect(urlService.isSpecialUrlParam(ParameterName.forTaxonomy.NETWORK, displayParams)).toBeFalsy();
    expect(urlService.isSpecialUrlParam(ParameterName.QUERY_TYPE, displayParams)).toBeTruthy();

    expect(urlService.isSpecialUrlParam('param not in list', displayParams)).toBeTruthy();
  });

  it('get shortcut parameter', () => {
    expect(urlService.getShortcutRequestParams(query, displayParams, shortcuts)).toEqual([shortcutToSearch]);
  });

  it('get date parameter', () => {
    expect(urlService.getDateRequestParams(query, displayParams)).toEqual([dateToSearch]);
  });

  it('get hour range parameter', () => {
    expect(urlService.getHourRangeRequestParams(query, displayParams)).toEqual([hourRangeToSearch]);
  });

  it('get query type parameter', () => {
    expect(urlService.getQueryTypeRequestParams(query, displayParams)).toEqual([queryTypeToSearch]);
  });

  it('get all parameters', () => {
    const allExpected = [dateToSearch, hourRangeToSearch, networkToSearch, shortcutToSearch, queryTypeToSearch];
    const allParams = urlService.getAllRequestParams(query, displayParams, shortcuts);

    expect(allParams.length).toEqual(allExpected.length);

    allExpected.forEach(expected => expect(allParams).toContain(expected));

    // this would return false because not same order, even with .sort()
    // expect(allParams).toEqual(allExpected);
  });
});
