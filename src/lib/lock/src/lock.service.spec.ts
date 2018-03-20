import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LockService } from './lock.service';
import { LOCK_CONFIG, LockConfig } from './lock.config';

describe('LockService', () => {
  let service: LockService;
  let httpMock: HttpTestingController;
  let config: LockConfig;

  beforeEach(() => {

    config = {
      endpoint: 'http://test.com',
      applicationTTL: 60,
      coreTTL: 5,
      warning: 5
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        LockService,
        {provide: LOCK_CONFIG, useValue: config}
      ]
    });

    const injector = getTestBed();
    service = injector.get(LockService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should make a call to get locks', () => {

    const result = {
      locked_resources: ['1', '2'],
      type: 'number',
      user: 'dms',
      timeout: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''
    };

    service.acquireLock({resource_id: ['1', '2'], type: 'number', reset_enabled: true}).subscribe((response) => {
      expect(response).toBe(result);
    });

    const req = httpMock.expectOne(`${config.endpoint}?url=/lock/acquire_lock`);
    expect(req.request.body).toEqual({resource_id: ['1', '2'], type: 'number', reset_enabled: true});
    req.flush(result);
  });

  it('should make a call to remove locks', () => {

    const result = {
      unlocked_resources: [
        '1'
      ],
      failed_unlocks: []
    };

    service.releaseLock({resource_id: ['1'], type: 'number'}).subscribe((response) => {
      expect(response).toEqual(result);
    });

    const req = httpMock.expectOne(`${config.endpoint}?url=/lock/release_lock`);
    expect(req.request.body).toEqual({resource_id: ['1'], type: 'number'});
    req.flush(result);
  });

  it('should make a call to get lock info', () => {

    const result = {
      resource_id: '1',
      type: 'number',
      user: '',
      user_first_name: '',
      user_last_name: '',
      timeout: '',
    };

    service.lockInfo({resource_id: '1', type: 'number'}).subscribe((response) => {
      expect(response).toEqual(result);
    });
    const req = httpMock.expectOne(request => request.method === 'GET' && request.url === `${config.endpoint}?url=/lock/lock_info`);
    expect(req.request.params.get('resource_id')).toEqual('1');
    expect(req.request.params.get('type')).toEqual('number');
    req.flush(result);
  });
});
