import { Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { takeUntil, mergeMap, timeout, take, catchError } from 'rxjs/operators';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import { LOCK_CONFIG, LockConfig } from './lock.config';
import { LockService } from './lock.service';
import { TextDialogComponent } from 'msc-dms-commons-angular/core/text-dialog';

@Injectable()
export class LockHeartbeatService {

  private static readonly INTERRUPTS = ['click', 'mousemove', 'keydown', 'scroll'];
  private static readonly ONE_MINUTE = 60000;

  private heartbeat$: Observable<number>;
  private userActivity$: Observable<any>;
  private unsubscribe: Subject<void>;
  private heartbeatSubscription: Subscription;
  private warningDialogRef: MatDialogRef<TextDialogComponent>;
  private hasLock: boolean;
  private resourceIDs: string[];
  private type: string;
  private handleUnsuccessfulLock: () => void;
  private handleUnauthorizedLock: () => void;

  constructor(
    @Inject(LOCK_CONFIG)
    private config: LockConfig,
    private lockService: LockService,
    private dialog: MatDialog
  ) {
    this.heartbeat$ = Observable.timer(0, this.config.coreTTL);
    const events$ = LockHeartbeatService.INTERRUPTS
      .map((event) => Observable.fromEvent(document, event));
    this.userActivity$ = Observable.merge(...events$);
    this.unsubscribe = new Subject<void>();
    this.hasLock = false;
  }

  startLockHeartbeat(
    resourceIDs: string[],
    type: string,
    handleUnsuccessfulLock: () => void,
    handleUnauthorizedLock: () => void
  ) {
    this.hasLock = false;
    this.resourceIDs = resourceIDs;
    this.type = type;
    this.handleUnsuccessfulLock = handleUnsuccessfulLock;
    this.handleUnauthorizedLock = handleUnauthorizedLock;
    this.startHeartbeat();
    this.startWarningTimeout();
    this.startApplicationTimeout();
  }

  removeLockHeartbeat() {
    this.lockService.releaseLock({resource_id: this.resourceIDs, type: this.type})
      .subscribe(
        value => {},
        error => {
          if (error.status === 401) {
            this.handleUnauthorizedLock();
          } else {
            this.handleUnsuccessfulLock();
          }
        }
      );
    this.unsubscribe.next();
  }

  private startHeartbeat() {
    this.heartbeatSubscription = this.heartbeat$
      .pipe(
        takeUntil(this.unsubscribe),
        mergeMap(() => this.lockService.acquireLock({resource_id: this.resourceIDs, type: this.type, reset_enabled: true}))
      )
      .subscribe(
        response => {
          this.hasLock = true;
        },
        (error: HttpErrorResponse) => {

          this.hasLock = false;

          if (error.status === 423) {

            const lockInfos = this.resourceIDs.map((resourceID) => {
              return this.lockService
                .lockInfo({resource_id: resourceID, type: this.type})
                .pipe(
                  catchError((lockInfoError) => {
                    this.handleUnknownError(lockInfoError);
                    return Observable.of(null);
                  })
                );
            });

            Observable.forkJoin(lockInfos).subscribe(
              (lockInfoResponses) => {

                lockInfoResponses = lockInfoResponses.filter((info) => info != null);

                if (lockInfoResponses.length > 0) {

                  const lockMessage: string[] = [];
                  const commonLockInfo = lockInfoResponses[0];
                  const lockName = `${commonLockInfo.user_first_name} ${commonLockInfo.user_last_name}`;
                  const lockTimeout = commonLockInfo.timeout;

                  lockMessage.push(`${lockName} has alrady locked the following resources:`);
                  for (const info of lockInfoResponses) {
                    lockMessage.push(`    * ${info.resource_id}`);
                  }
                  lockMessage.push(`The resource will be freed at ${lockTimeout}.`);
                  lockMessage.push(`Please try again later.`);

                  this.dialog.open(TextDialogComponent, {
                    data: {
                      message: lockMessage
                    }
                  });
                }
              }
            );

            this.handleUnsuccessfulLock();

          } else if (error.status === 401) {
            this.handleUnauthorizedLock();
          } else {
            this.handleUnsuccessfulLock();
          }
        }
      );
  }

  private startWarningTimeout() {
    this.userActivity$
      .pipe(
        takeUntil(this.unsubscribe),
        timeout(this.config.applicationTTL - this.config.warning)
      )
      .subscribe(
        value => {},
        err => {
          const appMinutes = this.config.applicationTTL / LockHeartbeatService.ONE_MINUTE;
          const warningMinutes = this.config.warning / LockHeartbeatService.ONE_MINUTE;
          this.warningDialogRef = this.dialog.open(TextDialogComponent, {
            data: {
              message: [
                `You have been idle for ${appMinutes - warningMinutes} minutes.`,
                `You will lose your lock in ${warningMinutes} minutes.`
              ]
            }
          });

          this.warningDialogRef.afterClosed()
            .pipe(take(1))
            .subscribe(() => {
              if (this.hasLock) {
                this.startWarningTimeout();
              }
            });
        });
  }

  private startApplicationTimeout() {
    this.userActivity$
      .pipe(
        takeUntil(this.unsubscribe),
        timeout(this.config.applicationTTL)
      )
      .subscribe(
        value => {},
        err => {
          this.heartbeatSubscription.unsubscribe();
          this.hasLock = false;

          this.lockService.releaseLock({resource_id: this.resourceIDs, type: this.type})
            .subscribe(
              response => {
                this.handleSuccessfulRelease();
              },
              (error: HttpErrorResponse) => {
                if (error.status === 401) {
                  this.handleUnauthorizedLock();
                } else {
                  this.handleUnsuccessfulLock();
                }
              }
            );
        }
      );
  }

  private handleUnknownError(error) {
    console.log('Unknown error: ', error);
  }

  private handleSuccessfulRelease() {
    const appMinutes = this.config.applicationTTL / LockHeartbeatService.ONE_MINUTE;
    const dialogRef = this.dialog.open(TextDialogComponent, {
      data: {
        message: [
          `You have been idle for ${appMinutes} minutes, so your lock has been removed. Click to attempt to regain lock.`
        ]
      }
    });

    dialogRef.afterOpen()
      .pipe(take(1))
      .subscribe(() => {
        this.warningDialogRef.close();
      });

    dialogRef.afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.startLockHeartbeat(this.resourceIDs, this.type, this.handleUnsuccessfulLock, this.handleUnauthorizedLock);
      });
  }
}
