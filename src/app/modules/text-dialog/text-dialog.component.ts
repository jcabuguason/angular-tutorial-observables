import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

interface TextDialogData {
  message?: string;
  context?: string;
}

@Component({
  selector: 'commons-text-dialog',
  templateUrl: 'text-dialog.component.html',
  styleUrls: [ 'text-dialog.component.css' ]
})
export class TextDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: TextDialogData) { }
}
