import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

export interface StationInfoInterface {
  name?: string;
  allData?: {};
}

@Component({
  selector: 'commons-station-info',
  templateUrl: './station-info.component.html',
  styleUrls: ['./station-info.component.css'],
})
export class StationInfoComponent {
  nameParam;
  allData;

  constructor(@Inject(MAT_DIALOG_DATA) public data: StationInfoInterface, public translate: TranslateService) {
    this.nameParam = { name: data.name };
    this.allData = data.allData;
  }
}
