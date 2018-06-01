import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

import { ElasticSearchService } from './elastic-search.service';
import { ELASTIC_SEARCH_CONFIG, ElasticSearchConfig } from './elastic-search.config';
import { ElasticSearchDateTimeType } from './model/elastic-search-date-time-type.model';

describe('ElasticSearchService', () => {
  let injector: TestBed;
  let service: ElasticSearchService;
  let httpMock: HttpTestingController;
  let config: ElasticSearchConfig;

  beforeEach(() => {
    config = {
      endpoint: 'http://www.test.com'
    };
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ElasticSearchService,
        { provide: ELASTIC_SEARCH_CONFIG, useValue: config}
      ]
    });
    injector = getTestBed();
    service = injector.get(ElasticSearchService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#get aliases', () => {
    it('should return a list of strings', () => {
      const dummyAliases = {
        indexes: [
          'dms_ca_bulkinsert',
          'dnd:observation:atmospheric:surface_weather:awos-1.0-binary_11'
        ]
      };

      service.getAllSearchableAliases().subscribe((response) => {
        expect(response).toEqual(dummyAliases.indexes);
      });

      const req = httpMock.expectOne(`${config.endpoint}/search/`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyAliases);
    });
  });

  describe('#observation based endpionts', () => {
    it('should return basic observations', () => {
      const dummyObs = {
        hello: 'world'
      };

      service.getBasicObservations('v1.0', 'testNetwork').subscribe((response) => {
        expect(response).toEqual(dummyObs);
      });

      const req = httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    it('should return unique stations', () => {
      const dummyObs = {
        hello: 'world'
      };

      service.getUniqueStations('v1.0', 'testNetwork').subscribe((response) => {
        expect(response).toEqual(dummyObs);
      });

      const req = httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork/stations`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    it('should return observations from stations', () => {
      const dummyObs = {
        hello: 'world'
      };

      service.getObservationsFromStations('v1.0', 'testNetwork', ['1', '2']).subscribe((response) => {
        expect(response).toEqual(dummyObs);
      });

      const req = httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork/stations/1,2`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    it('should return unique elements', () => {
      const dummyObs = {
        hello: 'world'
      };

      service.getUniqueElements('v1.0', 'testNetwork').subscribe((response) => {
        expect(response).toEqual(dummyObs);
      });

      const req = httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork/elements`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    it('should return observations from elements', () => {
      const dummyObs = {
        hello: 'world'
      };

      service.getObservationsFromElements('v1.0', 'testNetwork', ['1', '2']).subscribe((response) => {
        expect(response).toEqual(dummyObs);
      });

      const req = httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork/elements/1,2`);
      expect(req.request.method).toBe('GET');
      req.flush(dummyObs);
    });

    describe('#common parameters', () => {
      it('should correctly set type', () => {
        service.getBasicObservations('v1.0', 'testNetwork', {type: 'metadata'}).subscribe();
        httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork?type=metadata`);
      });

      it('should correctly set size', () => {
        service.getBasicObservations('v1.0', 'testNetwork', {size: 10}).subscribe();
        httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork?size=10`);
      });

      it('should correctly set from', () => {
        const date = new Date();
        date.setFullYear(2017);
        date.setMonth(4);
        date.setDate(20);
        date.setHours(11);
        date.setMinutes(25);
        service.getBasicObservations('v1.0', 'testNetwork', {from: date}).subscribe();
        httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork?from=201705201125`);
      });

      it('should correctly set to', () => {
        const date = new Date();
        date.setFullYear(2017);
        date.setMonth(4);
        date.setDate(20);
        date.setHours(11);
        date.setMinutes(25);
        service.getBasicObservations('v1.0', 'testNetwork', {to: date}).subscribe();
        httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork?to=201705201125`);
      });

      it('should correctly set datetimetype', () => {
        service.getBasicObservations('v1.0', 'testNetwork', {datetimeType: ElasticSearchDateTimeType.ObservationDateTime}).subscribe();
        httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork?datetimeType=obsDateTime`);
      });

      it('should correctly set sortFields', () => {
        service.getBasicObservations('v1.0', 'testNetwork', {sortFields: '+elementID'}).subscribe();
        httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork?sortFields=%2BelementID`);
      });

      it('should correctly set startIndex', () => {
        service.getBasicObservations('v1.0', 'testNetwork', {startIndex: '50'}).subscribe();
        httpMock.expectOne(`${config.endpoint}/search/v1.0/testNetwork?startIndex=50`);
      });
    });

  });
});
