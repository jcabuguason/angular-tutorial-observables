import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { LOCK_CONFIG, LockConfig } from './lock.config';
import { AcquireLockResponse } from './model/acquire-lock-response.model';
import { AcquireLockRequest } from './model/acquire-lock-request.model';
import { ReleaseLockRequest } from './model/release-lock-request.model';
import { ReleaseLockResponse } from './model/release-lock-response.model';
import { LockInfoParams } from './model/lock-info-params.model';
import { LockInfoResponse } from './model/lock-info-response.model';

@Injectable()
export class LockService {
  constructor(
    @Inject(LOCK_CONFIG)
    private config: LockConfig,
    private http: HttpClient
  ) { }

  acquireLock(body: AcquireLockRequest): Observable<AcquireLockResponse> {
    return this.http
      .post<AcquireLockResponse>(`${this.config.endpoint}/lock/acquire_lock`, body, {withCredentials: true});
  }

  releaseLock(body: ReleaseLockRequest): Observable<ReleaseLockResponse> {
    return this.http
      .post<ReleaseLockResponse>(`${this.config.endpoint}/lock/release_lock`, body, {withCredentials: true});
  }

  lockInfo(params: LockInfoParams): Observable<LockInfoResponse> {
    const httpParams = JSON.parse(JSON.stringify(params));
    return this.http
      .get<LockInfoResponse>(`${this.config.endpoint}/lock/lock_info`, {params: httpParams, withCredentials: true});
  }
}
