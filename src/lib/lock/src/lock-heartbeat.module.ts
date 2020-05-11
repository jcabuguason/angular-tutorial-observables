import { NgModule } from '@angular/core';
import { LockHeartbeatService } from './lock-heartbeat.service';
import { LockService } from './lock.service';
import { MatDialogModule } from '@angular/material/dialog';
import { TextDialogModule } from 'msc-dms-commons-angular/core/text-dialog';

@NgModule({
  imports: [MatDialogModule, TextDialogModule],
  providers: [LockHeartbeatService, LockService],
})
export class LockHeartbeatModule {}
