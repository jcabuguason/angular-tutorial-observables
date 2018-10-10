import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface StationInfoInterface {
  allData?: {};
}

@Component({
  selector: 'commons-station-info',
  templateUrl: './station-info.component.html',
  styleUrls: ['./station-info.component.css']
})
export class StationInfoComponent {

  allData;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StationInfoInterface,
  )  { this.allData = data.allData; }
}
