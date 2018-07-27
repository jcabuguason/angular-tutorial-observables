import { TestBed } from '@angular/core/testing';
import { SearchURLService } from './search-url.service';

import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { SearchParameter, ParameterName } from './parameters/search-parameter';
import { ShortcutModel } from './model/shortcut.model';

describe('SearchURLService', () => {
  let urlService: SearchURLService;

  const dateParam = new SearchDatetime(ParameterName.FROM, false);
  const hoursParam = new SearchHoursRange(ParameterName.HOURS_RANGE, false);
  const networkParam = new SearchParameter(ParameterName.forTaxonomy.NETWORK, [], false, false);

  const displayParams = [ dateParam, hoursParam, networkParam ];

  const shortcuts = [
    new ShortcutModel('Shortcut1', [{ name: ParameterName.forTaxonomy.NETWORK, values: ['value1'] }]),
    new ShortcutModel('Shortcut2', [{ name: 'name2', values: ['value2'] }])
  ];

  const query = {
    'from': '2018-01-31T01:20',
    'hh_before': '1',
    'hh_after': '2',
    'network': 'nc awos',
    'shortcut': 'Shortcut1'
  };

  const dateToSearch = { 'param': dateParam, 'value': [query.from] };
  const hourRangeToSearch = { 'param': hoursParam, 'value': [{ 'hh_before': '1', 'hh_after': '2'}] };
  const networkToSearch = { 'param': networkParam, 'value': [query.network] };
  const shortcutToSearch = { 'param': networkParam, 'value': ['value1'] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchURLService
      ]
    });

    urlService = TestBed.get(SearchURLService);
  });

  it('create url parameters (no shortcut)', () => {
    const dateValue = '2018-02-27T01:00';
    const hoursValue = { 'hh_before': 10, 'hh_after': 20};
    const networkValues = ['ca', 'nc awos'];

    dateParam.datetime = new Date(dateValue);
    hoursParam.hoursBefore = Number(hoursValue.hh_before);
    hoursParam.hoursAfter = Number(hoursValue.hh_after);
    networkParam.selected = networkValues;

    const urlParams = [
      { 'name': ParameterName.FROM, 'value': dateValue },
      { 'name': 'hh_before',        'value': hoursValue.hh_before },
      { 'name': 'hh_after',         'value': hoursValue.hh_after },
      { 'name' : ParameterName.forTaxonomy.NETWORK, 'value': networkValues[0] },
      { 'name' : ParameterName.forTaxonomy.NETWORK, 'value': networkValues[1] },
    ];

    expect(urlService.createUrlParams(displayParams)).toEqual(urlParams);
  });

  it('create url parameter for shortcut', () => {
    const urlParams = [{ 'name': 'shortcut', 'value': shortcuts[0].label }];
    expect(urlService.createUrlParams(displayParams, shortcuts[0])).toEqual(urlParams);
  });

  it('check special parameters (parameters that dont match the given list)', () => {
    expect(urlService.isSpecialUrlParam(ParameterName.FROM, displayParams)).toBeTruthy();
    expect(urlService.isSpecialUrlParam(ParameterName.HOURS_RANGE, displayParams)).toBeTruthy();
    expect(urlService.isSpecialUrlParam(ParameterName.forTaxonomy.NETWORK, displayParams)).toBeFalsy();

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

  it('get all parameters', () => {
    const allExpected = [dateToSearch, hourRangeToSearch, networkToSearch, shortcutToSearch];
    const allParams = urlService.getAllRequestParams(query, displayParams, shortcuts);

    expect(allParams.length).toEqual(allExpected.length);

    allExpected.forEach(expected => expect(allParams).toContain(expected));

    // this would return false because not same order, even with .sort()
    // expect(allParams).toEqual(allExpected);
  });

});
