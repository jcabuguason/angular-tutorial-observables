import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchService } from './search.service';
import { SearchURLService } from './search-url.service';

import { SearchBoxConfig, SEARCH_BOX_CONFIG } from './search-box.config';

import { SearchParameter } from './parameters/search-parameter';
import { ShortcutModel } from './model/shortcut.model';
import { SearchDatetime } from './parameters/search-datetime';
import { SearchHoursRange } from './parameters/search-hours-range';
import { SearchTaxonomy } from './search-taxonomy';
import { SearchableElement, SearchModel } from './model/search.model';
import { ChoiceModel } from './model/choice.model';
import { MessageService } from 'primeng/api';
import { ESOperator } from 'msc-dms-commons-angular/core/elastic-search';
import { ParameterName } from './enums/parameter-name.enum';
import { TimeModelOptions } from './model/time-options.model';
import { calculateDate, TimeUnit, TimeOperator } from 'msc-dms-commons-angular/shared/util';
import { SearchQuick } from './parameters/search-quick';
import { TabOption } from './enums/tab-option.enum';

describe('SearchService', () => {
  let searchService: SearchService;

  const nameValueObj = (name, value) => ({ name: name, value: value });
  const paramValueObj = (param, value) => ({ param: param, value: value });
  const choiceModels = (array) => array.map((val) => new ChoiceModel(val));

  const caIndex = 'dms_data+msc+observation+atmospheric+surface_weather+ca-1.1-ascii';
  const raIndex = 'dms_data+msc+observation+atmospheric+surface_weather+ra-1.1-ascii';
  const dndAwosIndex = 'dms_data+dnd+observation+atmospheric+surface_weather+awos-1.0-binary';

  let sParams = {
    organizationParam: null,
    networkParam: null,
    stationIdParam: null,
    stationNameParam: null,
    startDateParam: null,
    endDateParam: null,
    hoursParam: null,
    relativeDate: null,
    provinceParam: null,
    sizeParam: null,
    quickStartDateParam: null,
    quickEndDateParam: null,
    quickOptionsParam: null,
  };

  class MockUrlService {
    createUrlParams(params, shortcut?) {
      const all = [];
      if (shortcut != null) {
        all.push(nameValueObj('shortcut', ['shortcutLabel']));
      } else {
        params.forEach((p) => all.push(...p.selected.map(() => nameValueObj('paramName', ['param Values']))));
      }
      return all;
    }
    getAllRequestParams(qParams, availableParams, shortcuts) {
      // should be formatted differently, but for testing purposes urlService will return this back
      return qParams;
    }
  }
  class EmptyComponent {}

  beforeEach(() => {
    const organization: ChoiceModel[] = choiceModels(['msc', 'dnd'].sort());
    const networks: ChoiceModel[] = choiceModels(['ca', 'ra', 'dnd awos'].sort());
    const provinces: ChoiceModel[] = choiceModels(['AB', 'BC', 'MB']);

    const quickArray = [
      {
        label: 'QUICK_MENU.LAST_15_MIN',
        uriLabel: 'last15min',
        timeSettings: {
          unit: TimeUnit.Minutes,
          value: 15,
        },
      },
      {
        label: 'QUICK_MENU.LAST_30_MIN',
        uriLabel: 'last30min',
        timeSettings: {
          unit: TimeUnit.Minutes,
          value: 30,
        },
      },
    ];

    sParams = {
      organizationParam: new SearchParameter({
        name: ParameterName.Organization,
        choices: organization,
        restricted: true,
      }),
      networkParam: new SearchParameter({
        name: ParameterName.Network,
        choices: networks,
        restricted: true,
      }),
      stationIdParam: new SearchParameter({ name: ParameterName.StationID }),
      stationNameParam: new SearchParameter({ name: ParameterName.StationName }),
      startDateParam: new SearchDatetime({ name: ParameterName.From }),
      endDateParam: new SearchDatetime({ name: ParameterName.To }),
      hoursParam: new SearchHoursRange({ name: ParameterName.HoursRange }),
      relativeDate: new SearchDatetime({ name: ParameterName.RelativeDatetime }),
      quickStartDateParam: new SearchDatetime({ name: ParameterName.QuickRangeFrom }),
      quickEndDateParam: new SearchDatetime({ name: ParameterName.QuickRangeTo }),
      quickOptionsParam: new SearchQuick({
        name: ParameterName.QuickRangeOptions,
        quickList: quickArray,
        numQuickCols: 3,
      }),
      provinceParam: new SearchParameter({ name: ParameterName.Province, choices: provinces, restricted: true }),
      sizeParam: new SearchParameter({
        name: ParameterName.Size,
        choices: [],
        restricted: false,
        required: false,
        timesUsable: 1,
      }),
    };

    const list = Object.keys(sParams).map((key) => sParams[key]);
    const config: SearchBoxConfig = {
      searchList: list,
      taxonomies: [
        new SearchTaxonomy(caIndex, 'ca', 'msc'),
        new SearchTaxonomy(raIndex, 'ra', 'msc'),
        new SearchTaxonomy(dndAwosIndex, 'dnd awos', 'dnd'),
      ],
      readOnlyBar: false,
      shortcuts: [new ShortcutModel('Shortcut1', [{ name: ParameterName.Network, values: ['ca', 'ra'] }])],
    };

    const routes = [{ path: '', component: EmptyComponent }];

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      providers: [
        SearchService,
        MessageService,
        { provide: SEARCH_BOX_CONFIG, useValue: config },
        { provide: SearchURLService, useClass: MockUrlService },
      ],
    });

    searchService = TestBed.inject(SearchService);
  });

  it('should check if parameter was already added', () => {
    const param1 = sParams.organizationParam;

    searchService.addSuggestedParameter(param1, ['msc']);
    searchService.addSuggestedParameter(param1, ['msc']);
    searchService.addSuggestedParameter(param1, ['dnd']);
    expect(searchService.displayParams).toEqual([param1]);
    expect(param1.getSelected()).toEqual(['msc', 'dnd']);
  });

  it('should add parameter by name', () => {
    searchService.addParameterByName(ParameterName.From);
    expect(searchService.displayParams).toEqual([sParams.startDateParam]);
  });

  it('should remove parameters', () => {
    const param1 = sParams.startDateParam;
    const param2 = sParams.endDateParam;
    const remove = sParams.stationNameParam;

    searchService.displayParams = [param1, remove, param2];
    searchService.removeDisplayParameter(remove);
    expect(searchService.displayParams).toEqual([param1, param2]);

    searchService.removeAllDisplayParameters();
    expect(searchService.displayParams).toEqual([]);
  });

  it('should determine missing parameters', () => {
    const missing = sParams.stationIdParam;
    missing.setRequired(true);
    expect(searchService.findMissingRequiredParameters()).toEqual([missing]);
  });

  it('should update suggested parameters after adding/removing', () => {
    const param1 = sParams.organizationParam;
    const param2 = sParams.networkParam;
    const expectedLength = searchService.config.searchList.length - 2;

    searchService.addSuggestedParameter(param1);
    searchService.addSuggestedParameter(param2);
    expect(searchService.suggestedParams.length).toEqual(expectedLength);
    expect(searchService.suggestedParams.includes(param1)).toBeFalsy();
    expect(searchService.suggestedParams.includes(param2)).toBeFalsy();

    searchService.removeDisplayParameter(param1);
    expect(searchService.suggestedParams.length).toEqual(expectedLength + 1);
    expect(searchService.suggestedParams.includes(param1)).toBeTruthy();
    expect(searchService.suggestedParams.includes(param2)).toBeFalsy();
  });

  it('should add date and hours range with values', () => {
    const dateValue = '2018-01-31T00:00Z';
    const hoursValue = { hh_before: 1, hh_after: 2 };

    searchService.addSuggestedParameter(sParams.relativeDate, [dateValue]);
    searchService.addSuggestedParameter(sParams.hoursParam, [hoursValue]);

    expect(searchService.displayParams).toEqual([sParams.relativeDate, sParams.hoursParam]);
    expect(sParams.relativeDate.getFullDatetime()).toEqual(new Date(dateValue));
    expect(sParams.hoursParam.hoursBefore).toEqual(1);
    expect(sParams.hoursParam.hoursAfter).toEqual(2);
  });

  it('should limit size on add', () => {
    const sizeValue = '2000';
    searchService.addSuggestedParameter(sParams.sizeParam, [sizeValue]);
    expect(sParams.sizeParam.getSelected()).toEqual([searchService.maxNumObs.toString()]);
  });

  it('should limit size on submit', () => {
    searchService.addSuggestedParameter(sParams.relativeDate, ['2018-01-03T12:00Z']);
    searchService.addSuggestedParameter(sParams.sizeParam);
    searchService.setSelectedRangeType(TabOption.Relative);
    sParams.sizeParam.selected = ['2000'];

    searchService.buildSearchModel();
    expect(sParams.sizeParam.selected).toEqual([searchService.maxNumObs.toString()]);
  });

  it('should adjust datetime in model if given hours range', () => {
    searchService.addSuggestedParameter(sParams.relativeDate, ['2018-01-03T12:00Z']);
    searchService.addSuggestedParameter(sParams.hoursParam, [{ hh_before: 12, hh_after: 36 }]);
    searchService.setSelectedRangeType(TabOption.Relative);

    const model = searchService.buildSearchModel();
    expect(model.from).toEqual(new Date('2018-01-03T00:00Z'));
    expect(model.to).toEqual(new Date('2018-01-05T00:00Z'));
  });

  it('should use default hours if specified', () => {
    sParams.hoursParam.setDefaultHours(5, 6);
    searchService.addSuggestedParameter(sParams.relativeDate, ['2018-01-07T05:30Z']);
    searchService.addSuggestedParameter(sParams.hoursParam);
    searchService.setSelectedRangeType(TabOption.Relative);

    const model = searchService.buildSearchModel();
    expect(model.from).toEqual(new Date('2018-01-07T00:30Z'));
    expect(model.to).toEqual(new Date('2018-01-07T11:30Z'));
  });

  it('should update url on submit', () => {
    searchService.addSuggestedParameter(sParams.networkParam, ['ca']);
    searchService.addSuggestedParameter(sParams.networkParam, ['dnd awos']);

    spyOn(searchService, 'updateUrl');
    searchService.submitSearch();
    expect(searchService.updateUrl).toHaveBeenCalledTimes(1);
  });

  it('should populate search box from url parameters', () => {
    // should be formatted differently, but for testing purposes urlService will return this back
    const params = [
      paramValueObj(sParams.relativeDate, ['2018-01-31T00:00Z']),
      paramValueObj(sParams.hoursParam, [{ hh_before: 12, hh_after: 21 }]),
      paramValueObj(sParams.networkParam, ['dnd awos']),
      paramValueObj(sParams.stationIdParam, ['123', 'abc']),
      paramValueObj(sParams.sizeParam, ['100']),
    ];
    spyOn(searchService, 'submitSearch');
    spyOn(searchService, 'updateUrl');

    searchService.searchByUrlParameters(params);
    expect(searchService.updateUrl).toHaveBeenCalledTimes(0);
    expect(searchService.submitSearch).toHaveBeenCalled();
    expect(searchService.displayParams).toEqual([
      sParams.relativeDate,
      sParams.hoursParam,
      sParams.networkParam,
      sParams.stationIdParam,
      sParams.sizeParam,
    ]);
    expect(sParams.relativeDate.datetime).toEqual('2018-01-31 00:00');
    expect(sParams.hoursParam.hoursBefore).toEqual(12);
    expect(sParams.hoursParam.hoursAfter).toEqual(21);
    expect(sParams.networkParam.selected).toEqual(['dnd awos']);
    expect(sParams.stationIdParam.selected).toEqual(['123', 'abc']);
    expect(sParams.sizeParam.selected).toEqual(['100']);
  });

  it('should create search model on submit', () => {
    searchService.addSuggestedParameter(sParams.networkParam, ['ca', 'dnd awos']);
    searchService.addSuggestedParameter(sParams.stationNameParam, ['station name']);
    searchService.addSuggestedParameter(sParams.startDateParam, ['2018-01-01T00:00Z']);
    searchService.addSuggestedParameter(sParams.endDateParam, ['2018-02-01T00:00Z']);
    searchService.addSuggestedParameter(sParams.provinceParam, ['AB']);

    const expectedHttpParams: HttpParams = new HttpParams({
      fromObject: {
        network: ['ca', 'dnd awos'],
        stationName: ['station name'],
        startDate: ['2018-01-01T00:00'],
        endDate: ['2018-02-01T00:00'],
        province: ['AB'],
      },
    });
    const expectedModel: SearchModel = {
      taxonomy: [caIndex, dndAwosIndex],

      query: [
        {
          operator: ESOperator.Or,
          elements: [
            {
              elementID: SearchableElement.STATION_NAME.id,
              value: 'station name',
              isCaseless: true,
            },
          ],
        },
        {
          operator: ESOperator.Or,
          elements: [
            {
              elementID: SearchableElement.PROVINCE.id,
              value: 'AB',
            },
          ],
        },
      ],
      from: new Date('2018-01-01T00:00Z'),
      to: new Date('2018-02-01T00:00Z'),
      size: 300,
      httpParams: expectedHttpParams,
    };

    expect(searchService.buildSearchModel()).toEqual(expectedModel);
  });

  it('differentiate between station ids', () => {
    const createElement = (value, type) => ({
      value: value,
      id: SearchableElement.STATION_TYPE[type].id,
    });

    const stations = [
      createElement('xyz', 'TC_ID'),
      createElement('12345', 'WMO_ID'),
      createElement('abcd', 'ICAO_ID'),
      createElement('123abcd', 'MSC_ID'),
      createElement('someId', 'MSC_ID'),
    ];

    searchService.addSuggestedParameter(
      sParams.stationIdParam,
      stations.map((s) => s.value),
    );

    const model = searchService.buildSearchModel();
    if (model.query == null || model.query.length !== 1) {
      fail('Needs query model');
    }

    stations.forEach((stn) =>
      expect(
        model.query[0].elements.some((element) => element.elementID === stn.id && element.value === stn.value),
      ).toBeTruthy(),
    );
  });

  it('should populate bar values to form', () => {
    searchService.readOnlyBar = true;
    searchService.addSuggestedParameter(sParams.provinceParam, ['BC']);
    searchService.addSuggestedParameter(sParams.relativeDate, ['2018-01-01 00:10']);
    searchService.addSuggestedParameter(sParams.hoursParam, [{ hh_before: 1, hh_after: 2 }]);
    searchService.openForm();

    expect(sParams.provinceParam.formSelected).toEqual(['BC']);
    expect(sParams.relativeDate.formDatetime).toEqual('2018-01-01 00:10');
    expect(sParams.hoursParam.formHoursBefore).toEqual(1);
    expect(sParams.hoursParam.formHoursAfter).toEqual(2);
  });

  it('should populate form values to bar', () => {
    sParams.sizeParam.formSelected = ['10'];
    sParams.relativeDate.formDatetime = '2018-01-30 05:00';
    sParams.hoursParam.formHoursBefore = 10;
    sParams.hoursParam.formHoursAfter = 20;
    searchService.setSelectedRangeType(TabOption.Relative);

    searchService.submitSearchForm();
    expect(sParams.sizeParam.getSelected()).toEqual(['10']);
    expect(sParams.relativeDate.datetime).toEqual('2018-01-30 05:00');
    expect(sParams.hoursParam.hoursBefore).toEqual(10);
    expect(sParams.hoursParam.hoursAfter).toEqual(20);
  });

  it('should handle spaces for station search', () => {
    searchService.addSuggestedParameter(sParams.stationNameParam, ['normal', '  spaced out  ']);

    const model = searchService.buildSearchModel();

    if (model.query == null || model.query.length !== 1) {
      fail('Unexpected query model');
    }

    expect(model.query[0].elements.map((e) => e.value)).toEqual(['normal', 'spaced out']);
  });

  it('should mark empty searches as invalid', () => {
    expect(searchService.hasValidParameters()).toBeFalsy();
  });

  it('should mark non-empty searches as valid', () => {
    searchService.addSuggestedParameter(sParams.organizationParam, ['msc']);
    expect(searchService.hasValidParameters()).toBeTruthy();
  });

  it('should return taxonomies with matching network', () => {
    searchService.addSuggestedParameter(sParams.networkParam, ['ca', 'dnd awos']);
    expect(searchService.buildSearchModel().taxonomy).toEqual([caIndex, dndAwosIndex]);
  });

  it('should return taxonomies with matching organization', () => {
    searchService.addSuggestedParameter(sParams.organizationParam, ['msc']);
    expect(searchService.buildSearchModel().taxonomy).toEqual([caIndex, raIndex]);
  });

  it('should return taxonomies with matching network & organization', () => {
    searchService.addSuggestedParameter(sParams.networkParam, ['ca', 'dnd awos']);
    searchService.addSuggestedParameter(sParams.organizationParam, ['msc']);
    expect(searchService.buildSearchModel().taxonomy).toEqual([caIndex]);
  });

  it('should use datetime on submit', () => {
    searchService.addSuggestedParameter(sParams.startDateParam, ['2018-01-01T00:00Z']);
    searchService.addSuggestedParameter(sParams.endDateParam, ['2018-02-01T00:00Z']);
    searchService.addSuggestedParameter(sParams.hoursParam, [{ hh_before: 1, hh_after: 1 }]);
    searchService.addSuggestedParameter(sParams.relativeDate, ['2018-03-01T03:00Z']);
    searchService.setSelectedRangeType(TabOption.Absolute);

    const model = searchService.buildSearchModel();
    expect(model.from).toEqual(new Date('2018-01-01T00:00Z'));
    expect(model.to).toEqual(new Date('2018-02-01T00:00Z'));
  });

  it('should use hour ranges on submit', () => {
    searchService.addSuggestedParameter(sParams.startDateParam, ['2018-01-01T00:00Z']);
    searchService.addSuggestedParameter(sParams.endDateParam, ['2018-02-01T00:00Z']);
    searchService.addSuggestedParameter(sParams.hoursParam, [{ hh_before: 1, hh_after: 1 }]);
    searchService.addSuggestedParameter(sParams.relativeDate, ['2018-03-01T03:00Z']);
    searchService.setSelectedRangeType(TabOption.Relative);

    const model = searchService.buildSearchModel();
    expect(model.from).toEqual(new Date('2018-03-01T02:00Z'));
    expect(model.to).toEqual(new Date('2018-03-01T04:00Z'));
  });

  it('should adjust the "From" date to be before the "To" date on submit', () => {
    searchService.addSuggestedParameter(sParams.startDateParam, ['2018-02-03T00:00Z']);
    searchService.addSuggestedParameter(sParams.endDateParam, ['2018-02-02T00:00Z']);
    searchService.setSelectedRangeType(TabOption.Absolute);
    searchService.submitSearch();

    const fromDate = searchService.availableParams.find(
      (param) => param.getName() === ParameterName.From,
    ) as SearchDatetime;
    const toDate = searchService.availableParams.find(
      (param) => param.getName() === ParameterName.To,
    ) as SearchDatetime;

    expect(fromDate.getFullDatetime()).toEqual(new Date('2018-02-02T00:00Z'));
    expect(toDate.getFullDatetime()).toEqual(new Date('2018-02-03T00:00Z'));
  });

  it('should allow searches with just "From" date', () => {
    searchService.addSuggestedParameter(sParams.startDateParam, ['2020-02-20T20:00Z']);
    searchService.setSelectedRangeType(TabOption.Absolute);
    searchService.submitSearch();

    const fromDate = searchService.availableParams.find(
      (param) => param.getName() === ParameterName.From,
    ) as SearchDatetime;
    const toDate = searchService.availableParams.find(
      (param) => param.getName() === ParameterName.To,
    ) as SearchDatetime;

    expect(fromDate.getFullDatetime()).toEqual(new Date('2020-02-20T20:00Z'));
    expect(toDate.isUnfilled()).toBeTruthy();
  });

  it('should allow searches with just "To" date', () => {
    searchService.addSuggestedParameter(sParams.endDateParam, ['2020-02-20T20:00Z']);
    searchService.setSelectedRangeType(TabOption.Absolute);
    searchService.submitSearch();

    const fromDate = searchService.availableParams.find(
      (param) => param.getName() === ParameterName.From,
    ) as SearchDatetime;
    const toDate = searchService.availableParams.find(
      (param) => param.getName() === ParameterName.To,
    ) as SearchDatetime;

    expect(fromDate.isUnfilled()).toBeTruthy();
    expect(toDate.getFullDatetime()).toEqual(new Date('2020-02-20T20:00Z'));
  });

  it('should update quick from/to parameters', () => {
    const timeOptions: TimeModelOptions = {
      value: 10,
      unit: TimeUnit.Hours,
    };
    const uriLabel: string = 'last10hours';
    const fromDate = searchService.availableParams.find(
      (param) => param.getName() === ParameterName.QuickRangeFrom,
    ) as SearchDatetime;
    const toDate = searchService.availableParams.find(
      (param) => param.getName() === ParameterName.QuickRangeTo,
    ) as SearchDatetime;

    searchService.updateQuickField(timeOptions, uriLabel);

    //round to the nearest minute
    const subtractedDate = calculateDate({ mode: TimeOperator.Subtract, unit: TimeUnit.Hours, amount: 10 });
    subtractedDate.setUTCSeconds(0, 0);
    const currentDate = new Date();
    currentDate.setUTCSeconds(0, 0);

    expect(fromDate.getFullDatetime()).toEqual(subtractedDate);
    expect(toDate.getFullDatetime()).toEqual(currentDate);
  });
});
