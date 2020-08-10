import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { formatDateToString } from 'msc-dms-commons-angular/shared/util';
import { ElasticSearchService } from './elastic-search.service';
import { ELASTIC_SEARCH_CONFIG, ElasticSearchConfig } from './elastic-search.config';
import { ESSortType } from './enum/es-sort-type.enum';
import { ESOperator } from './enum/es-operator.enum';

describe('ElasticSearchService', () => {
  const VERSION = 'v2.0';

  let injector: TestBed;
  let service: ElasticSearchService;
  let httpMock: HttpTestingController;
  let config: ElasticSearchConfig;

  beforeEach(() => {
    config = {
      endpoint: 'http://www.test.com',
    };
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ElasticSearchService, { provide: ELASTIC_SEARCH_CONFIG, useValue: config }],
    });
    injector = getTestBed();
    service = injector.get(ElasticSearchService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#performing search', () => {
    it('should return basic observations without params', () => {
      const dummyObs = {
        hello: 'world',
      };

      service.performSearch(VERSION, 'testNetwork').subscribe((response) => {
        expect(response).toEqual(dummyObs);
      });

      const req = httpMock.expectOne(`${config.endpoint}/search/${VERSION}/testNetwork/templateSearch`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    it('should search with non-query parameters', () => {
      const dummyObs = {
        hello: 'world',
      };

      const fromDate = new Date(2019, 1, 28);
      const toDate = new Date(2020, 1, 29);
      const dateFormat = { dateSeparator: '', timeSeparator: '', dateAndTimeSeparator: '' };

      service
        .performSearch(VERSION, 'testNetwork', {
          size: 10,
          from: fromDate,
          to: toDate,
          trackTotalHits: true,
          sortFields: [ESSortType.ObservationDateTimeAsc],
        })
        .subscribe((response) => {
          expect(response).toEqual(dummyObs);
        });

      const req = httpMock.expectOne(
        (r) =>
          r.params.get('size') === '10' &&
          r.params.get('from') === formatDateToString(fromDate, dateFormat) &&
          r.params.get('to') === formatDateToString(toDate, dateFormat) &&
          r.params.get('trackTotalHits') === 'true' &&
          r.params.get('sortFields') === ESSortType.ObservationDateTimeAsc,
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    it('should search with query params', () => {
      const dummyObs = {
        hello: 'world',
      };

      service
        .performSearch(VERSION, 'testNetwork', {
          size: 1,
          query: [
            {
              operator: ESOperator.And,
              elements: [
                {
                  elementID: '123',
                  value: 'foo',
                },
              ],
            },
          ],
        })
        .subscribe((response) => {
          expect(response).toEqual(dummyObs);
        });

      const req = httpMock.expectOne((r) => r.params.get('size') === '1' && r.params.get('query') === '123.value:foo');
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    it('should search with geo distance', () => {
      const dummyObs = {
        hello: 'world',
      };

      service
        .performSearch(VERSION, 'testNetwork', {
          size: 1,
          longitude: 0,
          latitude: 0,
          sortFields: [ESSortType.GeoDistanceAsc],
          distance: '200km',
          fields: ['identifier'],
        })
        .subscribe((response) => {
          expect(response).toEqual(dummyObs);
        });

      const req = httpMock.expectOne(
        (r) =>
          r.params.get('size') === '1' &&
          r.params.get('longitude') === '0' &&
          r.params.get('latitude') === '0' &&
          r.params.get('distance') === '200km' &&
          r.params.get('fields') === 'identifier' &&
          r.params.get('sortFields') === ESSortType.GeoDistanceAsc,
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    it('should search with multiple sort fields and fields', () => {
      const dummyObs = {
        hello: 'world',
      };

      service
        .performSearch(VERSION, 'testNetwork', {
          size: 1,
          sortFields: [ESSortType.GeoDistanceAsc, ESSortType.ObservationDateTimeAsc],
          fields: ['identifier', '1_7_8_9'],
        })
        .subscribe((response) => {
          expect(response).toEqual(dummyObs);
        });

      const req = httpMock.expectOne(
        (r) =>
          r.params.get('size') === '1' &&
          r.params.get('fields') === 'identifier,1_7_8_9' &&
          r.params.get('sortFields') === `${ESSortType.GeoDistanceAsc},${ESSortType.ObservationDateTimeAsc}`,
      );
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });
  });

  describe('#query formatting', () => {
    it('should format 1-chunk, 1-element queries', () => {
      expect(
        service.stringifyQuery([
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: '123',
                value: 'foo',
              },
            ],
          },
        ]),
      ).toEqual('123.value:foo');

      expect(
        service.stringifyQuery([
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: '123',
                value: 'foo',
                isNegation: true,
              },
            ],
          },
        ]),
      ).toEqual('NOT(123.value:foo)');
    });

    it('should format 1-chunk, multi-element queries', () => {
      expect(
        service.stringifyQuery([
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: '123',
                value: 'foo',
              },
              {
                elementID: '456',
                value: 'bar',
              },
            ],
          },
        ]),
      ).toEqual('(123.value:foo)AND(456.value:bar)');

      expect(
        service.stringifyQuery([
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: '123',
                value: 'foo',
                isNegation: true,
              },
              {
                elementID: '456',
                value: 'bar',
              },
            ],
          },
        ]),
      ).toEqual('(NOT(123.value:foo))AND(456.value:bar)');
    });

    it('should format multi-chunk, 1-element queries', () => {
      expect(
        service.stringifyQuery([
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: '123',
                value: 'foo',
              },
            ],
          },
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: '456',
                value: 'bar',
              },
            ],
          },
        ]),
      ).toEqual('(123.value:foo)AND(456.value:bar)');
    });

    it('should format multi-chunk, multi-element queries', () => {
      expect(
        service.stringifyQuery([
          {
            operator: ESOperator.Or,
            elements: [
              {
                elementID: '123',
                value: 'foo',
              },
              {
                elementID: '456',
                value: 'bar',
              },
            ],
          },
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: 'copy1',
                value: 'paste1',
              },
              {
                elementID: 'copy2',
                value: 'paste2',
              },
            ],
          },
        ]),
      ).toEqual('((123.value:foo)OR(456.value:bar))AND((copy1.value:paste1)AND(copy2.value:paste2))');
    });

    it('should escape values with spaces', () => {
      expect(
        service.stringifyQuery([
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: '123',
                value: 'foo bar',
              },
            ],
          },
        ]),
      ).toEqual('123.value:foo\\ bar');
    });

    it('should mark caseless values as lowercase', () => {
      expect(
        service.stringifyQuery([
          {
            operator: ESOperator.And,
            elements: [
              {
                elementID: '123',
                value: 'foo',
                isCaseless: true,
              },
            ],
          },
        ]),
      ).toEqual('123.value.lowercase:foo');
    });
  });
});
