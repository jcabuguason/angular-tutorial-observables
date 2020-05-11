import { TestBed } from '@angular/core/testing';
import { SearchURLService } from './search-url.service';

import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { SearchParameter } from './parameters/search-parameter';
import { ShortcutModel } from './model/shortcut.model';
import { ChoiceModel } from './model/choice.model';
import { SearchCheckbox } from './parameters/search-checkbox';
import { ParameterName } from './enums/parameter-name.enum';

describe('SearchURLService', () => {
  let urlService: SearchURLService;

  const dateParam = new SearchDatetime({ name: ParameterName.FROM });
  const hoursParam = new SearchHoursRange({
    name: ParameterName.HOURS_RANGE,
    urlNameBefore: 'hh_before',
    urlNameAfter: 'hh_after',
  });
  const networkParam = new SearchParameter({ name: ParameterName.NETWORK });
  const independentCheckbox = new SearchCheckbox({
    name: ParameterName.CHECKBOX,
    typeValue: 'exact',
    requiredParams: [],
  });
  const stationParam = new SearchParameter({ name: ParameterName.STATION_ID, urlName: 'climid' });
  const displayParams = [dateParam, hoursParam, networkParam, independentCheckbox, stationParam];

  const shortcuts = [
    new ShortcutModel('Shortcut1', [{ name: ParameterName.NETWORK, values: ['value1'] }]),
    new ShortcutModel('Shortcut2', [{ name: 'name2', values: ['value2'] }]),
  ];

  const query = {
    from: '2018-01-31T01:20',
    hh_before: '1',
    hh_after: '2',
    network: 'nc awos',
    shortcut: 'Shortcut1',
    checkbox: 'exact',
    climid: '123456',
  };

  const dateToSearch = { param: dateParam, value: [query.from] };
  const hourRangeToSearch = {
    param: hoursParam,
    value: [{ hh_before: '1', hh_after: '2' }],
  };
  const networkToSearch = { param: networkParam, value: [query.network] };
  const shortcutToSearch = { param: networkParam, value: ['value1'] };
  const checkboxToSearch = { param: independentCheckbox, value: ['exact'] };
  const stationToSearch = { param: stationParam, value: ['123456'] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchURLService],
    });

    urlService = TestBed.inject(SearchURLService);
  });

  it('create url parameters (no shortcut)', () => {
    const dateValue = '2018-02-27T01:00';
    const hoursValue = { hh_before: 10, hh_after: 20 };
    const networkValues = ['ca', 'nc awos'];
    const stationValues = ['123456'];

    dateParam.datetime = dateValue.replace('T', ' ');
    hoursParam.hoursBefore = Number(hoursValue.hh_before);
    hoursParam.hoursAfter = Number(hoursValue.hh_after);
    networkParam.selected = networkValues;
    independentCheckbox.checked = true;
    stationParam.selected = stationValues;

    const urlParams = [
      { name: ParameterName.FROM, value: dateValue },
      { name: 'hh_before', value: hoursValue.hh_before },
      { name: 'hh_after', value: hoursValue.hh_after },
      { name: ParameterName.NETWORK, value: networkValues[0] },
      { name: ParameterName.NETWORK, value: networkValues[1] },
      { name: ParameterName.CHECKBOX, value: 'exact' },
      { name: 'climid', value: stationValues[0] },
    ];

    expect(urlService.createUrlParams(displayParams)).toEqual(urlParams);
  });

  it('create url parameters with specified uri values (may be different than displayed search label)', () => {
    const networkChoices = [new ChoiceModel('caLabel', 'caUri'), new ChoiceModel('nc awos label')];

    const newNetworkParam = new SearchParameter({ name: 'networkWithChoices', choices: networkChoices });
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

    const dependentCheckbox = new SearchCheckbox({
      name: ParameterName.CHECKBOX,
      typeValue: 'exact',
      requiredParams: [networkParam],
    });
    dependentCheckbox.checked = true;

    const urlParams = [
      { name: ParameterName.NETWORK, value: newNetworkValues[0] },
      { name: ParameterName.NETWORK, value: newNetworkValues[1] },
    ];

    expect(urlService.createUrlParams([networkParam])).toEqual(urlParams);
  });

  it('should not update the URI with a dependent query parameter if its missing requirements', () => {
    // Equivalent to the networkParam being unfilled
    networkParam.selected.length = 0;

    const dependentCheckbox = new SearchCheckbox({
      name: ParameterName.CHECKBOX,
      typeValue: 'exact',
      requiredParams: [networkParam],
    });
    dependentCheckbox.checked = true;

    const urlParams = [];

    expect(urlService.createUrlParams([networkParam])).toEqual(urlParams);
  });

  it('create url parameter for shortcut', () => {
    const urlParams = [{ name: 'shortcut', value: shortcuts[0].label }];
    expect(urlService.createUrlParams(displayParams, shortcuts[0])).toEqual(urlParams);
  });

  it('check special parameters (date, hour range, query type)', () => {
    expect(urlService.isSpecialUrlParam(ParameterName.FROM, displayParams)).toBeTruthy();
    expect(urlService.isSpecialUrlParam(ParameterName.HOURS_RANGE, displayParams)).toBeTruthy();
    expect(urlService.isSpecialUrlParam(ParameterName.NETWORK, displayParams)).toBeFalsy();
    expect(urlService.isSpecialUrlParam(ParameterName.CHECKBOX, displayParams)).toBeTruthy();
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

  it('get checkbox parameter', () => {
    expect(urlService.getCheckboxRequestParams(query, displayParams)).toEqual([checkboxToSearch]);
  });

  it('get all parameters', () => {
    const allExpected = [
      dateToSearch,
      hourRangeToSearch,
      networkToSearch,
      shortcutToSearch,
      checkboxToSearch,
      stationToSearch,
    ];
    const allParams = urlService.getAllRequestParams(query, displayParams, shortcuts);

    expect(allParams.length).toEqual(allExpected.length);

    allExpected.forEach((expected) => expect(allParams).toContain(expected));

    // this would return false because not same order, even with .sort()
    // expect(allParams).toEqual(allExpected);
  });
});
