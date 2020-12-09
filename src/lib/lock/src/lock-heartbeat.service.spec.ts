import { TestBed, getTestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import { LockHeartbeatService } from './lock-heartbeat.service';
import { LockConfig, LOCK_CONFIG } from './lock.config';
import { LockService } from './lock.service';
import { TextDialogModule, TextDialogComponent } from 'msc-dms-commons-angular/core/text-dialog';

describe('LockHeartbeatService', () => {
  let service: LockHeartbeatService;
  let lockService: LockService;

  const responses = {
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

  beforeEach(() => {
    const config: LockConfig = {
      endpoint: 'http://www.test.com',
      coreTTL: 5,
      applicationTTL: 60,
      warning: 5,
    };

    TestBed.configureTestingModule({
      imports: [MatDialogModule, TextDialogModule, NoopAnimationsModule],
      providers: [
        MatDialog,
        LockHeartbeatService,
        {
          provide: LockService,
          useValue: {
            acquireLock: (body) => responses.acquireLock,
            releaseLock: (body) => responses.releaseLock,
            lockInfo: (param) => responses.lockInfo,
          },
        },
        { provide: LOCK_CONFIG, useValue: config },
      ],
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [TextDialogComponent],
      },
    });

    const injector = getTestBed();
    service = injector.inject(LockHeartbeatService);
    lockService = injector.inject(LockService);
  });

  it('should lock after 60 ms of idle time', fakeAsync(() => {
    const results = {
      unsuccessful: 0,
      unauthorized: 0,
      successful: 0,
    };
    spyOn(lockService, 'acquireLock').and.returnValue(responses.acquireLock);
    spyOn(lockService, 'releaseLock').and.returnValue(responses.releaseLock);

    service.startLockHeartbeat(
      ['1'],
      'metadata',
      () => results.unsuccessful++,
      () => results.unauthorized++,
      () => results.successful++,
    );

    tick(29);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(6);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(0);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(6);

    tick(31);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(12);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(1);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(12);

    tick(60);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(12);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(12);

    flush();
  }));

  it('should reset the idle timer after a action', fakeAsync(() => {
    const results = {
      unsuccessful: 0,
      unauthorized: 0,
      successful: 0,
    };

    spyOn(lockService, 'acquireLock').and.returnValue(responses.acquireLock);
    spyOn(lockService, 'releaseLock').and.returnValue(responses.releaseLock);

    service.startLockHeartbeat(
      ['1'],
      'metadata',
      () => results.unsuccessful++,
      () => results.unauthorized++,
      () => results.successful++,
    );

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(7);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(0);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(7);

    document.documentElement.click();

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(13);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(0);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(13);

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(18);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(1);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(18);
  }));

  it('should lock the user', fakeAsync(() => {
    const results = {
      unsuccessful: 0,
      unauthorized: 0,
      successful: 0,
    };

    const acquireLock = spyOn(lockService, 'acquireLock').and.returnValue(responses.acquireLock);
    spyOn(lockService, 'releaseLock').and.returnValue(responses.releaseLock);
    spyOn(lockService, 'lockInfo').and.returnValue(responses.lockInfo);

    service.startLockHeartbeat(
      ['1'],
      'metadata',
      () => results.unsuccessful++,
      () => results.unauthorized++,
      () => results.successful++,
    );

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(7);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(0);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(7);

    acquireLock.and.returnValue(Observable.throwError(new HttpErrorResponse({ status: 423 })));

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(8);
    expect(lockService.releaseLock).toHaveBeenCalledTimes(1);
    expect(results.unsuccessful).toBe(1);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(7);
  }));

  it('should be unauthorized', fakeAsync(() => {
    const results = {
      unsuccessful: 0,
      unauthorized: 0,
      successful: 0,
    };

    const acquireLock = spyOn(lockService, 'acquireLock').and.returnValue(responses.acquireLock);
    spyOn(lockService, 'releaseLock').and.returnValue(responses.releaseLock);
    service.startLockHeartbeat(
      ['1'],
      'metadata',
      () => results.unsuccessful++,
      () => results.unauthorized++,
      () => results.successful++,
    );
    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(7);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(0);
    expect(results.successful).toBe(7);

    acquireLock.and.returnValue(Observable.throwError(new HttpErrorResponse({ status: 401 })));

    tick(30);
    expect(lockService.acquireLock).toHaveBeenCalledTimes(8);
    expect(results.unsuccessful).toBe(0);
    expect(results.unauthorized).toBe(1);
    expect(results.successful).toBe(7);
  }));
});
