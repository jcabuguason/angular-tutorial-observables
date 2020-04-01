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
import { SearchableElement, SearchElement, SearchModel } from './model/search.model';
import { ChoiceModel } from './model/choice.model';
import { MessageService } from 'primeng/components/common/messageservice';
import { ESOperator } from 'msc-dms-commons-angular/core/elastic-search';
import { ParameterName } from './enums/parameter-name.enum';

describe('SearchService', () => {
  let searchService: SearchService;

  const nameValueObj = (name, value) => ({ name: name, value: value });
  const paramValueObj = (param, value) => ({ param: param, value: value });
  const choiceModels = array => array.map(val => new ChoiceModel(val));

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
    hoursRangeDate: null,
    provinceParam: null,
    sizeParam: null,
  };

  class MockUrlService {
    createUrlParams(params, shortcut?) {
      const all = [];
      if (shortcut != null) {
        all.push(nameValueObj('shortcut', ['shortcutLabel']));
      } else {
        params.forEach(p => all.push(...p.selected.map(() => nameValueObj('paramName', ['param Values']))));
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

    sParams = {
      organizationParam: new SearchParameter({
        name: ParameterName.ORGANIZATION,
        choices: organization,
        restricted: true,
      }),
      networkParam: new SearchParameter({
        name: ParameterName.NETWORK,
        choices: networks,
        restricted: true,
      }),
      stationIdParam: new SearchParameter({ name: ParameterName.STATION_ID }),
      stationNameParam: new SearchParameter({ name: ParameterName.STATION_NAME }),
      startDateParam: new SearchDatetime({ name: ParameterName.FROM }),
      endDateParam: new SearchDatetime({ name: ParameterName.TO }),
      hoursParam: new SearchHoursRange({ name: ParameterName.HOURS_RANGE }),
      hoursRangeDate: new SearchDatetime({ name: ParameterName.HOURS_RANGE_DATETIME }),
      provinceParam: new SearchParameter({ name: ParameterName.PROVINCE, choices: provinces, restricted: true }),
      sizeParam: new SearchParameter({
        name: ParameterName.SIZE,
        choices: [],
        restricted: false,
        required: false,
        timesUsable: 1,
      }),
    };

    const list = Object.keys(sParams).map(key => sParams[key]);
    const config: SearchBoxConfig = {
      searchList: list,
      taxonomies: [
        new SearchTaxonomy(caIndex, 'ca', 'msc'),
        new SearchTaxonomy(raIndex, 'ra', 'msc'),
        new SearchTaxonomy(dndAwosIndex, 'dnd awos', 'dnd'),
      ],
      readOnlyBar: false,
      shortcuts: [new ShortcutModel('Shortcut1', [{ name: ParameterName.NETWORK, values: ['ca', 'ra'] }])],
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

    searchService = TestBed.get(SearchService);
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
    searchService.addParameterByName(ParameterName.FROM);
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

    searchService.addSuggestedParameter(sParams.hoursRangeDate, [dateValue]);
    searchService.addSuggestedParameter(sParams.hoursParam, [hoursValue]);

    expect(searchService.displayParams).toEqual([sParams.hoursRangeDate, sParams.hoursParam]);
    expect(sParams.hoursRangeDate.getFullDatetime()).toEqual(new Date(dateValue));
    expect(sParams.hoursParam.hoursBefore).toEqual(1);
    expect(sParams.hoursParam.hoursAfter).toEqual(2);
  });

  it('should limit size on add', () => {
    const sizeValue = '2000';
    searchService.addSuggestedParameter(sParams.sizeParam, [sizeValue]);
    expect(sParams.sizeParam.getSelected()).toEqual([searchService.maxNumObs.toString()]);
  });

  it('should limit size on submit', () => {
    searchService.addSuggestedParameter(sParams.hoursRangeDate, ['2018-01-03T12:00Z']);
    searchService.addSuggestedParameter(sParams.sizeParam);
    searchService.setSelectedRangeType('hoursRange');
    sParams.sizeParam.selected = ['2000'];

    searchService.buildSearchModel();
    expect(sParams.sizeParam.selected).toEqual([searchService.maxNumObs.toString()]);
  });

  it('should adjust datetime in model if given hours range', () => {
    searchService.addSuggestedParameter(sParams.hoursRangeDate, ['2018-01-03T12:00Z']);
    searchService.addSuggestedParameter(sParams.hoursParam, [{ hh_before: '12', hh_after: '36' }]);
    searchService.setSelectedRangeType('hoursRange');

    const model = searchService.buildSearchModel();
    expect(model.from).toEqual(new Date('2018-01-03T00:00Z'));
    expect(model.to).toEqual(new Date('2018-01-05T00:00Z'));
  });

  it('should use default hours if specified', () => {
    sParams.hoursParam.setDefaultHours(5, 6);
    searchService.addSuggestedParameter(sParams.hoursRangeDate, ['2018-01-07T05:30Z']);
    searchService.addSuggestedParameter(sParams.hoursParam);
    searchService.setSelectedRangeType('hoursRange');

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
      paramValueObj(sParams.hoursRangeDate, ['2018-01-31T00:00Z']),
      paramValueObj(sParams.hoursParam, [{ hh_before: '12', hh_after: '21' }]),
      paramValueObj(sParams.networkParam, ['dnd awos']),
      paramValueObj(sParams.stationIdParam, ['123', 'abc']),
      paramValueObj(sParams.sizeParam, ['100']),
    ];
    spyOn(searchService, 'submitSearch');
    spyOn(searchService, 'updateUrl');

    searchService.searchByURLParameters(params);
    expect(searchService.updateUrl).toHaveBeenCalledTimes(0);
    expect(searchService.submitSearch).toHaveBeenCalled();
    expect(searchService.displayParams).toEqual([
      sParams.hoursRangeDate,
      sParams.hoursParam,
      sParams.networkParam,
      sParams.stationIdParam,
      sParams.sizeParam,
    ]);
    expect(sParams.hoursRangeDate.datetime).toEqual('2018-01-31 00:00');
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
      elements: [
        new SearchElement(SearchableElement.STATION_NAME.id, 'metadataElements', 'value', 'station name'),
        new SearchElement(SearchableElement.PROVINCE.id, 'metadataElements', 'value', 'AB'),
      ],
      from: new Date('2018-01-01T00:00Z'),
      to: new Date('2018-02-01T00:00Z'),
      size: 300,
      operator: ESOperator.And,
      httpParams: expectedHttpParams,
    };

    expect(searchService.buildSearchModel()).toEqual(expectedModel);
  });

  it('differentiate between station ids', () => {
    const createElement = (value, type) => ({
      station: value,
      searchElement: new SearchElement(SearchableElement.STATION_TYPE[type].id, 'metadataElements', 'value', value),
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
      stations.map(s => s.station),
    );

    expect(searchService.buildSearchModel().elements).toEqual(stations.map(s => s.searchElement));
  });

  it('should adjust wildcard in station', () => {
    const mscId = SearchableElement.STATION_TYPE.MSC_ID.id;
    const nameId = SearchableElement.STATION_NAME.id;
    const createElement = (value, id, adjustedValue) => ({
      station: value,
      searchElement: new SearchElement(id, 'metadataElements', 'value', adjustedValue),
    });

    const stations = [
      createElement('123456', mscId, '123456'),
      createElement('1234.*', mscId, '1234.*'),
      createElement('*123*', mscId, '.*123.*'),
    ];
    const stationName = createElement('name*', nameId, 'name.*');

    searchService.addSuggestedParameter(
      sParams.stationIdParam,
      stations.map(s => s.station),
    );
    searchService.addSuggestedParameter(sParams.stationNameParam, [stationName.station]);

    expect(searchService.buildSearchModel().elements).toEqual(
      stations.map(s => s.searchElement).concat(stationName.searchElement),
    );
  });

  it('should populate bar values to form', () => {
    searchService.readOnlyBar = true;
    searchService.addSuggestedParameter(sParams.provinceParam, ['BC']);
    searchService.addSuggestedParameter(sParams.hoursRangeDate, ['2018-01-01 00:10']);
    searchService.addSuggestedParameter(sParams.hoursParam, [{ hh_before: 1, hh_after: 2 }]);
    searchService.openForm();

    expect(sParams.provinceParam.formSelected).toEqual(['BC']);
    expect(sParams.hoursRangeDate.formDatetime).toEqual('2018-01-01 00:10');
    expect(sParams.hoursParam.formHoursBefore).toEqual(1);
    expect(sParams.hoursParam.formHoursAfter).toEqual(2);
  });

  it('should populate form values to bar', () => {
    sParams.sizeParam.formSelected = ['10'];
    sParams.hoursRangeDate.formDatetime = '2018-01-30 05:00';
    sParams.hoursParam.formHoursBefore = 10;
    sParams.hoursParam.formHoursAfter = 20;
    searchService.setSelectedRangeType('hoursRange');

    searchService.submitSearchForm();
    expect(sParams.sizeParam.getSelected()).toEqual(['10']);
    expect(sParams.hoursRangeDate.datetime).toEqual('2018-01-30 05:00');
    expect(sParams.hoursParam.hoursBefore).toEqual(10);
    expect(sParams.hoursParam.hoursAfter).toEqual(20);
  });

  it('should handle spaces for station search', () => {
    const nameId = SearchableElement.STATION_NAME.id;
    const wmoId = SearchableElement.STATION_TYPE.WMO_ID.id;
    const createElement = (value, id, adjustedValue) => ({
      station: value,
      searchElement: new SearchElement(id, 'metadataElements', 'value', adjustedValue),
    });

    const stationId = createElement(' 123 45 ', wmoId, '12345');
    const stationName = createElement(' station name ', nameId, 'station name');

    searchService.addSuggestedParameter(sParams.stationIdParam, [stationId.station]);
    searchService.addSuggestedParameter(sParams.stationNameParam, [stationName.station]);

    expect(searchService.buildSearchModel().elements).toEqual([stationId.searchElement, stationName.searchElement]);
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
    searchService.addSuggestedParameter(sParams.hoursRangeDate, ['2018-03-01T03:00Z']);
    searchService.setSelectedRangeType('dateRange');

    const model = searchService.buildSearchModel();
    expect(model.from).toEqual(new Date('2018-01-01T00:00Z'));
    expect(model.to).toEqual(new Date('2018-02-01T00:00Z'));
  });

  it('should use hour ranges on submit', () => {
    searchService.addSuggestedParameter(sParams.startDateParam, ['2018-01-01T00:00Z']);
    searchService.addSuggestedParameter(sParams.endDateParam, ['2018-02-01T00:00Z']);
    searchService.addSuggestedParameter(sParams.hoursParam, [{ hh_before: 1, hh_after: 1 }]);
    searchService.addSuggestedParameter(sParams.hoursRangeDate, ['2018-03-01T03:00Z']);
    searchService.setSelectedRangeType('hoursRange');

    const model = searchService.buildSearchModel();
    expect(model.from).toEqual(new Date('2018-03-01T02:00Z'));
    expect(model.to).toEqual(new Date('2018-03-01T04:00Z'));
  });
});
