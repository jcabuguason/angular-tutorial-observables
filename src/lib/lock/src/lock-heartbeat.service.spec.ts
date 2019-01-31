import { TestBed, getTestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { LockHeartbeatService } from './lock-heartbeat.service';
import { LockConfig, LOCK_CONFIG } from './lock.config';
import { LockService } from './lock.service';
import { TextDialogModule, TextDialogComponent } from 'msc-dms-commons-angular/core/text-dialog';
import { AcquireLockResponse } from './model/acquire-lock-response.model';
import { ReleaseLockResponse } from './model/release-lock-response.model';
import { LockInfoResponse } from './model/lock-info-response.model';

describe('LockHeartbeatService', () => {
  let service: LockHeartbeatService;
  let lockService: LockService;
  let lockServiceStub: LockServiceStub;

  interface LockServiceStub {
    acquireLock: Observable<AcquireLockResponse>;
    releaseLock: Observable<ReleaseLockResponse>;
    lockInfo: Observable<LockInfoResponse>;
  }

  beforeEach(() => {
    const config: LockConfig = {
      endpoint: 'http://www.test.com',
      coreTTL: 5,
      applicationTTL: 60,
      warning: 5,
    };

    lockServiceStub = {
      acquireLock: Observable.of({
        locked_resources: ['1'],
        timeout: '',
        type: '',
        user: 'dsa',
      }),
      releaseLock: Observable.of({
        unlocked_resources: ['1'],
        failed_unlocks: [],
      }),
      lockInfo: Observable.of({
        resource_id: 'string',
        type: 'string',
        user: 'string',
        user_first_name: 'string',
        user_last_name: 'string',
        timeout: 'string',
      }),
    };

    TestBed.configureTestingModule({
      imports: [MatDialogModule, TextDialogModule, NoopAnimationsModule],
      providers: [
        MatDialog,
        LockHeartbeatService,
        { provide: LockService, useValue: lockServiceStub },
        { provide: LOCK_CONFIG, useValue: config },
      ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [TextDialogComponent],
      },
    });

    service = getTestBed().get(LockHeartbeatService);
    lockService = getTestBed().get(LockService);
  });

  it('should lock after 60 ms of idle time', fakeAsync(() => {
    const results = {
      unsuccessful: 0,
      unauthorized: 0,
    };
    spyOn(lockService, 'acquireLock').and.returnValue(lockServiceStub.acquireLock);
    spyOn(lockService, 'releaseLock').and.returnValue(lockServiceStub.releaseLock);

    service.startLockHeartbeat(['1'], 'metadata', () => results.unsuccessful++, () => results.unauthorized++);

    tick(29);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(6);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(0);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);

    tick(31);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(12);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(1);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);

    tick(60);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(12);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);

    flush();
  }));

  it('should reset the idle timer after a action', fakeAsync(() => {
    const results = {
      unsuccessful: 0,
      unauthorized: 0,
    };

    spyOn(lockService, 'acquireLock').and.returnValue(lockServiceStub.acquireLock);
    spyOn(lockService, 'releaseLock').and.returnValue(lockServiceStub.releaseLock);

    service.startLockHeartbeat(['1'], 'metadata', () => results.unsuccessful++, () => results.unauthorized++);

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(7);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(0);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);

    document.documentElement.click();

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(13);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(0);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(18);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(1);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
  }));

  it('should lock the user', fakeAsync(() => {
    const results = {
      unsuccessful: 0,
      unauthorized: 0,
    };

    const acquireLock = spyOn(lockService, 'acquireLock').and.returnValue(lockServiceStub.acquireLock);
    spyOn(lockService, 'releaseLock').and.returnValue(lockServiceStub.releaseLock);
    spyOn(lockService, 'lockInfo').and.returnValue(lockServiceStub.lockInfo);

    service.startLockHeartbeat(['1'], 'metadata', () => results.unsuccessful++, () => results.unauthorized++);

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(7);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(0);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);

    acquireLock.and.returnValue(Observable.throw(new HttpErrorResponse({ status: 423 })));

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(8);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(1);
    expect(results.unsuccessful).toBe(1);
    expect(results.unauthorized).toBe(0);
  }));

  it('should be unauthorized', fakeAsync(() => {
    const results = {
      unsuccessful: 0,
      unauthorized: 0,
    };

    const acquireLock = spyOn(lockService, 'acquireLock').and.returnValue(lockServiceStub.acquireLock);
    spyOn(lockService, 'releaseLock').and.returnValue(lockServiceStub.releaseLock);
    service.startLockHeartbeat(['1'], 'metadata', () => results.unsuccessful++, () => results.unauthorized++);
    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(7);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);

    acquireLock.and.returnValue(Observable.throw(new HttpErrorResponse({ status: 401 })));

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(8);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(1);
  }));
});
