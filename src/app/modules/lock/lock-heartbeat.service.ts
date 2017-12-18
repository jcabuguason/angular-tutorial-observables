import { Injectable, Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { takeUntil, mergeMap, timeout, take } from 'rxjs/operators';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/forkJoin';

import { LOCK_CONFIG, LockConfig } from './lock.config';
import { LockService } from './lock.service';
import { TextDialogComponent } from '../text-dialog/text-dialog.component';

@Injectable()
export class LockHeartbeatService {

  private static readonly INTERRUPTS = ['click', 'mousemove', 'keydown', 'scroll'];
  private static readonly ONE_MINUTE = 6000;

  private heartbeat$: Observable<number>;
  private userActivity$: Observable<any>;
  private unsubscribe: Subject<void>;
  private heartbeatSubscription: Subscription;
  private warningDialogRef: MatDialogRef<TextDialogComponent>;

  constructor(
    @Inject(LOCK_CONFIG)
    private config: LockConfig,
    private lockService: LockService,
    private dialog: MatDialog
  ) {
    this.heartbeat$ = Observable.timer(0, this.config.coreTTL);
    const events$ = LockHeartbeatService.INTERRUPTS.map((event) => {
      return Observable.fromEvent(document, event);
    });
    this.userActivity$ = Observable.merge(...events$);
    this.unsubscribe = new Subject<void>();
  }

  startLockHeartbeat(resourceIDs: string[], type: string, handleUnsuccessfulLock: () => void) {
    this.startHeartbeat(resourceIDs, type, handleUnsuccessfulLock);
    this.startWarningTimeout();
    this.startApplicationTimeout(resourceIDs, type, handleUnsuccessfulLock);
  }

  removeLockHeartbeat() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private startHeartbeat(resourceIDs: string[], type: string, handleUnsuccessfulLock: () => void) {
    this.heartbeatSubscription = this.heartbeat$
      .pipe(
        takeUntil(this.unsubscribe),
        mergeMap(() => this.lockService.aquireLock({resource_id: resourceIDs, type, reset_enabled: true}))
      )
      .subscribe(
        response => {},
        (error: HttpErrorResponse) => {
          if (error.status === 423) {

            const lockInfos = resourceIDs.map((resourceID) => {
              return this.lockService.lockInfo({resource_id: resourceID, type});
            });

            Observable.forkJoin(lockInfos).subscribe((lockInfoResponses) => {

              let lockMessage = 'Unable to aquire lock:\n';
              for (const info of lockInfoResponses) {
                lockMessage += `${info.user_first_name} ${info.user_last_name}, has already locked ${info.resource_id}.\n`;
                lockMessage += `The resource will be freed at ${info.timeout}.\n`;
              }
              lockMessage += `Try again later.`;

              this.dialog.open(TextDialogComponent, {
                data: {
                  message: lockMessage
                }
              });

            });

            handleUnsuccessfulLock();

          } else if (error.status === 401) {
            handleUnsuccessfulLock();
          } else {
            this.handleUnknownError(error);
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
              message: `You have been idle for ${appMinutes} minutes. You will lose your lock in ${warningMinutes} minutes.`
            }
          });
        });
  }

  private startApplicationTimeout(resourceIDs: string[], type: string, handleUnsuccessfulLock: () => void) {
    this.userActivity$
      .pipe(
        takeUntil(this.unsubscribe),
        timeout(this.config.applicationTTL)
      )
      .subscribe(
        value => {
          if (this.warningDialogRef) {
            this.warningDialogRef.close();
            this.startWarningTimeout();
          }
        },
        err => {
          this.heartbeatSubscription.unsubscribe();

          this.lockService.releaseLock({resource_id: resourceIDs, type})
            .subscribe(
              response => {
                const appMinutes = this.config.applicationTTL / LockHeartbeatService.ONE_MINUTE;
                const dialogRef = this.dialog.open(TextDialogComponent, {
                  data: {
                    message: `You have been idle for ${appMinutes} minutes, so your lock has been removed. Click to attempt to regain lock.`
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
                    this.startLockHeartbeat(resourceIDs, type, handleUnsuccessfulLock);
                  });
              },
              (error: HttpErrorResponse) => {
                if (error.status === 401) {
                  handleUnsuccessfulLock();
                } else {
                  this.handleUnknownError(error);
                }
              }
            );
        }
      );
  }

  private handleUnknownError(error) {
    console.log('Unknown error: ' + error);
  }
}
