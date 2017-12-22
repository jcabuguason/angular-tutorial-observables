import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material';

import { TextDialogComponent } from './text-dialog.component';

@NgModule({
  imports: [ CommonModule, MatDialogModule ],
  declarations: [ TextDialogComponent ],
  entryComponents: [ TextDialogComponent ],
  exports: [ TextDialogComponent ]
})
export class TextDialogModule { }
