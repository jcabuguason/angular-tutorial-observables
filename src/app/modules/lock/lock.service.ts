import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { LOCK_CONFIG, LockConfig } from './lock.config';
import { AquireLockResponse } from './model/aquire-lock-response.model';
import { AquireLockRequest } from './model/aquire-lock-request.model';
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

  aquireLock(body: AquireLockRequest) {
    return this.http
      .post<AquireLockResponse>(`${this.config.endpoint}/lock/aquire_lock`, body);
  }

  releaseLock(body: ReleaseLockRequest) {
    return this.http
      .post<ReleaseLockResponse>(`${this.config.endpoint}/lock/release_lock`, body);
  }

  lockInfo(params: LockInfoParams) {
    const httpParams = JSON.parse(JSON.stringify(params));
    return this.http
      .get<LockInfoResponse>(`${this.config.endpoint}/lock/lock_info`, {params: httpParams});
  }
}
